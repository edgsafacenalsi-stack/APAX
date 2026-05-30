// app.config.js
// Carga variables de entorno desde .env y las expone al bundle via expo-constants
// Este archivo reemplaza app.json en tiempo de build

import "dotenv/config";

export default {
  expo: {
    name: "APAX",
    slug: "apax",
    version: "0.4.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    backgroundColor: "#000000",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    android: {
      package: "com.apax.assistant",
      versionCode: 4,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000",
      },
      permissions: [
        "RECORD_AUDIO",
        "INTERNET",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "SYSTEM_ALERT_WINDOW",
        "WRITE_SETTINGS",
        "WAKE_LOCK",
      ],
    },
    plugins: [
      "@react-native-voice/voice",
      "expo-notifications",
      "expo-brightness",
      "expo-keep-awake",
    ],
    extra: {
      // Disponible via Constants.expoConfig.extra en runtime
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",
      APAX_LANGUAGE: process.env.APAX_LANGUAGE ?? "es",
      eas: {
        projectId: "apax-assistant",
      },
    },
  },
};
