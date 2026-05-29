// app/index.jsx
// Pantalla principal de APAX

import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { ApaxProvider, useApax } from "../store/apaxStore";
import { askApax } from "../services/claudeService";
import { speak, requestMicPermission } from "../services/speechService";
import ActionLog from "../components/ActionLog";
import VoiceButton from "../components/VoiceButton";

function ApaxScreen() {
  const { state, dispatch } = useApax();
  const [inputText, setInputText] = useState("");

  const handleVoicePress = async () => {
    if (state.isListening) return;

    const granted = await requestMicPermission();
    if (!granted) {
      dispatch({ type: "LOG_ACTION", payload: "⚠ Permiso de micrófono denegado" });
      return;
    }

    dispatch({ type: "SET_LISTENING", payload: true });
    dispatch({ type: "LOG_ACTION", payload: "🎙 Escuchando..." });

    // TODO: integrar STT nativo en próximo módulo
    // Por ahora simula entrada de texto
    const simulatedInput = "¿Qué hora es?";
    dispatch({ type: "ADD_MESSAGE", payload: { role: "user", content: simulatedInput } });
    dispatch({ type: "LOG_ACTION", payload: `▸ Entrada: "${simulatedInput}"` });
    dispatch({ type: "SET_LISTENING", payload: false });

    dispatch({ type: "LOG_ACTION", payload: "⟳ Consultando a APAX..." });
    const reply = await askApax({
      message: simulatedInput,
      history: state.history,
      language: state.language,
    });

    dispatch({ type: "ADD_MESSAGE", payload: { role: "assistant", content: reply } });
    dispatch({ type: "LOG_ACTION", payload: `◈ APAX: "${reply.slice(0, 60)}..."` });
    dispatch({ type: "SET_SPEAKING", payload: true });
    speak(reply, state.language);
    dispatch({ type: "SET_SPEAKING", payload: false });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <View style={styles.container}>
        <Text style={styles.brand}>A P A X</Text>
        <Text style={styles.sub}>SISTEMA ACTIVO · {state.language.toUpperCase()}</Text>
        <View style={styles.logContainer}>
          <ActionLog />
        </View>
        <View style={styles.controls}>
          <VoiceButton onPress={handleVoicePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ApaxProvider>
      <ApaxScreen />
    </ApaxProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0f" },
  container: { flex: 1, padding: 16 },
  brand: {
    color: "#00d4ff",
    fontSize: 24,
    fontFamily: "monospace",
    letterSpacing: 8,
    textAlign: "center",
    marginTop: 8,
  },
  sub: {
    color: "#333",
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 16,
  },
  logContainer: { flex: 1, borderWidth: 1, borderColor: "#1a1a2e", borderRadius: 4 },
  controls: { paddingVertical: 24, alignItems: "center" },
});
