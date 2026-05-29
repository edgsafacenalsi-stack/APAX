// components/VoiceButton.jsx
// Módulo: botón de activación de voz con estado visual

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useApax } from "../store/apaxStore";

export default function VoiceButton({ onPress }) {
  const { state } = useApax();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.button, state.isListening && styles.active]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{state.isListening ? "◉" : "◎"}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>
        {state.isListening ? "ESCUCHANDO..." : "HABLAR CON APAX"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 8,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0a0a0f",
    borderWidth: 2,
    borderColor: "#00d4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    borderColor: "#ff4466",
    backgroundColor: "#1a0010",
  },
  icon: {
    color: "#00d4ff",
    fontSize: 28,
  },
  label: {
    color: "#555",
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1.5,
  },
});
