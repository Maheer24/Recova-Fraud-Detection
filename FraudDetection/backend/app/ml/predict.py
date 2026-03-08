import pandas as pd

def predict_transaction(model, df:pd.DataFrame):
    prediction_labels = {0 : "Normal", 1: "Fraudulent"}
    predictions = model.predict(df)

    df["Flag"] = predictions

    normal_indices = df[df["Flag"] == 0].index
    fraud_indices = df[df["Flag"] == 1].index

    df["Flag"] = df["Flag"].map(prediction_labels)

    return df, normal_indices, fraud_indices