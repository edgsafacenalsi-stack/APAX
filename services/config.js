// services/config.js
// Variables de entorno en runtime

import Constants from "expo-constants";

function getEnv(key) {
  const fromConstants = Constants.expoConfig?.extra?.[key];
  if (fromConstants) return fromConstants;
  return process.env[key] ?? null;
}

export const GROQ_API_KEY  = getEnv("GROQ_API_KEY");
export const APAX_LANGUAGE = getEnv("APAX_LANGUAGE") ?? "es";
