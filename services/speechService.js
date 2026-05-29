// services/speechService.js
// Módulo: síntesis de voz (TTS) y reconocimiento de voz (STT)

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

export function speak(text, language = "es") {
  Speech.speak(text, {
    language: language === "es" ? "es-AR" : "en-US",
    pitch: 0.95,
    rate: 1.0,
  });
}

export function stopSpeaking() {
  Speech.stop();
}

export async function requestMicPermission() {
  const { status } = await Audio.requestPermissionsAsync();
  return status === "granted";
}
