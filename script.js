async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const rows = text.trim().split("\n").slice(1); // remove header
  const labels = [];
  const data = [];

  rows.forEach(row => {
    const [date, hours] = row.split(",");
    labels.push(date);
    data.push(Number(hours));
  });

  return { labels, data };
}

function drawChart(location, labels, actualData, plannedData) {
  const ctx = document.getElementById(location).getContext("2d");
  
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Actual Hours",
          data: actualData,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: "Planned Hours",
          data: plannedData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 4,
          max: 12,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

init();

async function init() {
  const AP1DailyHours = await loadCSV("./data/Actually/Phase2/AP1DailyHours.csv");
  const AP1DailyHoursCumulative = await loadCSV("./data/Planned/Phase2/AP1DailyHoursCumulative.csv");
  const AP2DailyHours = await loadCSV("./data/Planned/Phase2/AP2DailyHours.csv");
  const AP2DailyHoursCumlative = await loadCSV("./data/Planned/Phase2/AP2DailyHoursCumlative.csv");
  const AP2WeeklyHours = await loadCSV("./data/Planned/Phase2/AP2WeeklyHours.csv");
  const AP2WeeklyHoursCumulative = await loadCSV("./data/Planned/Phase2/AP2WeeklyHoursCumulative.csv");
  const PP1DailyHours = await loadCSV("./data/Planned/Phase2/PP1DailyHours.csv");
  const PP1DailyHoursCumlative = await loadCSV("./data/Planned/Phase2/PP1DailyHoursCumlative.csv");
  const PP2DailyHours = await loadCSV("./data/Planned/Phase2/PP2DailyHours.csv");
  const PP2DailyHoursCumlative = await loadCSV("./data/Planned/Phase2/PP2DailyHoursCumlative.csv");
  const PP2WeeklyHours = await loadCSV("./data/Planned/Phase2/PP2WeeklyHours.csv");
  const PP2WeeklyHoursCumulative = await loadCSV("./data/Planned/Phase2/PP2WeeklyHoursCumulative.csv");



  drawChart("lineChartDailyP1", actual.labels, actual.data, planned.data);
}