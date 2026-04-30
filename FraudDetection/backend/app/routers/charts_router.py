from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import pandas as pd
from ..services.avg_time_sent_tnx_histogram import avg_time_between_sent_histogram
from ..services.ether_sent_histogram import ether_sent_histogram
from ..services.pie_chart import pie_chart
from ..services.sent_received_tnx_bar_chart import sent_received_bar_chart
from ..services.unique_sent_add_boxplot import unique_sent_addresses_boxplot
from ..db.supabase_client import supabase
from ..utils.compute_shap_values import compute_shap_val
from ..utils.load_model import load_catboost_model
from ..services.xai_service import XAIService
from ..settings import MODEL_PATH

router = APIRouter(prefix="/charts")
model = load_catboost_model(MODEL_PATH)
xai_service = XAIService()

@router.get("/df/{filename}")
async def generate_charts(filename: str):
    try:
        response = (
            supabase.table("Transactions")
            .select("*")
            .eq("uploaded_file", filename)
            .execute()
        )

        df = pd.DataFrame(response.data)
        df = df.drop(columns=["Address"])

        pie_chart_dict = pie_chart(df)
        avg_time_between_sent_histogram_dict = avg_time_between_sent_histogram(df)
        ether_sent_histogram_dict = ether_sent_histogram(df)
        sent_received_bar_chart_dict = sent_received_bar_chart(df)
        #unique_sent_addresses_boxplot_dict = unique_sent_addresses_boxplot(df)

        return jsonable_encoder({
            "pie_chart": pie_chart_dict,
            "avg_time_hist": avg_time_between_sent_histogram_dict,
            "ether_sent_hist": ether_sent_histogram_dict,
            "sent_rec_bar": sent_received_bar_chart_dict,
            #"unique_sent_box": unique_sent_addresses_boxplot_dict,
        })

    except Exception as e:
        return JSONResponse(content={"Error":str(e)})


@router.post("/xai/{filename}")
async def generate_xai_charts(filename: str):
    try:
        response = (
            supabase.table("Transactions")
            .select("*")
            .eq("uploaded_file", filename)
            .execute()
        )

        df = pd.DataFrame(response.data)
        df = df.drop(columns=["Address"])
        
        shap_val = compute_shap_val(model, df)

        fraud_indices = df[df["Flag"] == "Fraudulent"].index
        normal_indices = df[df["Flag"] == "Normal"].index

        bar_plot_str = xai_service.bar_plot(shap_val)
        fraud_waterfall_str = xai_service.waterfall_plot(shap_val, fraud_indices)
        normal_waterfall_str = xai_service.waterfall_plot(shap_val, normal_indices)

        fraud_waterfall_response = [{"img":img} for img in fraud_waterfall_str]
        normal_waterfall_response = [{"img":img} for img in normal_waterfall_str]

        return {
            "bar_plot_xai": bar_plot_str,
            "fraud_waterfall_plots_xai": fraud_waterfall_response,
            "normal_waterfall_plots_xai": normal_waterfall_response
        }

    except Exception as e:
        return JSONResponse(content={"Error":str(e)})
