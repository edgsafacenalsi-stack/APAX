import "dotenv/config";

export default {
  expo: {
    name: "APAX",
    slug: "apax",
    version: "0.4.1",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    backgroundColor: "#000000",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    ios: {
      bundleIdentifier: "com.apax.assistant",
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
    ],
    extra: {
      GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",
      APAX_LANGUAGE: process.env.APAX_LANGUAGE ?? "es",
      eas: {
        projectId: "b808e017-3044-449d-aae3-5ab0b6f4efc9",
      },
    },
  },
};
