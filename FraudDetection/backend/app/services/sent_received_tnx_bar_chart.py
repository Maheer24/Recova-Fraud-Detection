import plotly.express as px
import os
import pandas as pd


def sent_received_bar_chart(df):
    """
    Grouped bar chart: Average Sent vs Received transactions per account, grouped by Flag
    df must have columns: ['Flag', 'Sent tnx', 'Received Tnx']
    """
    # Map numeric flag to label
    #df["Flag"] = df["Flag"].map({0: "Normal", 1: "Fraud"})

    # Compute per-account averages
    avg_df = df.groupby("Flag")[["Sent tnx", "Received Tnx"]].mean().reset_index()

    # Melt for grouped bar chart
    df_melt = avg_df.melt(id_vars=["Flag"], value_vars=["Sent tnx", "Received Tnx"],
                          var_name="Transaction Type", value_name="Average Count")

    # Create grouped bar chart
    fig = px.bar(
        df_melt,
        x="Flag",
        y="Average Count",
        color="Transaction Type",
        barmode="group",
        text="Average Count",
        color_discrete_map={
            "Sent tnx": "#a2d2ff",
            "Received Tnx": "#ffc8dd"
        }
    )

    # Show values on top of bars
    fig.update_traces(
        textposition="outside",
        texttemplate="%{text:.2f}",
        textfont=dict(family="Arial, sans-serif", size=13, color="black")
    )

    # Layout styling
    fig.update_layout(
        title="<b>Sent vs Received Transactions Comparison (Per Account)</b>",
        title_x=0,
        width=900,
        height=500,
        template="simple_white",
        font=dict(family="Arial, sans-serif", size=13),
        legend=dict(title="Transaction Type", x=1.05, y=0.5),
        margin=dict(t=140, l=60, r=200, b=60)
    )

    # Subtitle
    fig.add_annotation(
        text="Comparison of average sent and received transactions per account, grouped by category.",
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
    # os.makedirs("images", exist_ok=True)
    # fig.write_image("images/sent_received_bar_chart.svg")

    # return fig
    return fig.to_json()

# TEST_DATA_PATH = r"C:\Users\HP\Desktop\Recova\FraudDetection\recova_test_data.xlsx"

# dataf = pd.read_excel(TEST_DATA_PATH)
# fig = sent_received_bar_chart(dataf)
# fig.show()