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

function drawChartP1(location, labels, actualData, plannedData) {
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
          min: 0,
          max: 16,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function drawChartP2(location, labels, actualData, plannedData) {
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
          min: 0,
          max: 12,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function drawChartCumulativeP1(location, labels, actualData, plannedData) {
  const ctx = document.getElementById(location).getContext("2d");
  
  new Chart(ctx, {
    type: "bar",
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
          min: 0,
          max: 144,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function drawChartCumulativeP2(location, labels, actualData, plannedData) {
  const ctx = document.getElementById(location).getContext("2d");
  
  new Chart(ctx, {
    type: "bar",
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
          min: 0,
          max: 560,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function parseDDMMYYYY(str) {
  const [dd, mm, yy] = str.split("-").map(Number);
  const fullYear = yy < 100 ? 2000 + yy : yy;
  return new Date(fullYear, mm - 1, dd);
}

async function loadCSV4Heatmap(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("CSV not found");

  const text = await res.text();
  return text
    .trim()
    .split("\n")
    .slice(1)
    .map(r => {
      const [date, hours] = r.split(",");
      return {
        date,
        parsed: parseDDMMYYYY(date),
        hours: Number(hours)
      };
    });
}

function getColor(hours) {
  if (hours >= 10) return "#216e39";
  if (hours >= 8)  return "#30a14e";
  if (hours >= 6)  return "#40c463";
  if (hours >= 4)  return "#9be9a8";
  if (hours > 0)   return "#d6f5d6";
  return "#ebedf0";
}

async function buildGitHubHeatmap(path, location) {
  const data = await loadCSV4Heatmap(path);

  // console.log(data);

  // Sort chronologically
  data.sort((a, b) => a.parsed - b.parsed);

  // Map date → hours
  const map = {};
  data.forEach(d => map[d.date] = d.hours);

  const container = document.getElementById(location);
  container.innerHTML = "";

  // Align start date to Sunday
  const start = new Date(data[0].parsed);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(data[data.length - 1].parsed);

  // console.log(map);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const key = `${dd}-${mm}-${yyyy}`;

    // console.log(typeof(key), key.slice(0,6) + key.slice(8,10));

    const hours = map[key.slice(0,6) + key.slice(8,10)] || 0;

    const cell = document.createElement("div");
    cell.className = "heat-cell";
    cell.style.background = getColor(hours);
    cell.title = `${key}: ${hours} hrs`;

    container.appendChild(cell);
  }
}

buildGitHubHeatmap("data/Actually/Phase1/AP1DailyHours.csv", "heatmapP1");
buildGitHubHeatmap("data/Actually/Phase2/AP2DailyHours.csv", "heatmapP2");



init();

async function init() {
  const AP1DailyHours = await loadCSV("./data/Actually/Phase1/AP1DailyHours.csv");
  const PP1DailyHours = await loadCSV("./data/Planned/Phase1/PP1DailyHours.csv");
  
  const AP1DailyHoursCumulative = await loadCSV("./data/Actually/Phase1/AP1DailyHoursCumulative.csv");
  const PP1DailyHoursCumulative = await loadCSV("./data/Planned/Phase1/PP1DailyHoursCumulative.csv");
  
  const AP2DailyHours = await loadCSV("./data/Actually/Phase2/AP2DailyHours.csv");
  const PP2DailyHours = await loadCSV("./data/Planned/Phase2/PP2DailyHours.csv");
  
  const AP2DailyHoursCumulative = await loadCSV("./data/Actually/Phase2/AP2DailyHoursCumulative.csv");
  const PP2DailyHoursCumulative = await loadCSV("./data/Planned/Phase2/PP2DailyHoursCumulative.csv");
  
  const AP2WeeklyHours = await loadCSV("./data/Actually/Phase2/AP2WeeklyHours.csv");
  const PP2WeeklyHours = await loadCSV("./data/Planned/Phase2/PP2WeeklyHours.csv");
  
  const PP2WeeklyHoursCumulative = await loadCSV("./data/Planned/Phase2/PP2WeeklyHoursCumulative.csv");
  const AP2WeeklyHoursCumulative = await loadCSV("./data/Actually/Phase2/AP2WeeklyHoursCumulative.csv");



  drawChartP1("lineChartDailyP1", PP1DailyHours.labels, AP1DailyHours.data, PP1DailyHours.data);
  drawChartCumulativeP1("lineChartDailyCumulativeP1", PP1DailyHoursCumulative.labels, AP1DailyHoursCumulative.data, PP1DailyHoursCumulative.data);
  drawChartP2("lineChartDailyP2", PP2DailyHours.labels, AP2DailyHours.data, PP2DailyHours.data);
  drawChartCumulativeP2("lineChartDailyCumulativeP2", PP2DailyHoursCumulative.labels, AP2DailyHoursCumulative.data, PP2DailyHoursCumulative.data);
}