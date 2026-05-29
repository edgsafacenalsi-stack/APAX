// services/proactiveService.js
// Módulo: notificaciones proactivas — APAX inicia sin que el usuario pregunte
// Ejemplos: saludo matutino, resumen del día, alerta de clima extremo

import { scheduleNotification } from "./systemService";
import { getWeatherForCity, formatWeatherReply } from "./weatherService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  LAST_MORNING: "apax:proactive:last_morning",
  CITY: "apax:proactive:city",
};

export async function setProactiveCity(city) {
  await AsyncStorage.setItem(KEYS.CITY, city);
}

export async function getProactiveCity() {
  return (await AsyncStorage.getItem(KEYS.CITY)) ?? "Buenos Aires";
}

// Saludo matutino con clima — se dispara una vez por día entre 7-9hs
export async function checkMorningGreeting(language = "es") {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 7 || hour > 9) return null;

  const today = now.toDateString();
  const lastMorning = await AsyncStorage.getItem(KEYS.LAST_MORNING);
  if (lastMorning === today) return null; // ya se envió hoy

  await AsyncStorage.setItem(KEYS.LAST_MORNING, today);

  const city = await getProactiveCity();
  let weatherLine = "";
  try {
    const w = await getWeatherForCity(city);
    weatherLine = language === "es"
      ? ` Hoy en ${w.city}: ${w.temp}°C, ${w.description}.`
      : ` Today in ${w.city}: ${w.temp}°C, ${w.description}.`;
  } catch (_) {}

  const greeting = language === "es"
    ? `Buenos días.${weatherLine} ¿En qué puedo ayudarte hoy?`
    : `Good morning.${weatherLine} How can I help you today?`;

  await scheduleNotification({
    title: "APAX",
    body: greeting,
    seconds: 2,
  });

  return greeting;
}

// Alerta de clima extremo — temperatura > 38°C o < 0°C
export async function checkWeatherAlert(language = "es") {
  const city = await getProactiveCity();
  try {
    const w = await getWeatherForCity(city);
    if (w.temp >= 38) {
      const msg = language === "es"
        ? `Alerta: ${w.temp}°C en ${w.city}. Temperatura extrema.`
        : `Alert: ${w.temp}°C in ${w.city}. Extreme heat.`;
      await scheduleNotification({ title: "APAX ⚠", body: msg, seconds: 2 });
      return msg;
    }
    if (w.temp <= 0) {
      const msg = language === "es"
        ? `Alerta: ${w.temp}°C en ${w.city}. Temperatura bajo cero.`
        : `Alert: ${w.temp}°C in ${w.city}. Below freezing.`;
      await scheduleNotification({ title: "APAX ⚠", body: msg, seconds: 2 });
      return msg;
    }
  } catch (_) {}
  return null;
}
