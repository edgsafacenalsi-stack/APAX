// components/ActionLog.jsx
// Módulo: log visual de acciones en tiempo real (estilo HUD)

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useApax } from "../store/apaxStore";

export default function ActionLog() {
  const { state } = useApax();

  const renderItem = ({ item }) => (
    <View style={styles.entry}>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>▸ REGISTRO DE ACCIONES</Text>
      <FlatList
        data={state.actionLog}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Sin actividad aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 12,
  },
  header: {
    color: "#00d4ff",
    fontSize: 11,
    fontFamily: "monospace",
    letterSpacing: 2,
    marginBottom: 8,
  },
  entry: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  timestamp: {
    color: "#444",
    fontSize: 11,
    fontFamily: "monospace",
    width: 80,
  },
  text: {
    color: "#a0e8ff",
    fontSize: 12,
    fontFamily: "monospace",
    flex: 1,
  },
  empty: {
    color: "#333",
    fontFamily: "monospace",
    fontSize: 12,
  },
});
