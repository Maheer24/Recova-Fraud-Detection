from fastapi import FastAPI, File, UploadFile
import pandas as pd
import dill
from io import StringIO
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import seaborn as sns
import matplotlib.pyplot as plt
from fastapi.staticfiles import StaticFiles
import os
import re
import hashlib
from dotenv import load_dotenv

from charts import (
    pie_chart,
    cases_by_location,
    unique_ips_by_category,
    wallet_balance_account_age_bubble_chart,
    deposit_status_pie_chart,
    radar_chart_transaction_profiles,
)


app = FastAPI()

app.mount("/images", StaticFiles(directory="images"), name="images")

origins = ["http://localhost:5174"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["http://localhost:5174"],
)

# Load the trained model
load_dotenv()

model_path = os.getenv("MODEL_PATH")

transaction_type_detection_model = dill.load(
    open(
        model_path,
        "rb",
    )
)

# Dictionary to store processed dataframe
processed_df = {}
file_meta = {}
last_file_id_by_filename = {}


@app.post("/upload_csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        content = await file.read()  # reads file as bytes

        # Check if file is an Excel file
        if file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            file.file.seek(0)
            df = pd.read_excel(file.file)
        else:
            csv_string = content.decode("utf-8")  # converts bytes into a string
            df = pd.read_csv(
                StringIO(
                    csv_string
                )  # StringIO(csv_string) -> converts string to an in memory (data is stored in RAM) file like object
            )

        # Check if required columns are present
        required_columns = [
            "location",
            "num_of_unique_IPs_used",
            "login_count",
            "num_of_frequent_operations",
            "c2c_place_order_count",
            "c2c_release_order_count",
            "gift_card_created_amount",
            "gift_card_redeemed_amount",
            "amount",
            "wallet_balance",
            "wallet_free_balance",
            "wallet_locked_balance",
            "deposit_status",
            "transaction_time",
            "prev_transaction_time",
            "account_age_days",
        ]

        if not all(col in df.columns for col in required_columns):
            return JSONResponse(
                content={"error": "Required columns missing in uploaded CSV file"},
                status_code=400,
            )

        # Covert date columns to datetime format
        df["transaction_time"] = pd.to_datetime(df["transaction_time"])
        df["prev_transaction_time"] = pd.to_datetime(df["prev_transaction_time"])

        # use the required features only (in case other columns are present)
        input_df = df[required_columns]

        # Map predictions to labels
        prediction_labels = {0: "Anomalous", 1: "Fraudulent", 2: "Normal"}

        df["status"] = transaction_type_detection_model.predict(input_df)
        df["status"] = df["status"].map(prediction_labels)

        # Covert date columns to strings as JSON does not support the datetime data type
        df["transaction_time"] = df["transaction_time"].astype(str)
        df["prev_transaction_time"] = df["prev_transaction_time"].astype(str)

        # print(df.head())

        file_hash = hashlib.sha256(content).hexdigest()
        file_id = f"{file.filename}:{file_hash}"

        # processed_df["transaction.csv"] = df
        processed_df[file_id] = df
        file_meta[file_id] = {"filename": file.filename, "hash": file_hash}
        last_file_id_by_filename[file.filename] = file_id

        return JSONResponse(
            content={
                "data": df.to_dict(orient="records"),
                "file_id": file_id,
                "filename": file.filename,
            }
        )

    except UnicodeDecodeError:
        return JSONResponse(
            content={"error": "Upload an Excel or CSV file"}, status_code=400
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/download_csv/")
async def download_csv(filename: str = None, file_id: str = None):
    try:
        if not file_id and filename:
            file_id = last_file_id_by_filename.get(filename)

        if not file_id or file_id not in processed_df:
            return JSONResponse(
                content={"error": "No processed file found with this name"},
                status_code=400,
            )

        #  processed_df = {
        #      "transactions.csv": <Pandas DataFrame>,
        #  }
        df = processed_df[file_id]
        original_name = file_meta.get(file_id, {}).get("filename", filename or "file")

        # in memory text buffer (acts as a file) to temporary store the dataframe before sending to user
        output = StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename= {original_name}_predicted.csv"
            },
        )
    except Exception as e:
        return JSONResponse(content={"error": str(e)})


@app.post("/display_images")
async def display_images(
    filename: str = None,
    file_id: str = None,
    force: bool = False,
    chart: str = None,
):
    try:
        if not file_id and filename:
            file_id = last_file_id_by_filename.get(filename)

        if not file_id or file_id not in processed_df:
            return JSONResponse(
                content={"error": "No processed file found with this name"},
                status_code=400,
            )

        df = processed_df[file_id]
        meta = file_meta.get(file_id, {})
        original_name = meta.get("filename", filename or "file")
        file_hash = meta.get("hash", "")

        base_name = re.sub(r"[^a-zA-Z0-9_-]+", "_", os.path.splitext(original_name)[0])
        hash_suffix = file_hash[:10] if file_hash else "unknown"
        safe_name = f"{base_name}_{hash_suffix}"
        output_dir = os.path.join("images", safe_name)

        expected_files = {
            "pie_image_url": "pie_chart.svg",
            "location_bar_chart_url": "location_bar_chart.svg",
            "unique_ips_by_category_url": "unique_ip_bar_chart.svg",
            "wallet_balance_account_age_bubble_chart_url": "wallet_bal_acc_age_bubble_chart.svg",
            "deposit_status_pie_chart_url": "deposit_status_pie_chart.svg",
            "radar_chart_transaction_profiles_url": "radar_chart_transaction_profiles.svg",
        }

        chart_generators = {
            "pie_image_url": lambda: pie_chart(df, output_dir=output_dir),
            "location_bar_chart_url": lambda: cases_by_location(df, output_dir=output_dir),
            "unique_ips_by_category_url": lambda: unique_ips_by_category(
                df, output_dir=output_dir
            ),
            "wallet_balance_account_age_bubble_chart_url": lambda: wallet_balance_account_age_bubble_chart(
                df, output_dir=output_dir
            ),
            "deposit_status_pie_chart_url": lambda: deposit_status_pie_chart(
                df, output_dir=output_dir
            ),
            "radar_chart_transaction_profiles_url": lambda: radar_chart_transaction_profiles(
                df, output_dir=output_dir
            ),
        }

        if chart:
            if chart not in expected_files:
                return JSONResponse(
                    content={"error": "Invalid chart key"},
                    status_code=400,
                )

            image_path = os.path.join(output_dir, expected_files[chart])
            if force or not os.path.exists(image_path):
                chart_generators[chart]()

            return {chart: f"/images/{safe_name}/{expected_files[chart]}"}

        image_paths = [os.path.join(output_dir, name) for name in expected_files.values()]
        images_ready = all(os.path.exists(path) for path in image_paths)

        if force or not images_ready:
            for generator in chart_generators.values():
                generator()

        return {key: f"/images/{safe_name}/{name}" for key, name in expected_files.items()}

        # return {
        #     "pie_image_url": f"/images/{pie_image_url}",
        #     "ip_box_plot_url": f"/images/{ip_box_plot_url}",
        # }

        # df = processed_df[filename]
        # pie_chart(df)

        # return {"image_url": "/images/pie_chart.svg"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)})
