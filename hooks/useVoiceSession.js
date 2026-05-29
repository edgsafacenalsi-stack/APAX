// hooks/useVoiceSession.js
// Módulo: hook que orquesta STT -> Claude API -> TTS
// Es el núcleo de interacción de APAX

import { useEffect, useCallback } from "react";
import { useApax } from "../store/apaxStore";
import { initSTT, startListening, stopListening, destroySTT } from "../services/sttService";
import { askApax } from "../services/claudeService";
import { speak, stopSpeaking } from "../services/speechService";

export function useVoiceSession() {
  const { state, dispatch } = useApax();

  const log = (text) => dispatch({ type: "LOG_ACTION", payload: text });

  useEffect(() => {
    initSTT({
      onStart: () => {
        dispatch({ type: "SET_LISTENING", payload: true });
        log("🎙 Escuchando...");
      },
      onEnd: () => {
        dispatch({ type: "SET_LISTENING", payload: false });
      },
      onResult: async (text) => {
        if (!text.trim()) {
          log("⚠ No se detectó voz");
          return;
        }

        log(`▸ Escuché: "${text}"`);
        dispatch({ type: "ADD_MESSAGE", payload: { role: "user", content: text } });

        log("⟳ Procesando...");
        try {
          const reply = await askApax({
            message: text,
            history: state.history,
            language: state.language,
          });

          dispatch({ type: "ADD_MESSAGE", payload: { role: "assistant", content: reply } });
          log(`◈ APAX: "${reply.length > 80 ? reply.slice(0, 80) + "..." : reply}"`);

          dispatch({ type: "SET_SPEAKING", payload: true });
          speak(reply, state.language);
          dispatch({ type: "SET_SPEAKING", payload: false });
        } catch (err) {
          log(`✕ Error: ${err.message}`);
        }
      },
      onError: (msg) => {
        dispatch({ type: "SET_LISTENING", payload: false });
        log(`✕ STT Error: ${msg}`);
      },
    });

    return () => {
      destroySTT();
    };
  }, [state.language]);

  const activate = useCallback(async () => {
    if (state.isListening) {
      await stopListening();
      return;
    }
    if (state.isSpeaking) {
      stopSpeaking();
      dispatch({ type: "SET_SPEAKING", payload: false });
    }
    await startListening(state.language);
  }, [state.isListening, state.isSpeaking, state.language]);

  return { activate };
}
