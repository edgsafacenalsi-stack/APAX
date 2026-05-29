// services/commandService.js
// Módulo: parsea texto de voz y ejecuta comandos del sistema
// Capa entre useVoiceSession y systemService

import {
  scheduleNotification, setBrightness,
  openApp, makeCall, sendSMS, APP_SCHEMES
} from "./systemService";

// Retorna { handled: bool, action: string, reply: string }
export async function trySystemCommand(text, language = "es") {
  const t = text.toLowerCase();
  const es = language === "es";

  // --- Brillo ---
  if (/sube.*brillo|brillo.*alto|brillo al máximo|increase brightness|brightness up/i.test(t)) {
    await setBrightness(1.0);
    return { handled: true, action: "SET_BRIGHTNESS_MAX", reply: es ? "Brillo al máximo." : "Brightness at max." };
  }
  if (/baja.*brillo|brillo.*bajo|reduce brightness|brightness down/i.test(t)) {
    await setBrightness(0.2);
    return { handled: true, action: "SET_BRIGHTNESS_LOW", reply: es ? "Brillo reducido." : "Brightness reduced." };
  }

  // --- Abrir apps ---
  if (/abre.*mapa|abrir mapa|open maps|open google maps/i.test(t)) {
    await openApp(APP_SCHEMES.maps);
    return { handled: true, action: "OPEN_MAPS", reply: es ? "Abriendo mapas." : "Opening maps." };
  }
  if (/abre.*cámara|abrir cámara|open camera/i.test(t)) {
    await openApp("content://media/external/images/media");
    return { handled: true, action: "OPEN_CAMERA", reply: es ? "Abriendo cámara." : "Opening camera." };
  }
  if (/abre.*whatsapp|open whatsapp/i.test(t)) {
    const opened = await openApp(APP_SCHEMES.whatsapp);
    return { handled: true, action: "OPEN_WHATSAPP", reply: opened ? (es ? "Abriendo WhatsApp." : "Opening WhatsApp.") : (es ? "WhatsApp no está instalado." : "WhatsApp not installed.") };
  }
  if (/abre.*youtube|open youtube/i.test(t)) {
    await openApp(APP_SCHEMES.youtube);
    return { handled: true, action: "OPEN_YOUTUBE", reply: es ? "Abriendo YouTube." : "Opening YouTube." };
  }
  if (/abre.*spotify|open spotify/i.test(t)) {
    await openApp(APP_SCHEMES.spotify);
    return { handled: true, action: "OPEN_SPOTIFY", reply: es ? "Abriendo Spotify." : "Opening Spotify." };
  }
  if (/abre.*configuración|ajustes|open settings/i.test(t)) {
    await openApp(APP_SCHEMES.settings);
    return { handled: true, action: "OPEN_SETTINGS", reply: es ? "Abriendo configuración." : "Opening settings." };
  }

  // --- Llamadas ---
  const callMatch = t.match(/llama(?:r)? (?:al?\s+)?(\+?[\d\s\-]{7,})/i);
  if (callMatch) {
    const number = callMatch[1].replace(/\s+/g, "");
    makeCall(number);
    return { handled: true, action: "MAKE_CALL", reply: es ? `Llamando al ${number}.` : `Calling ${number}.` };
  }

  // --- SMS ---
  const smsMatch = t.match(/(?:manda|envía|send).*(?:mensaje|sms|message).*?(\+?[\d\s]{7,})/i);
  if (smsMatch) {
    const number = smsMatch[1].replace(/\s+/g, "");
    sendSMS(number);
    return { handled: true, action: "SEND_SMS", reply: es ? `Abriendo mensaje para ${number}.` : `Opening message for ${number}.` };
  }

  // --- Recordatorio / notificación ---
  const reminderMatch = t.match(/recuérdame|recordatorio|remind me|set reminder/i);
  if (reminderMatch) {
    await scheduleNotification({
      title: "APAX",
      body: es ? "Recordatorio activado." : "Reminder set.",
      seconds: 10,
    });
    return { handled: true, action: "SET_REMINDER", reply: es ? "Recordatorio configurado." : "Reminder set." };
  }

  return { handled: false, action: null, reply: null };
}
