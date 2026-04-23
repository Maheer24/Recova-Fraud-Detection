#baseline = pd.read_csv("baseline.csv", index_col=0).squeeze()

import pandas as pd

def load_baseline(csv_path: str) -> pd.Series:
    """
    Load baseline (mean) from CSV and convert to pandas Series
    """
    df = pd.read_csv(csv_path)

    # Case 1: saved as single row
    if len(df) == 1:
        return df.iloc[0]

    # Case 2: saved as two columns (feature, value)
    elif df.shape[1] == 2:
        return pd.Series(df.iloc[:, 1].values, index=df.iloc[:, 0])

    else:
        raise ValueError("Invalid baseline format")