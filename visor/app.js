const map = L.map("map").setView([40.4168, -3.7038], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const driverName = document.getElementById("driverName");
const busPlate = document.getElementById("busPlate");
const latValue = document.getElementById("latValue");
const lngValue = document.getElementById("lngValue");
const timeValue = document.getElementById("timeValue");
const statusValue = document.getElementById("statusValue");

let busData = {
  driver: "Juan Pérez",
  plate: "1234-ABC",
  lat: 40.4168,
  lng: -3.7038,
  time: new Date().toLocaleString("es-ES"),
  status: "Activo"
};

const busIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const busMarker = L.marker([busData.lat, busData.lng], {
  icon: busIcon
}).addTo(map);

busMarker.bindPopup(`
  <strong>Autobús:</strong> ${busData.plate}<br>
  <strong>Conductor:</strong> ${busData.driver}
`);

busMarker.bindTooltip(busData.plate, {
  permanent: true,
  direction: "top",
  offset: [0, -15]
}).openTooltip();

function updatePanel(data) {
  driverName.textContent = data.driver;
  busPlate.textContent = data.plate;
  latValue.textContent = data.lat.toFixed(6);
  lngValue.textContent = data.lng.toFixed(6);
  timeValue.textContent = data.time;
  statusValue.textContent = data.status;
}

updatePanel(busData);

setInterval(() => {
  busData.lat += (Math.random() - 0.5) * 0.002;
  busData.lng += (Math.random() - 0.5) * 0.002;
  busData.time = new Date().toLocaleString("es-ES");
  busData.status = "Recibiendo posición";
  busMarker.setLatLng([busData.lat, busData.lng]);
  busMarker.setPopupContent(`
    <strong>Autobús:</strong> ${busData.plate}<br>
    <strong>Conductor:</strong> ${busData.driver}
  `);
  busMarker.setTooltipContent(busData.plate);
  updatePanel(busData);
}, 3000);
