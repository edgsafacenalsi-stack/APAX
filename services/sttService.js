// services/sttService.js
// Módulo: reconocimiento de voz (STT) nativo para Android
// Usa @react-native-voice/voice

import Voice from "@react-native-voice/voice";

let _onResult = null;
let _onError = null;
let _onStart = null;
let _onEnd = null;

export function initSTT({ onResult, onError, onStart, onEnd }) {
  _onResult = onResult;
  _onError = onError;
  _onStart = onStart;
  _onEnd = onEnd;

  Voice.onSpeechStart = () => _onStart?.();
  Voice.onSpeechEnd = () => _onEnd?.();
  Voice.onSpeechResults = (e) => {
    const text = e.value?.[0] ?? "";
    _onResult?.(text);
  };
  Voice.onSpeechError = (e) => _onError?.(e.error?.message ?? "Error STT");
}

export async function startListening(language = "es") {
  try {
    await Voice.start(language === "es" ? "es-AR" : "en-US");
  } catch (err) {
    _onError?.(err.message);
  }
}

export async function stopListening() {
  try {
    await Voice.stop();
  } catch (_) {}
}

export async function destroySTT() {
  try {
    await Voice.destroy();
    Voice.removeAllListeners();
  } catch (_) {}
}
