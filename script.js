// Convert "HH:MM" string to minutes
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Display prayer times from timings.json and highlight next Salah
async function displayPrayerTimes() {
  try {
    const response = await fetch('timings.json');
    if (!response.ok) throw new Error("Failed to load timings.json");

    const prayerTimes = await response.json(); 
    // Ensure all times are in "HH:MM" 24-hour format

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let nextSalah = null;
    for (const [name, time] of Object.entries(prayerTimes)) {
      if (!time) continue; // skip empty values
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
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.getElementById("clock").innerText = timeString;
}

// Initial display
displayPrayerTimes();
updateClock();

// Update every minute
setInterval(displayPrayerTimes, 60000);
setInterval(updateClock, 1000);
