import plotly.express as px
import os
import pandas as pd

def unique_sent_addresses_boxplot(df):
    """
    Box Plot: Unique Sent To Addresses grouped by Flag
    df must have columns: ['Flag', 'Unique Sent To Addresses']
    """

    # Map numeric flag if needed
    #df["Flag"] = df["Flag"].map({0: "Normal", 1: "Fraud"})

    fig = px.box(
        df,
        x="Flag",
        y="Unique Sent To Addresses",
        color="Flag",
        points="outliers",  # show extreme accounts
        color_discrete_map={
            "Normal": "#bde0fe",
            "Fraud": "#ffc8dd"
        },
        labels={
            "Unique Sent To Addresses": "Unique Sent To Addresses",
            "Flag": "Account Type"
        }
    )

    fig.update_layout(
        title="<b>Unique Sent To Addresses Distribution</b>",
        title_x=0,
        width=900,
        height=500,
        template="simple_white",
        font=dict(family="Arial, sans-serif", size=13),
        showlegend=False,
        margin=dict(t=140, l=60, r=60, b=60)
    )

    fig.update_yaxes(title="Number of Unique Addresses Sent To")
    fig.update_xaxes(title="Account Type")

    # Subtitle
    fig.add_annotation(
        text="Comparison of how many unique addresses each account interacts with.",
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
    # fig.write_image("images/unique_sent_addresses_boxplot.svg")

    # return fig
    return fig.to_json()

# TEST_DATA_PATH = r"C:\Users\HP\Desktop\Recova\FraudDetection\recova_test_data.xlsx"

# dataf = pd.read_excel(TEST_DATA_PATH)
# fig = unique_sent_addresses_boxplot(dataf)
# fig.show()