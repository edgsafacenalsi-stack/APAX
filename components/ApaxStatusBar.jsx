// components/ApaxStatusBar.jsx
// Módulo: barra de estado inferior con métricas en tiempo real

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useApax } from "../store/apaxStore";

export default function ApaxStatusBar() {
  const { state } = useApax();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("es-AR", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });

  const msgCount = state.history.length;
  const logCount = state.actionLog.length;

  return (
    <View style={styles.bar}>
      <Text style={styles.item}>⏱ {timeStr}</Text>
      <Text style={styles.divider}>│</Text>
      <Text style={styles.item}>MSG {msgCount}</Text>
      <Text style={styles.divider}>│</Text>
      <Text style={styles.item}>LOG {logCount}</Text>
      <Text style={styles.divider}>│</Text>
      <Text style={styles.item}>{state.language.toUpperCase()}</Text>
      <Text style={styles.divider}>│</Text>
      <Text style={[styles.item, { color: state.isListening ? "#ff4466" : state.isSpeaking ? "#ffaa00" : "#00d4ff" }]}>
        {state.isListening ? "● REC" : state.isSpeaking ? "● SPK" : "○ IDL"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#1a1a2e",
    backgroundColor: "#050508",
  },
  item: {
    color: "#444",
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: 1,
  },
  divider: {
    color: "#1a1a2e",
    fontSize: 10,
  },
});
