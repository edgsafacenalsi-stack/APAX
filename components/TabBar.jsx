// components/TabBar.jsx
// Módulo: barra de navegación inferior entre HUD, Historial y Configuración

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const TABS = [
  { id: "hud",     label: "HUD",      icon: "◎" },
  { id: "history", label: "HISTORIAL", icon: "≡" },
  { id: "settings",label: "CONFIG",   icon: "⚙" },
];

export default function TabBar({ active, onSelect }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1a1a2e",
    backgroundColor: "#050508",
  },
  tab: {
    flex: 1, alignItems: "center",
    paddingVertical: 10, position: "relative",
  },
  icon: { color: "#333", fontSize: 16, marginBottom: 2 },
  activeIcon: { color: "#00d4ff" },
  label: { color: "#333", fontFamily: "monospace", fontSize: 8, letterSpacing: 1 },
  activeLabel: { color: "#00d4ff" },
  indicator: {
    position: "absolute", top: 0, left: "25%", right: "25%",
    height: 1, backgroundColor: "#00d4ff",
  },
});
