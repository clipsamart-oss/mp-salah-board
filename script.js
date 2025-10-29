// Live Clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  document.getElementById("clock").textContent = "🕒 " + time;
}
setInterval(updateClock, 1000);
updateClock();

// Hijri Date
function showHijriDate() {
  const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());
  document.getElementById("hijri").textContent = "🗓 Hijri: " + hijriDate;
}
showHijriDate();

// Load Salah Timings
const jsonURL = "timings.json"; // Must be in same folder

async function loadPrayerTimes() {
  try {
    const response = await fetch(jsonURL);
    if (!response.ok) throw new Error("Failed to fetch timings.json");

    const data = await response.json();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const timings = data[today];

    const board = document.getElementById("prayer-times");

    if (!timings) {
      board.innerHTML = `<p>No timings found for today (${today})</p>`;
      return;
    }

    board.innerHTML = `
      <table>
        <tr><th>Prayer</th><th>Time</th></tr>
        ${Object.entries(timings)
          .map(([name, time]) => `<tr><td>${name}</td><td>${time}</td></tr>`)
          .join("")}
      </table>
    `;
  } catch (error) {
    document.getElementById("prayer-times").innerHTML = `<p>Error loading timings: ${error}</p>`;
    console.error(error);
  }
}

loadPrayerTimes();
