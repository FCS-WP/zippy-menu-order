import { useEffect, useRef } from "react";
import { loadGoogleCharts } from "./GoogleChartLoader";

export function BookingsByWeekChart({ rows }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!rows?.length) return;

    loadGoogleCharts().then((google) => {
      const data = google.visualization.arrayToDataTable([
        ["Week", "Bookings"],
        ...rows,
      ]);

      const chart = new google.visualization.ColumnChart(ref.current);
      chart.draw(data, {
        title: "Bookings by Week",
        height: 350,
      });
    });
  }, [rows]);

  return <div ref={ref} />;
}
