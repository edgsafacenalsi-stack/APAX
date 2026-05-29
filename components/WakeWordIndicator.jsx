// components/WakeWordIndicator.jsx
// Módulo: indicador visual del modo wake word (escucha pasiva)

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing,
} from "react-native-reanimated";

export default function WakeWordIndicator({ active, partialText, onToggle }) {
  const opacity = useSharedValue(active ? 1 : 0.3);

  React.useEffect(() => {
    if (active) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1, true
      );
    } else {
      opacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [active]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <Animated.View style={[styles.dot, dotStyle, active && styles.dotActive]} />
      <View style={styles.textContainer}>
        <Text style={[styles.label, active && styles.labelActive]}>
          {active ? "ESPERANDO \"APAX\"" : "WAKE WORD"}
        </Text>
        {active && partialText ? (
          <Text style={styles.partial} numberOfLines={1}>{partialText}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", alignItems: "center",
    gap: 8, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "#1a1a2e", borderRadius: 4,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#333",
  },
  dotActive: { backgroundColor: "#00d4ff" },
  textContainer: { flex: 1 },
  label: {
    color: "#333", fontFamily: "monospace",
    fontSize: 9, letterSpacing: 2,
  },
  labelActive: { color: "#00d4ff" },
  partial: {
    color: "#444", fontFamily: "monospace",
    fontSize: 9, marginTop: 2,
  },
});
