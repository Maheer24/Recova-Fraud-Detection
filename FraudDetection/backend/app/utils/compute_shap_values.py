import shap
import pandas as pd

def compute_shap_val(model, df):
    df = df.drop(columns = ["Flag","uploaded_file"]) 
    explainer = shap.TreeExplainer(model, feature_perturbation="tree_path_dependent")
    shap_values = explainer(df)
    return shap_values