import { useEffect, useRef } from "react";
import { loadGoogleCharts } from "./GoogleChartLoader";

export function BookingsRevenueChart({ rows }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!rows?.length) return;

    loadGoogleCharts().then((google) => {
      const data = google.visualization.arrayToDataTable([
        ["Month", "Revenue"],
        ...rows,
      ]);

      const chart = new google.visualization.ColumnChart(ref.current);
      chart.draw(data, {
        title: "Revenue by Month",
        height: 350,
        vAxis: { format: "currency" },
      });
    });
  }, [rows]);

  return <div ref={ref} />;
}
