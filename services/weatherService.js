// services/weatherService.js
// Módulo: clima en tiempo real usando Open-Meteo (gratuito, sin API key)
// + geocoding con Nominatim

const GEO_URL = "https://nominatim.openstreetmap.org/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const WMO_CODES = {
  0: "despejado", 1: "mayormente despejado", 2: "parcialmente nublado", 3: "nublado",
  45: "niebla", 48: "niebla con escarcha",
  51: "llovizna leve", 53: "llovizna", 55: "llovizna intensa",
  61: "lluvia leve", 63: "lluvia", 65: "lluvia intensa",
  71: "nieve leve", 73: "nieve", 75: "nieve intensa",
  80: "chubascos leves", 81: "chubascos", 82: "chubascos intensos",
  95: "tormenta", 96: "tormenta con granizo", 99: "tormenta intensa",
};

export async function getCoordinates(city) {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "User-Agent": "APAX/1.0" } });
  const data = await res.json();
  if (!data.length) throw new Error(`Ciudad no encontrada: ${city}`);
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name.split(",")[0] };
}

export async function getCurrentWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: "temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m",
    timezone: "auto",
  });
  const res = await fetch(`${WEATHER_URL}?${params}`);
  const data = await res.json();
  const c = data.current;
  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    description: WMO_CODES[c.weathercode] ?? "condición desconocida",
    wind: Math.round(c.windspeed_10m),
    humidity: c.relativehumidity_2m,
  };
}

export async function getWeatherForCity(city) {
  const { lat, lon, name } = await getCoordinates(city);
  const weather = await getCurrentWeather(lat, lon);
  return { city: name, ...weather };
}

export function formatWeatherReply(w, language = "es") {
  if (language === "es") {
    return `En ${w.city}: ${w.temp}°C, sensación térmica ${w.feelsLike}°C. ${w.description.charAt(0).toUpperCase() + w.description.slice(1)}. Viento ${w.wind} km/h, humedad ${w.humidity}%.`;
  }
  return `In ${w.city}: ${w.temp}°C, feels like ${w.feelsLike}°C. ${w.description}. Wind ${w.wind} km/h, humidity ${w.humidity}%.`;
}
