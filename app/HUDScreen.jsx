// app/HUDScreen.jsx
// Pantalla principal HUD

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
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
import { isSTTAvailable } from "../services/sttService";
import { requestMicPermission } from "../services/speechService";

export default function HUDScreen() {
  const { state, dispatch } = useApax();
  const { activate } = useVoiceSession();
  const [sttReady, setSttReady] = useState(null); // null=checking, true/false

  useKeepAwake();
  useProactive();

  const { wakeActive, partialText, toggle: toggleWake } = useWakeWord({
    onWake: () => activate(),
  });

  useEffect(() => {
    (async () => {
      const micOk = await requestMicPermission();
      if (!micOk) {
        dispatch({ type: "LOG_ACTION", payload: "⚠ Permiso de micrófono denegado" });
        setSttReady(false);
        return;
      }
      const avail = await isSTTAvailable();
      setSttReady(avail);
      if (!avail) {
        dispatch({ type: "LOG_ACTION", payload: "⚠ STT no disponible en este dispositivo" });
      } else {
        dispatch({ type: "LOG_ACTION", payload: "◎ Sistema listo" });
      }
    })();
  }, []);

  if (!state.ready || sttReady === null) {
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
        onToggle={sttReady ? toggleWake : null}
      />
      <WaveformIndicator />
      <View style={styles.controls}>
        <VoiceButton onPress={sttReady ? activate : null} disabled={!sttReady} />
      </View>
      <ApaxStatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0a0a0f" },
  logContainer: {
    flex: 1, borderWidth: 1,
    borderColor: "#1a1a2e", borderRadius: 4, marginBottom: 8,
  },
  controls: { paddingVertical: 16, alignItems: "center" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" },
  loadingText: { color: "#00d4ff", fontFamily: "monospace", letterSpacing: 4, fontSize: 12 },
});
