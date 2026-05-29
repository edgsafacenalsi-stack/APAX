// hooks/useWakeWord.js
// Módulo: hook que gestiona el ciclo de vida del wake word
// Se activa/desactiva desde la pantalla principal

import { useEffect, useCallback, useState } from "react";
import { useApax } from "../store/apaxStore";
import {
  initWakeWord,
  startWakeWordLoop,
  stopWakeWordLoop,
  isWakeWordActive,
} from "../services/wakeWordService";

export function useWakeWord({ onWake, enabled = true }) {
  const { state, dispatch } = useApax();
  const [wakeActive, setWakeActive] = useState(false);
  const [partialText, setPartialText] = useState("");

  const log = (text) => dispatch({ type: "LOG_ACTION", payload: text });

  useEffect(() => {
    initWakeWord({
      onWake: () => {
        setWakeActive(false);
        setPartialText("");
        log("⚡ Wake word detectado — APAX activado");
        onWake?.();
      },
    });
  }, []);

  const enableWakeWord = useCallback(async () => {
    if (isWakeWordActive()) return;
    setWakeActive(true);
    log("👂 Modo espera — decí \"APAX\" para activar");
    await startWakeWordLoop((partial) => setPartialText(partial));
  }, []);

  const disableWakeWord = useCallback(() => {
    stopWakeWordLoop();
    setWakeActive(false);
    setPartialText("");
    log("○ Modo espera desactivado");
  }, []);

  const toggle = useCallback(() => {
    if (wakeActive) disableWakeWord();
    else enableWakeWord();
  }, [wakeActive]);

  return { wakeActive, partialText, toggle, enableWakeWord, disableWakeWord };
}
