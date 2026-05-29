// components/WaveformIndicator.jsx
// Módulo: indicador visual de forma de onda (escucha / habla)

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useApax } from "../store/apaxStore";

const BAR_COUNT = 7;

export default function WaveformIndicator() {
  const { state } = useApax();
  const bars = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))).current;
  const animations = useRef([]);

  const isActive = state.isListening || state.isSpeaking;
  const color = state.isListening ? "#ff4466" : "#00d4ff";

  useEffect(() => {
    animations.current.forEach((a) => a?.stop());

    if (!isActive) {
      bars.forEach((bar) => bar.setValue(0.2));
      return;
    }

    animations.current = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 80),
          Animated.timing(bar, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 0.2,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.current.forEach((a) => a.start());
    return () => animations.current.forEach((a) => a?.stop());
  }, [isActive]);

  return (
    <View style={styles.container}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: color, transform: [{ scaleY: bar }] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    gap: 4,
  },
  bar: {
    width: 4,
    height: 32,
    borderRadius: 2,
    opacity: 0.85,
  },
});
