from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse

from backend.app.ml.load_model import load_catboost_model
from backend.app.ml.predict import predict_transaction
from backend.app.ml.preprocess_data import preprocess_input_data
from backend.app.ml.image_helpers import fetch_transactions, sanitize_plotly_fig, plotly_to_png, add_image_to_pdf, decode_base64_image
from backend.app.db.supabase_client import supabase

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors

from backend.app.services.avg_time_sent_tnx_histogram import avg_time_between_sent_histogram
from backend.app.services.ether_sent_histogram import ether_sent_histogram
from backend.app.services.pie_chart import pie_chart
from backend.app.services.sent_received_tnx_bar_chart import sent_received_bar_chart
from backend.app.services.unique_sent_add_boxplot import unique_sent_addresses_boxplot
from backend.app.ml.compute_shap_values import compute_shap_val
from backend.app.services.xai_service import XAIService

import os
import pandas as pd
from io import StringIO, BytesIO
from config import MODEL_PATH
import json

model = load_catboost_model(MODEL_PATH)
processed_df = {}
xai_service = XAIService()
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


@router.get("/download_report/{filename}")
async def download_report(filename: str):
    try:
        # Fetch data
        df = fetch_transactions(filename)
        selected_cols = [
            "Address",
            "Flag",
            "Sent tnx",
            "Received Tnx",
            "Unique Sent To Addresses",
            "Unique Received From Addresses",
            "total Ether sent",
            "total ether balance"
        ]

        df_table = df[selected_cols]

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
        styles = getSampleStyleSheet()
        elements = []

        #  TITLE -----------------
        elements.append(Paragraph("Fraud Detection Report", styles["Title"]))
        elements.append(Spacer(1, 20))

        #  TABLE -----------------
        elements.append(Paragraph("Predicted Transactions", styles["Heading2"]))
        elements.append(Spacer(1, 10))
        table_data = [df_table.columns.tolist()] + df_table.values.tolist()
        table = Table(table_data, repeatRows=1)
        table.setStyle(TableStyle([
            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("FONTSIZE", (0,0), (-1,-1), 7)
        ]))
        elements.append(table)
        elements.append(PageBreak())

        # NORMAL CHARTS -----------------
        elements.append(Paragraph("Insights Charts", styles["Heading1"]))
        elements.append(Spacer(1, 20))
        df_charts = df.drop(columns=["Address"]) if "Address" in df.columns else df

        chart_functions = [
            pie_chart,
            avg_time_between_sent_histogram,
            ether_sent_histogram,
            sent_received_bar_chart,
            unique_sent_addresses_boxplot
        ]

        for chart_func in chart_functions:
            chart_fig_dict = chart_func(df_charts)
            if isinstance(chart_fig_dict, str):
                chart_fig_dict = json.loads(chart_fig_dict)
            chart_fig_dict = sanitize_plotly_fig(chart_fig_dict)
            img_bytes = plotly_to_png(json.dumps(chart_fig_dict))
            add_image_to_pdf(elements, img_bytes.getvalue())

        elements.append(PageBreak())

        # XAI CHARTS -----------------
        elements.append(Paragraph("Explainable AI Analysis", styles["Heading1"]))
        elements.append(Spacer(1, 20))
        shap_val = compute_shap_val(model, df_charts)

        fraud_indices = df_charts[df_charts["Flag"] == "Fraudulent"].index
        normal_indices = df_charts[df_charts["Flag"] == "Normal"].index

        # SHAP bar plot
        bar_plot_base64 = xai_service.bar_plot(shap_val)
        img_bytes = decode_base64_image(bar_plot_base64)
        elements.append(Paragraph("Feature Importance", styles["Heading2"]))
        add_image_to_pdf(elements, img_bytes)

        # Fraud waterfall plots
        elements.append(Paragraph("Fraud Transaction Explanations", styles["Heading2"]))
        elements.append(Spacer(1, 10))
        fraud_waterfalls = xai_service.waterfall_plot(shap_val, fraud_indices)
        for img_str in fraud_waterfalls:
            img_bytes = decode_base64_image(img_str)
            add_image_to_pdf(elements, img_bytes, width=450, height=300, spacer=15)

        elements.append(PageBreak())

        # Normal waterfall plots
        elements.append(Paragraph("Normal Transaction Explanations", styles["Heading2"]))
        elements.append(Spacer(1, 10))
        normal_waterfalls = xai_service.waterfall_plot(shap_val, normal_indices)
        for img_str in normal_waterfalls:
            img_bytes = decode_base64_image(img_str)
            add_image_to_pdf(elements, img_bytes, width=450, height=300, spacer=15)

        # Build PDF
        doc.build(elements)
        buffer.seek(0)

        base_name = os.path.splitext(filename)[0]
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}_report.pdf"'}
        )

    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=404)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    

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
