import numpy as np
import pandas as pd

class ExplanationService:

    def __init__(self, baseline_series: pd.Series):
        self.baseline = baseline_series

    def _extract_shap_matrix(self, shap_values):
        try:
            values = shap_values.values

            # multi-class or extra dim
            if len(values.shape) == 3:
                values = values[:, :, 1]  # fraud class (IMPORTANT for binary)

            return values

        except Exception as e:
            raise RuntimeError(f"SHAP extraction failed: {str(e)}")

    def _get_status(self, value, feature):
        try:
            base = self.baseline.get(feature, None)
            if base is None:
                return "unknown"

            diff = value - base
            tolerance = 0.05 * abs(base) if base != 0 else 0.05

            if abs(diff) <= tolerance:
                return "normal range"
            elif diff > 0:
                return "higher than usual"
            else:
                return "lower than usual"

        except Exception:
            return "unknown"

    def _get_impact(self, shap_val):
        if shap_val > 0:
            return "increases fraud risk"
        else:
            return "reduces fraud risk"

    def build_feature_insights(self, shap_values, df_row, top_k=4):
        try:
            feature_names = df_row.index.tolist()

            shap_matrix = self._extract_shap_matrix(shap_values)

            # current row index must be passed safely
            row_index = getattr(df_row, "name", 0)

            shap_array = shap_matrix[row_index]

            insights = []

            for i, feature in enumerate(feature_names):

                val = df_row.iloc[i]
                shap_val = shap_array[i]

                insights.append({
                    "feature": feature,
                    "value": float(val) if np.isscalar(val) else float(np.array(val).item()),
                    "shap": float(shap_val) if np.isscalar(shap_val) else float(np.array(shap_val).item()),
                    "status": self._get_status(val, feature),
                    "impact": self._get_impact(shap_val)
                })

            insights = sorted(insights, key=lambda x: abs(x["shap"]), reverse=True)

            return insights[:top_k]

        except Exception as e:
            raise RuntimeError(f"Failed to build insights: {str(e)}")
        
    def build_feature_insights_from_row(self, shap_row, df_row, top_k=4):
        try:
            insights = []

            for i, feature in enumerate(df_row.index):

                val = df_row.iloc[i]
                shap_val = shap_row[i]

                insights.append({
                    "feature": feature,
                    "value": float(val),
                    "shap": float(shap_val),
                    "status": self._get_status(val, feature),
                    "impact": self._get_impact(shap_val)
                })

            insights = sorted(insights, key=lambda x: abs(x["shap"]), reverse=True)

            return insights[:top_k]

        except Exception as e:
            raise RuntimeError(f"Failed to build fraud insights: {str(e)}")