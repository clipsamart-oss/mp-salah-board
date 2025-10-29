async function loadTimings() {
  const response = await fetch("timings.json");
  const data = await response.json();

  const today = new Date().toISOString().slice(0, 10);
  const todayTiming = data.find(d => d.date === today);

  const dateEl = document.getElementById("date");
  dateEl.textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (todayTiming) {
    document.getElementById("fajr").textContent = todayTiming.fajr;
    document.getElementById("sunrise").textContent = todayTiming.sunrise;
    document.getElementById("dhuhr").textContent = todayTiming.dhuhr;
    document.getElementById("asr").textContent = todayTiming.asr;
    document.getElementById("maghrib").textContent = todayTiming.maghrib;
    document.getElementById("isha").textContent = todayTiming.isha;
    showNextPrayer(todayTiming);
  } else {
    document.querySelector(".times").innerHTML =
      "<p>No data found for today</p>";
  }
}

function showNextPrayer(times) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  for (let i = 0; i < order.length; i++) {
    const [h, m] = times[order[i]].split(":").map(Number);
    const total = h * 60 + m;
    if (currentTime < total) {
      document.getElementById("next").textContent =
        "Next Prayer: " + order[i].toUpperCase() + " at " + times[order[i]];
      return;
    }
  }
  document.getElementById("next").textContent = "All prayers completed for today.";
}

loadTimings();
setInterval(loadTimings, 60 * 60 * 1000); // refresh hourly
