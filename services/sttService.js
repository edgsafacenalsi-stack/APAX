// services/sttService.js
// Módulo: reconocimiento de voz (STT) nativo Android
// Usa @react-native-voice/voice

import Voice from "@react-native-voice/voice";

let _callbacks = {};

export function initSTT({ onResult, onError, onStart, onEnd }) {
  _callbacks = { onResult, onError, onStart, onEnd };

  Voice.onSpeechStart   = () => _callbacks.onStart?.();
  Voice.onSpeechEnd     = () => _callbacks.onEnd?.();
  Voice.onSpeechError   = (e) => _callbacks.onError?.(e?.error?.message ?? "STT error");
  Voice.onSpeechResults = (e) => {
    const text = e?.value?.[0]?.trim() ?? "";
    if (text) _callbacks.onResult?.(text);
  };
  // Resultado parcial — útil para wake word
  Voice.onSpeechPartialResults = (e) => {
    const text = e?.value?.[0]?.trim() ?? "";
    if (text) _callbacks.onResult?.(text);
  };
}

export async function startListening(language = "es", overrideCallbacks = null) {
  if (overrideCallbacks) {
    Voice.onSpeechResults = (e) => {
      const text = e?.value?.[0]?.trim() ?? "";
      if (text) overrideCallbacks.onResult?.(text);
    };
    Voice.onSpeechPartialResults = (e) => {
      const text = e?.value?.[0]?.trim() ?? "";
      if (text) overrideCallbacks.onResult?.(text);
    };
    Voice.onSpeechError = (e) => overrideCallbacks.onError?.(e?.error?.message ?? "STT error");
  }

  try {
    const locale = language === "es" ? "es-AR" : "en-US";
    await Voice.start(locale);
  } catch (err) {
    _callbacks.onError?.(err.message);
  }
}

export async function stopListening() {
  try { await Voice.stop(); } catch (_) {}
}

export async function destroySTT() {
  try {
    await Voice.destroy();
    Voice.removeAllListeners();
  } catch (_) {}
}

export async function isSTTAvailable() {
  try {
    const avail = await Voice.isAvailable();
    return !!avail;
  } catch (_) {
    return false;
  }
}
