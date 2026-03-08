import pandas as pd
import plotly.express as px
import os
#from config import TEST_DATA_PATH

# open_sans_reg = font_manager.FontProperties(fname=open_sans_reg_path)
# outfit_bold = font_manager.FontProperties(fname=outfit_bold_path)
# outfit_thin = font_manager.FontProperties(fname=outfit_thin_path)
# cabin = font_manager.FontProperties(fname=cabin_path)
# outfit_extra_bold = font_manager.FontProperties(fname=outfit_extra_bold_path)

def pie_chart(df):
    counts = df["Flag"].value_counts().reset_index()
    counts.columns = ["Flag", "count"]

    #counts["Flag"] = counts["Flag"].map({0: "Normal", 1: "Fraud"})

    fig = px.pie(
        counts,
        names="Flag",
        values="count",
        hole=0,
        color="Flag",
        color_discrete_map={
            "Normal": "#bde0fe",
            "Fraud": "#ffc8dd"
        }
    )

    fig.update_traces(
        textposition="outside",
        textinfo="percent",
        textfont=dict(
            family="Arial, sans-serif", 
            size=14,
            color="black"
        ),
        marker=dict(line=dict(color="white", width=2)),
        sort=False,
        direction="clockwise"
    )

    fig.update_layout(
        width=1000,
        height=500,
        template="simple_white",
        font=dict(
            family="Arial, sans-serif",
            size=13,
            color="black"
        ),
        legend=dict(
            title=dict(
                text="Category",
                font=dict(family="Arial, sans-serif", size=14)
            ),
            font=dict(family="Arial, sans-serif", size=13),
            x=1.05,
            y=0.5
        ),
        margin=dict(t=140, l=60, r=200, b=60),
    )

    # Title
    fig.add_annotation(
        text="<b>Breakdown of Transaction Categories</b>",
        x=0,
        y=1.15,
        xref="paper",
        yref="paper",
        showarrow=False,
        xanchor="left",    
        yanchor="top", 
        align="left",
        font=dict(
            family="Arial, sans-serif",
            size=22,
            color="black"
        )
    )

    # Subtitle
    fig.add_annotation(
        text="Each slice represents the proportion of transaction types within the dataset.<br>"
             "Normal or Fraud transactions across all records.",
        x=0,
        y=1.07,
        xref="paper",
        yref="paper",
        showarrow=False,
        align="left",
        font=dict(
            family="Arial, sans-serif",
            size=14,
            color="black"
        )
    )

    # Save for debugging or export
    # os.makedirs("images", exist_ok=True)
    # fig.write_image("images/pie_chart.svg")

    # return fig
    return fig.to_json()

# TEST_DATA_PATH = r"C:\Users\HP\Desktop\Recova\FraudDetection\recova_test_data.xlsx"

# dataf = pd.read_excel(TEST_DATA_PATH)
# fig = pie_chart(dataf)
# fig.show()