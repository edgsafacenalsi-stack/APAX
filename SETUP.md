# APAX — Guía de instalación

## Requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio (para emulador) o dispositivo físico con Expo Go

## Pasos

### 1. Clonar el repo
```bash
git clone https://github.com/edgsafacenalsi-stack/APAX.git
cd APAX
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Editar `.env` y agregar tu API key de Anthropic:
```
ANTHROPIC_API_KEY=sk-ant-...
APAX_LANGUAGE=es
```

### 4. Ejecutar en Android
```bash
npm run android
```
O en dispositivo físico:
```bash
npx expo start
```
Escanear el QR con la app **Expo Go**.

## Notas
- El reconocimiento de voz (`@react-native-voice/voice`) requiere build nativo — no funciona en Expo Go puro. Para producción usar `expo prebuild`.
- Permisos de micrófono se solicitan automáticamente al primer uso.
- El brillo del sistema requiere permisos especiales en Android 6+, se solicitan al primer comando de brillo.

## Estructura
```
app/          → pantallas
components/   → UI modular
hooks/        → lógica de sesión de voz
services/     → Claude API, STT, TTS, sistema, comandos, memoria
store/        → estado global
```
