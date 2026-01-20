// googleChartsLoader.js
let googleChartsPromise;

export function loadGoogleCharts() {
  if (googleChartsPromise) return googleChartsPromise;

  googleChartsPromise = new Promise((resolve) => {
    if (!window.google) return;

    window.google.charts.load("current", {
      packages: ["corechart"],
    });

    window.google.charts.setOnLoadCallback(() => {
      resolve(window.google);
    });
  });

  return googleChartsPromise;
}
