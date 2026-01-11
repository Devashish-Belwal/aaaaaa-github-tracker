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
  const actual = await loadCSV("data/Actually/Phase2/P2DailyHours.csv");
  const planned = await loadCSV("data/Planned/Phase2/P2DailyHours.csv");

  drawChart("lineChartDailyP1", actual.labels, actual.data, planned.data);
}