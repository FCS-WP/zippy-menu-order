import { useEffect, useRef } from "react";
import { loadGoogleCharts } from "./GoogleChartLoader";

export function BookingStatusChart({ stats = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!Array.isArray(stats) || stats.length === 0) return;

    let chart, data, options;

    loadGoogleCharts().then((google) => {
      data = google.visualization.arrayToDataTable([
        ["Status", "Total"],
        ...stats.map(([status, total]) => [
          status.replace("-", " ").toUpperCase(),
          Number(total),
        ]),
      ]);

      options = {
        title: "Booking Status",
        pieHole: 0.45,
        legend: { position: "right" },
        chartArea: { width: "90%", height: "80%" },
        sliceVisibilityThreshold: 0,
      };

      chart = new google.visualization.PieChart(ref.current);
      chart.draw(data, options);
    });

    return () => chart?.clearChart();
  }, [stats]);

  return <div ref={ref} style={{ width: "100%", height: 350 }} />;
}
