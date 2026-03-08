import plotly.express as px
import os
import pandas as pd

def avg_time_between_sent_histogram(df):
    """
    Histogram: Average Minutes Between Sent Transactions
    df must have columns: ['Flag', 'Avg min between sent tnx']
    """

    # Map numeric flag if needed
    #df["Flag"] = df["Flag"].map({0: "Normal", 1: "Fraud"})

    fig = px.histogram(
        df,
        x="Avg min between sent tnx",
        color="Flag",
        nbins=50,
        barmode="overlay",   # overlay for comparison
        opacity=0.7,
        color_discrete_map={
            "Normal": "#bde0fe",
            "Fraud": "#ffc8dd"
        },
        labels={
            "Avg min between sent tnx": "Average Minutes Between Sent Transactions"
        }
    )

    fig.update_layout(
        title="<b>Average Time Between Sent Transactions</b>",
        title_x=0,
        width=900,
        height=500,
        template="simple_white",
        font=dict(family="Arial, sans-serif", size=13),
        legend=dict(title="Account Type", x=1.05, y=0.5),
        margin=dict(t=140, l=60, r=200, b=60)
    )

    fig.update_xaxes(title="Average Minutes Between Sent Transactions")
    fig.update_yaxes(title="Number of Accounts")

    # Subtitle
    fig.add_annotation(
        text="Distribution of average time intervals between sent transactions, grouped by account type.",
        x=0,
        y=1.08,
        xref="paper",
        yref="paper",
        showarrow=False,
        xanchor="left",
        align="left",
        font=dict(family="Arial, sans-serif", size=14, color="black")
    )

    # os.makedirs("images", exist_ok=True)
    # fig.write_image("images/avg_time_between_sent_histogram.svg")

    # return fig
    return fig.to_json()

# TEST_DATA_PATH = r"C:\Users\HP\Desktop\Recova\FraudDetection\recova_test_data.xlsx"

# dataf = pd.read_excel(TEST_DATA_PATH)
# fig = avg_time_between_sent_histogram(dataf)
# fig.show()