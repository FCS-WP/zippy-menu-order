import { useEffect, useRef } from "react";

export default function BookingsPerDayChart({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.google?.charts) return;

    window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(draw);

    function draw() {
      const chartData = window.google.visualization.arrayToDataTable([
        ["Date", "Bookings"],
        ...data, // [['2025-09-01', 12], ['2025-09-02', 18]]
      ]);

      const chart = new window.google.visualization.LineChart(ref.current);
      chart.draw(chartData, {
        title: "Bookings per Day",
        curveType: "function",
        legend: { position: "bottom" },
        height: 350,
      });
    }
  }, [data]);

  return <div ref={ref} style={{ width: "100%", height: 350 }} />;
}
