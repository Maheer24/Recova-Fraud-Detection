import plotly.express as px
import os
import pandas as pd

def ether_sent_histogram(df):

    # Map numeric flag to label
    #df["Flag"] = df["Flag"].map({0: "Normal", 1: "Fraud"})

    # Create histogram
    fig = px.histogram(
        df,
        x="total Ether sent",
        color="Flag",
        nbins=50,
        barmode="overlay",
        opacity=0.75,
        color_discrete_map={
            "Normal": "#bde0fe",
            "Fraud": "#ffc8dd"
        },
        labels={"total Ether sent": "Total Ether Sent"},
    )

    # Use log scale if values vary widely
    fig.update_xaxes(title="Total Ether Sent", type="linear")  # change to 'log' if needed
    fig.update_yaxes(title="Count of Accounts")

    # Layout styling
    fig.update_layout(
        title="<b>Total Ether Sent Distribution</b>",
        title_x=0,
        width=900,
        height=500,
        template="simple_white",
        font=dict(family="Arial, sans-serif", size=13),
        legend=dict(title="Account Type", x=1.05, y=0.5),
        margin=dict(t=140, l=60, r=200, b=60)
    )

    # Subtitle / explanation
    fig.add_annotation(
        text="Shows the distribution of total Ether sent per account, colored by category (Normal vs Fraud).",
        x=0,
        y=1.08,
        xref="paper",
        yref="paper",
        showarrow=False,
        xanchor="left",
        align="left",
        font=dict(family="Arial, sans-serif", size=14, color="black")
    )

    # Save chart
    # os.makedirs("C:\Users\HP\Desktop\Recova\FraudDetection\images", exist_ok=True)
    # fig.write_image("images/ether_sent_histogram.svg")

    # return fig
    return fig.to_json()


# TEST_DATA_PATH = r"C:\Users\HP\Desktop\Recova\FraudDetection\recova_test_data.xlsx"

# dataf = pd.read_excel(TEST_DATA_PATH)
# fig = ether_sent_histogram(dataf)
# fig.show()