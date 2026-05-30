// app/HUDScreen.jsx
// Módulo: pantalla principal HUD — voz, log, wake word

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useApax } from "../store/apaxStore";
import ActionLog from "../components/ActionLog";
import VoiceButton from "../components/VoiceButton";
import HUDHeader from "../components/HUDHeader";
import WaveformIndicator from "../components/WaveformIndicator";
import ApaxStatusBar from "../components/ApaxStatusBar";
import WakeWordIndicator from "../components/WakeWordIndicator";
import { useVoiceSession } from "../hooks/useVoiceSession";
import { useWakeWord } from "../hooks/useWakeWord";
import { useProactive } from "../hooks/useProactive";
import { useKeepAwake } from "../hooks/useKeepAwake";

export default function HUDScreen() {
  const { state } = useApax();
  const { activate } = useVoiceSession();

  // Mantiene pantalla encendida al escuchar/hablar
  useKeepAwake();

  // Proactivo al iniciar
  useProactive();

  // Wake word
  const { wakeActive, partialText, toggle: toggleWake } = useWakeWord({
    onWake: () => activate(),
  });

  if (!state.ready) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>INICIANDO APAX...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HUDHeader />
      <View style={styles.logContainer}>
        <ActionLog />
      </View>
      <WakeWordIndicator
        active={wakeActive}
        partialText={partialText}
        onToggle={toggleWake}
      />
      <WaveformIndicator />
      <View style={styles.controls}>
        <VoiceButton onPress={activate} />
      </View>
      <ApaxStatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  logContainer: {
    flex: 1, borderWidth: 1,
    borderColor: "#1a1a2e", borderRadius: 4, marginBottom: 8,
  },
  controls: {
    paddingVertical: 16, alignItems: "center",
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#00d4ff", fontFamily: "monospace", letterSpacing: 4, fontSize: 12 },
});
