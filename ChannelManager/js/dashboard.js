// ========== GENERAR DÍAS EN EL HEADER ==========

const header = document.getElementById("calendarHeader");
const body = document.getElementById("calendarBody");

let days = 31;
let rooms = 5;

// Crear encabezado de días
for (let d = 1; d <= days; d++) {
  let div = document.createElement("div");
  div.className = "text-center py-2 font-bold border-r";
  div.innerText = d;
  header.appendChild(div);
}

// Crear celdas del calendario
for (let r = 1; r <= rooms; r++) {
  for (let d = 1; d <= days; d++) {
    let cell = document.createElement("div");
    cell.className = "cal-day";
    cell.id = `r${r}d${d}`;
    body.appendChild(cell);
  }
}

// ========== EJEMPLO DE RESERVAS ==========

const reservations = [
  { room: 1, start: 3, end: 7, ota: "airbnb" },
  { room: 1, start: 10, end: 15, ota: "booking" },
  { room: 2, start: 5, end: 9, ota: "expedia" },
  { room: 3, start: 12, end: 18, ota: "airbnb" }
];

// Renderizar reservas
reservations.forEach(res => {
  const firstCell = document.getElementById(`r${res.room}d${res.start}`);
  if (!firstCell) return;

  const duration = res.end - res.start + 1;
  const width = duration * 120 - 6;

  const block = document.createElement("div");
  block.classList.add("event-block");

  // Color por OTA
  block.classList.add(`event-${res.ota}`);

  block.style.width = width + "px";
  block.innerText = res.ota.toUpperCase();

  firstCell.appendChild(block);
});
