import { useEffect, useRef } from "react";
import { loadGoogleCharts } from "./GoogleChartLoader";

export function BookingsByMonthChart({ rows }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!rows?.length) return;

    loadGoogleCharts().then((google) => {
      const data = google.visualization.arrayToDataTable([
        ["Month", "Bookings"],
        ...rows,
      ]);

      const chart = new google.visualization.LineChart(ref.current);
      chart.draw(data, {
        title: "Bookings by Month",
        height: 350,
      });
    });
  }, [rows]);

  return <div ref={ref} style={{ width: "100%", height: 350 }}/>;
}
