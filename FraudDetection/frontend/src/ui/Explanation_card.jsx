import React from "react";
import { CompactCard, CompactCardContent } from "../ui/Compact_Card";

const ExplanationCards = ({ explanations }) => {
  if (!explanations) return null;

  const filtered = explanations.filter(
    (e) => e.prediction === "Fraudulent"
  );

  if (filtered.length === 0) {
    return (
      <div className="insights">
        <h3>No fraudulent transactions detected</h3>
      </div>
    );
  }

  return (
    <div className="insights">
      <h3 className="section-title">Fraud Explanations</h3>

      <div className="explanation-list">
        {filtered.map((item, index) => (
          <CompactCard
            key={index}
            className="border-l-4 border-red-500"
          >
            <CompactCardContent>

              <h4 style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>
                Address: {item.address}
              </h4>

              <p style={{ margin: "4px 0" }}>
                {item.explanation}
              </p>

              <div style={{ marginTop: "6px" }}>
                <strong>Key Factors:</strong>
                <ul style={{ marginTop: "4px", paddingLeft: "18px" }}>
                  {item.insights.map((f, i) => (
                    <li key={i}>
                      {f.feature} → {f.status} ({f.impact})
                    </li>
                  ))}
                </ul>
              </div>

            </CompactCardContent>
          </CompactCard>
        ))}
      </div>
    </div>
  );
};

export default ExplanationCards;