const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLIC_KEY
);

const driverSelect = document.getElementById("driverSelect");
const busSelect = document.getElementById("busSelect");
const startRouteBtn = document.getElementById("startRouteBtn");
const stopRouteBtn = document.getElementById("stopRouteBtn");
const statusDiv = document.getElementById("status");
const routeInfo = document.getElementById("routeInfo");

const selectedDriverSpan = document.getElementById("selectedDriver");
const selectedBusSpan = document.getElementById("selectedBus");
const latitudeSpan = document.getElementById("latitude");
const longitudeSpan = document.getElementById("longitude");
const timestampSpan = document.getElementById("timestamp");

let watchId = null;

function formatDate(date) {
  return date.toLocaleString("es-ES");
}

async function testSupabaseConnection() {
  statusDiv.textContent = "Comprobando conexión con Supabase...";

  const { error } = await supabaseClient
    .from("route_sessions")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Error conectando con Supabase:", error);
    statusDiv.textContent =
      "Error conectando con Supabase. Pulsa F12 y revisa la consola.";
    return;
  }

  console.log("Supabase conectado correctamente.");
  statusDiv.textContent =
    "Supabase conectado. Ya puedes iniciar una ruta de prueba.";
}

testSupabaseConnection();

startRouteBtn.addEventListener("click", () => {
  const selectedDriver = driverSelect.value;
  const selectedBus = busSelect.value;

  if (!selectedDriver) {
    alert("Selecciona un conductor.");
    return;
  }

  if (!selectedBus) {
    alert("Selecciona un autobús.");
    return;
  }

  if (!navigator.geolocation) {
    statusDiv.textContent =
      "La geolocalización no está disponible en este navegador.";
    return;
  }

  selectedDriverSpan.textContent = selectedDriver;
  selectedBusSpan.textContent = selectedBus;
  routeInfo.classList.remove("hidden");
  statusDiv.textContent = "Solicitando ubicación y comenzando ruta...";

  startRouteBtn.disabled = true;
  driverSelect.disabled = true;
  busSelect.disabled = true;
  stopRouteBtn.disabled = false;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const now = new Date();

      latitudeSpan.textContent = latitude.toFixed(6);
      longitudeSpan.textContent = longitude.toFixed(6);
      timestampSpan.textContent = formatDate(now);

      statusDiv.textContent =
        `Ruta activa. Ubicación capturada correctamente para el autobús ${selectedBus}.`;

      console.log({
        driver: selectedDriver,
        bus: selectedBus,
        latitude,
        longitude,
        timestamp: now.toISOString()
      });
    },
    (error) => {
      let message = "Error obteniendo la ubicación.";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "Permiso de ubicación denegado.";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "La ubicación no está disponible.";
          break;
        case error.TIMEOUT:
          message = "Tiempo de espera agotado al obtener la ubicación.";
          break;
      }

      statusDiv.textContent = message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
});

stopRouteBtn.addEventListener("click", () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  statusDiv.textContent = "Ruta detenida.";
  startRouteBtn.disabled = false;
  driverSelect.disabled = false;
  busSelect.disabled = false;
  stopRouteBtn.disabled = true;
});
