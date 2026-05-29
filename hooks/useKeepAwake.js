// hooks/useKeepAwake.js
// Módulo: mantiene la pantalla encendida mientras APAX está activo
// Usa expo-keep-awake

import { useEffect } from "react";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useApax } from "../store/apaxStore";

const KEEP_AWAKE_TAG = "apax-active";

export function useKeepAwake() {
  const { state } = useApax();
  const shouldKeepAwake = state.isListening || state.isSpeaking;

  useEffect(() => {
    if (shouldKeepAwake) {
      activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    } else {
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    }
    return () => deactivateKeepAwake(KEEP_AWAKE_TAG);
  }, [shouldKeepAwake]);
}
