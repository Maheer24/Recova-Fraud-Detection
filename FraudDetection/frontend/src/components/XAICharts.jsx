import React from "react";
import { Card, CardContent } from "../ui/Card";

const XAICharts = ({ xai }) => {
  if (!xai) return null;

  return (
    <div className="section-title">
      <h3>XAI Explanations</h3>

      <h4>Global Feature Importance</h4>
      <Card className="mb-6 max-w-4xl mx-auto">
        <CardContent>
          <img
            src={`data:image/png;base64,${xai.bar_plot_xai}`}
            style={{ width: "100%" }}
            alt="SHAP Global Importance"
          />
        </CardContent>
      </Card>

      <h4>Fraudulent Transactions</h4>
      {xai.fraud_waterfall_plots_xai?.map((img, i) => (
        <Card key={`fraud-${i}`} className="mb-6 max-w-4xl mx-auto">
          <CardContent>
            <img
              src={`data:image/png;base64,${img.img}`}
              style={{ width: "100%" }}
              alt="Fraud SHAP Waterfall"
            />
          </CardContent>
        </Card>
      ))}

      <h4>Normal Transactions</h4>
      {xai.normal_waterfall_plots_xai?.map((img, i) => (
        <Card key={`normal-${i}`} className="mb-6 max-w-4xl mx-auto">
          <CardContent>
            <img
              src={`data:image/png;base64,${img.img}`}
              style={{ width: "100%" }}
              alt="Normal SHAP Waterfall"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default XAICharts;