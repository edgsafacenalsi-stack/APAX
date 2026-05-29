// components/HUDHeader.jsx
// Módulo: encabezado HUD con estado del sistema y selector de idioma

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useApax } from "../store/apaxStore";

export default function HUDHeader() {
  const { state, dispatch } = useApax();

  const toggleLanguage = () => {
    const next = state.language === "es" ? "en" : "es";
    dispatch({ type: "SET_LANGUAGE", payload: next });
    dispatch({ type: "LOG_ACTION", payload: `◈ Idioma cambiado a ${next.toUpperCase()}` });
  };

  const statusColor = state.isListening
    ? "#ff4466"
    : state.isSpeaking
    ? "#ffaa00"
    : "#00d4ff";

  const statusText = state.isListening
    ? "ESCUCHANDO"
    : state.isSpeaking
    ? "HABLANDO"
    : "EN ESPERA";

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.brand}>A P A X</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
        <Text style={styles.langText}>{state.language.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
    marginBottom: 8,
  },
  left: { gap: 2 },
  brand: {
    color: "#00d4ff",
    fontSize: 20,
    fontFamily: "monospace",
    letterSpacing: 6,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 9, fontFamily: "monospace", letterSpacing: 2 },
  langButton: {
    borderWidth: 1,
    borderColor: "#00d4ff",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langText: { color: "#00d4ff", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 },
});
