import shap
import pandas as pd

def compute_shap_val(model, df):
    df = df.drop(columns = ["Flag","uploaded_file"]) 
    explainer = shap.TreeExplainer(model, feature_perturbation="tree_path_dependent")
    shap_values = explainer(df)
    return shap_values


def compute_shap_values(model, df):
    try:
        df = df.copy()

        # remove ALL non-feature columns safely
        drop_cols = ["Flag", "uploaded_file", "Address"]
        df = df.drop(columns=drop_cols, errors="ignore")

        # FORCE numeric only (THIS IS THE FIX)
        df = df.apply(pd.to_numeric, errors="coerce")

        # handle missing after coercion
        df = df.fillna(df.median(numeric_only=True))

        explainer = shap.TreeExplainer(model)
        shap_values = explainer(df)

        return shap_values, df  # IMPORTANT: return cleaned df

    except Exception as e:
        raise RuntimeError(f"SHAP computation failed: {str(e)}")