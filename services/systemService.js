// services/systemService.js
// Módulo: comandos del sistema Android (notificaciones, alarmas, apps, brillo)
// Usa expo-notifications, expo-brightness, Linking

import * as Notifications from "expo-notifications";
import * as Brightness from "expo-brightness";
import { Linking, Platform } from "react-native";

// --- Notificaciones locales ---

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleNotification({ title, body, seconds = 5 }) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { seconds },
  });
}

// --- Brillo de pantalla ---

export async function setBrightness(level) {
  // level: 0.0 a 1.0
  const { status } = await Brightness.requestPermissionsAsync();
  if (status === "granted") {
    await Brightness.setSystemBrightnessAsync(Math.max(0, Math.min(1, level)));
  }
}

export async function getBrightness() {
  return await Brightness.getSystemBrightnessAsync();
}

// --- Abrir apps y URLs ---

export async function openApp(scheme) {
  const canOpen = await Linking.canOpenURL(scheme);
  if (canOpen) {
    await Linking.openURL(scheme);
    return true;
  }
  return false;
}

// Esquemas comunes de apps
export const APP_SCHEMES = {
  maps: "geo:0,0",
  camera: "content://media/external/images/media",
  settings: "android-app://com.android.settings",
  phone: "tel:",
  sms: "sms:",
  email: "mailto:",
  browser: "https://",
  whatsapp: "whatsapp://",
  youtube: "vnd.youtube://",
  spotify: "spotify://",
};

// --- Llamadas y mensajes ---

export function makeCall(number) {
  return Linking.openURL(`tel:${number}`);
}

export function sendSMS(number, text = "") {
  return Linking.openURL(`sms:${number}${text ? `?body=${encodeURIComponent(text)}` : ""}`);
}

export function openEmail(to, subject = "", body = "") {
  return Linking.openURL(
    `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  );
}
