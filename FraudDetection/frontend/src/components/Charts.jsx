import React from "react";
import Plot from "react-plotly.js";
import { Card, CardContent } from "../ui/Card";

const Charts = ({ charts }) => {
  if (!charts) return null;

  return (
    <div className="insights">
      <h3>Insights</h3>

      {Object.values(charts).map((chart, index) => {
        const parsed = JSON.parse(chart);

        return (
          <Card key={index} className="mb-6">
            <CardContent>
              <Plot
                data={parsed.data}
                layout={parsed.layout}
                style={{ width: "100%" }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Charts;