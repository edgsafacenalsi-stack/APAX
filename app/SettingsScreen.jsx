// app/SettingsScreen.jsx
// Módulo: pantalla de configuración de APAX

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert
} from "react-native";
import { useApax } from "../store/apaxStore";
import { saveProfile, clearHistory } from "../services/memoryService";

export default function SettingsScreen({ onBack }) {
  const { state, dispatch } = useApax();
  const [name, setName] = useState(state.profile?.name ?? "");

  const log = (text) => dispatch({ type: "LOG_ACTION", payload: text });

  const handleSaveName = async () => {
    const profile = { ...state.profile, name: name.trim() || null };
    await saveProfile(profile);
    dispatch({ type: "SET_PROFILE", payload: profile });
    log(`◈ Perfil actualizado: ${name.trim() || "sin nombre"}`);
    onBack();
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Borrar historial",
      "¿Seguro? APAX olvidará toda la conversación anterior.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            dispatch({ type: "CLEAR_HISTORY" });
            log("◈ Historial borrado desde configuración");
            onBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>← VOLVER</Text>
        </TouchableOpacity>

        <Text style={styles.title}>CONFIGURACIÓN</Text>

        <View style={styles.section}>
          <Text style={styles.label}>TU NOMBRE</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Cómo querés que te llame APAX"
            placeholderTextColor="#333"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveName}>
          <Text style={styles.buttonText}>GUARDAR</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearHistory}>
          <Text style={styles.dangerText}>BORRAR HISTORIAL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0f" },
  container: { flex: 1, padding: 20 },
  back: { marginBottom: 24 },
  backText: { color: "#00d4ff", fontFamily: "monospace", fontSize: 12, letterSpacing: 2 },
  title: { color: "#00d4ff", fontFamily: "monospace", fontSize: 16, letterSpacing: 4, marginBottom: 32 },
  section: { marginBottom: 16 },
  label: { color: "#444", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#1a1a2e", borderRadius: 4,
    padding: 12, color: "#a0e8ff", fontFamily: "monospace", fontSize: 14,
    backgroundColor: "#050508",
  },
  button: {
    borderWidth: 1, borderColor: "#00d4ff", borderRadius: 4,
    padding: 12, alignItems: "center", marginBottom: 32,
  },
  buttonText: { color: "#00d4ff", fontFamily: "monospace", fontSize: 12, letterSpacing: 2 },
  divider: { borderTopWidth: 1, borderColor: "#1a1a2e", marginBottom: 32 },
  dangerButton: {
    borderWidth: 1, borderColor: "#ff4466", borderRadius: 4,
    padding: 12, alignItems: "center",
  },
  dangerText: { color: "#ff4466", fontFamily: "monospace", fontSize: 12, letterSpacing: 2 },
});
