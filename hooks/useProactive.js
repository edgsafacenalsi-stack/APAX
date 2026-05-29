// hooks/useProactive.js
// Módulo: hook que ejecuta chequeos proactivos al montar la app

import { useEffect } from "react";
import { useApax } from "../store/apaxStore";
import { checkMorningGreeting, checkWeatherAlert } from "../services/proactiveService";
import { speak } from "../services/speechService";

export function useProactive() {
  const { state, dispatch } = useApax();
  const log = (text) => dispatch({ type: "LOG_ACTION", payload: text });

  useEffect(() => {
    if (!state.ready) return;

    const run = async () => {
      // Saludo matutino
      const greeting = await checkMorningGreeting(state.language);
      if (greeting) {
        log(`🌅 Proactivo: saludo matutino`);
        dispatch({ type: "ADD_MESSAGE", payload: { role: "assistant", content: greeting } });
        speak(greeting, state.language);
      }

      // Alerta de clima extremo
      const alert = await checkWeatherAlert(state.language);
      if (alert) {
        log(`⚠ Proactivo: alerta de clima`);
        dispatch({ type: "ADD_MESSAGE", payload: { role: "assistant", content: alert } });
      }
    };

    // Pequeño delay para no interrumpir la carga
    const timer = setTimeout(run, 3000);
    return () => clearTimeout(timer);
  }, [state.ready]);
}
