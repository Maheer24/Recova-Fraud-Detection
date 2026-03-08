from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
import pandas as pd
from io import StringIO, BytesIO
from backend.app.ml.load_model import load_catboost_model
from backend.app.ml.predict import predict_transaction
from backend.app.ml.preprocess_data import preprocess_input_data
from config import MODEL_PATH
from backend.app.db.supabase_client import supabase
import os

model = load_catboost_model(MODEL_PATH)
processed_df = {}

router = APIRouter(prefix="/upload_file", tags=["Prediction"])


@router.post("/predict")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_name = file.filename
        content = await file.read()

        # Read file
        if file.filename.endswith(("xlsx", "xls")):
            df = pd.read_excel(BytesIO(content))

        elif file.filename.endswith("csv"):
            df = pd.read_csv(StringIO(content.decode("utf-8")))

        else:
            return JSONResponse(
                content={"error": "Upload CSV or Excel file"}, status_code=400
            )

        addresses = df["Address"]

        df_features = df.drop(columns=["Address"])
        preprocessed_df = preprocess_input_data(df_features)

        # Predict
        prediction_df, normal_indices, fraud_indices = predict_transaction(
            model, preprocessed_df
        )

        prediction_df["uploaded_file"] = file_name

        prediction_df["Address"] = addresses.values
        # Store dataframe temporarily for download
        processed_df[file.filename] = prediction_df

        # Store in Supabase
        supabase.table("Transactions").insert(
            prediction_df.to_dict(orient="records")
        ).execute()

        return {
            "filename": file.filename,
            "data": prediction_df.to_dict(orient="records"),
        }

    except UnicodeDecodeError:
        return JSONResponse(
            content={"error": "File encoding issue. Upload CSV or Excel"},
            status_code=400,
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@router.get("/download_csv")
async def download_csv(filename: str):
    try:
        if filename not in processed_df:
            return JSONResponse(
                content={"error": "No processed file found with this name"},
                status_code=404,
            )

        df = processed_df[filename]

        output = StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        base_name = os.path.splitext(filename)[0]
        download_name = f"{base_name}_predicted.csv"

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
