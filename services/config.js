// services/config.js
// Módulo: acceso a variables de entorno en runtime (React Native)
// expo-constants expone el archivo app.config.js extra al bundle

import Constants from "expo-constants";

function getEnv(key) {
  // 1. expo-constants (EAS Build / app.config.js)
  const fromConstants = Constants.expoConfig?.extra?.[key];
  if (fromConstants) return fromConstants;
  // 2. Fallback: process.env (metro bundler en dev)
  return process.env[key] ?? null;
}

export const ANTHROPIC_API_KEY = getEnv("ANTHROPIC_API_KEY");
export const APAX_LANGUAGE     = getEnv("APAX_LANGUAGE") ?? "es";
