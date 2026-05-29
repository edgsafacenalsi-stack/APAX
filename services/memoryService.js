// services/memoryService.js
// Módulo: memoria persistente de APAX entre sesiones
// Usa AsyncStorage para guardar historial y preferencias

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  HISTORY: "apax:history",
  LANGUAGE: "apax:language",
  PROFILE: "apax:profile",
};

// --- Historial de conversación ---

export async function saveHistory(history) {
  try {
    // Guardar solo los últimos 50 mensajes para no crecer indefinidamente
    const trimmed = history.slice(-50);
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(trimmed));
  } catch (_) {}
}

export async function loadHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(KEYS.HISTORY);
  } catch (_) {}
}

// --- Preferencias ---

export async function saveLanguage(lang) {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
  } catch (_) {}
}

export async function loadLanguage() {
  try {
    return (await AsyncStorage.getItem(KEYS.LANGUAGE)) ?? "es";
  } catch (_) {
    return "es";
  }
}

// --- Perfil de usuario (nombre, preferencias libres) ---

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (_) {}
}

export async function loadProfile() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : { name: null };
  } catch (_) {
    return { name: null };
  }
}
