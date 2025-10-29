// Function to convert "HH:MM" to minutes
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Function to display prayer times and highlight next Salah
async function displayPrayerTimes() {
  try {
    // Fetch timings.json
    const response = await fetch('timings.json');
    if (!response.ok) throw new Error("Failed to load timings.json");

    const data = await response.json();
    // Example structure: { "Fajr":"05:10", "Dhuhr":"12:30", ... }
    const prayerTimes = data;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let nextSalah = null;
    for (const [name, time] of Object.entries(prayerTimes)) {
      const minutes = timeToMinutes(time);
      if (minutes > currentMinutes) {
        nextSalah = name;
        break;
      }
    }

    // Build table
    let tableHTML = `<table>
      <tr><th>Prayer</th><th>Time</th></tr>`;
    for (const [name, time] of Object.entries(prayerTimes)) {
      const highlightClass = name === nextSalah ? "next-salah" : "";
      tableHTML += `<tr class="${highlightClass}"><td>${name}</td><td>${time}</td></tr>`;
    }
    tableHTML += `</table>`;

    document.getElementById("prayer-times").innerHTML = tableHTML;

  } catch (error) {
    console.error(error);
    document.getElementById("prayer-times").innerText = "Failed to load prayer times.";
  }
}

// Update clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").innerText = timeString;
}

// Initial display
displayPrayerTimes();
updateClock();

// Update every minute
setInterval(displayPrayerTimes, 60000);
setInterval(updateClock, 1000);
