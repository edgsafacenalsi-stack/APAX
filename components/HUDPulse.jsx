// components/HUDPulse.jsx
// Módulo: anillo de pulso animado con Reanimated 2
// Se activa cuando APAX escucha o habla

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useApax } from "../store/apaxStore";

export default function HUDPulse({ size = 72 }) {
  const { state } = useApax();
  const isActive = state.isListening || state.isSpeaking;
  const color = state.isListening ? "#ff4466" : "#00d4ff";

  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale1.value = withRepeat(
        withSequence(
          withTiming(1.6, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ), -1, false
      );
      opacity1.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 100 }),
          withTiming(0, { duration: 700, easing: Easing.out(Easing.ease) })
        ), -1, false
      );
      scale2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(1.9, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ), -1, false
      );
      opacity2.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 400 }),
          withTiming(0.3, { duration: 100 }),
          withTiming(0, { duration: 700, easing: Easing.out(Easing.ease) })
        ), -1, false
      );
    } else {
      cancelAnimation(scale1); cancelAnimation(scale2);
      cancelAnimation(opacity1); cancelAnimation(opacity2);
      scale1.value = withTiming(1, { duration: 300 });
      scale2.value = withTiming(1, { duration: 300 });
      opacity1.value = withTiming(0, { duration: 300 });
      opacity2.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  const ringBase = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: color,
    position: "absolute",
  };

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[ringBase, ring1Style]} />
      <Animated.View style={[ringBase, ring2Style]} />
    </View>
  );
}
