// services/wakeWordService.js
// Módulo: detección de wake word ("apax") en modo escucha continua
// Estrategia: polling liviano con STT de corta duración en loop

import { startListening, stopListening } from "./sttService";

let _active = false;
let _onWake = null;
let _loopTimeout = null;
const WAKE_WORDS = ["apax", "apex", "a pax", "opax"]; // variantes de pronunciación

export function initWakeWord({ onWake }) {
  _onWake = onWake;
}

export function isWakeWordActive() {
  return _active;
}

export async function startWakeWordLoop(onPartialResult) {
  if (_active) return;
  _active = true;
  _loop(onPartialResult);
}

export function stopWakeWordLoop() {
  _active = false;
  if (_loopTimeout) clearTimeout(_loopTimeout);
  stopListening().catch(() => {});
}

async function _loop(onPartialResult) {
  if (!_active) return;

  try {
    await startListening("es", {
      onResult: (text) => {
        const lower = text.toLowerCase().trim();
        onPartialResult?.(lower);
        if (WAKE_WORDS.some((w) => lower.includes(w))) {
          stopWakeWordLoop();
          _onWake?.();
        }
      },
      onError: () => {
        // Reintentar silenciosamente
        if (_active) {
          _loopTimeout = setTimeout(() => _loop(onPartialResult), 1500);
        }
      },
    });
  } catch (_) {
    if (_active) {
      _loopTimeout = setTimeout(() => _loop(onPartialResult), 1500);
    }
  }
}
