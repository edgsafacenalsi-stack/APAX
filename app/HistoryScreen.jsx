// app/HistoryScreen.jsx
// Módulo: historial completo de conversación con APAX

import React from "react";
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, StatusBar, TouchableOpacity
} from "react-native";
import { useApax } from "../store/apaxStore";

function MessageBubble({ item }) {
  const isUser = item.role === "user";
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleApax]}>
      <Text style={styles.bubbleRole}>{isUser ? "TÚ" : "APAX"}</Text>
      <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textApax]}>
        {item.content}
      </Text>
    </View>
  );
}

export default function HistoryScreen({ onBack }) {
  const { state } = useApax();
  const messages = [...state.history].reverse();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>← VOLVER</Text>
          </TouchableOpacity>
          <Text style={styles.title}>HISTORIAL</Text>
          <Text style={styles.count}>{state.history.length} MSG</Text>
        </View>

        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sin conversaciones aún.</Text>
            <Text style={styles.emptyHint}>Hablá con APAX para empezar.</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <MessageBubble item={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a0f" },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 16,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#1a1a2e",
  },
  backText: { color: "#00d4ff", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 },
  title: { color: "#00d4ff", fontFamily: "monospace", fontSize: 14, letterSpacing: 4 },
  count: { color: "#333", fontFamily: "monospace", fontSize: 10 },
  list: { paddingBottom: 24 },
  bubble: {
    marginBottom: 12, padding: 12,
    borderRadius: 4, borderWidth: 1,
  },
  bubbleUser: {
    borderColor: "#1a1a2e", backgroundColor: "#050510",
    marginLeft: 32,
  },
  bubbleApax: {
    borderColor: "#0a2a3a", backgroundColor: "#020d12",
    marginRight: 32,
  },
  bubbleRole: {
    color: "#333", fontFamily: "monospace",
    fontSize: 9, letterSpacing: 2, marginBottom: 4,
  },
  bubbleText: { fontFamily: "monospace", fontSize: 13, lineHeight: 20 },
  textUser: { color: "#c0d8ff" },
  textApax: { color: "#a0e8ff" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { color: "#333", fontFamily: "monospace", fontSize: 13 },
  emptyHint: { color: "#222", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 },
});
