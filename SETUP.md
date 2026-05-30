# APAX — Guía para generar el APK

## Requisitos
- Node.js 18+
- `npm install -g eas-cli`
- Cuenta gratis en https://expo.dev

---

## Paso 1 — Clonar y configurar

```bash
git clone https://github.com/edgsafacenalsi-stack/APAX.git
cd APAX
npm install
```

Crear el archivo `.env` en la raíz:
```
ANTHROPIC_API_KEY=sk-ant-api03-TU_KEY_AQUI
APAX_LANGUAGE=es
```

> Tu API key la obtenés en https://console.anthropic.com

---

## Paso 2 — Prebuild (genera carpeta android/)

```bash
npm run prebuild
# equivale a: expo prebuild --clean
```

Solo hace falta correrlo una vez, o cuando cambian los plugins nativos.

---

## Paso 3 — Generar APK con EAS

```bash
eas login          # te pide usuario de expo.dev
eas build:configure  # primera vez, asocia el proyecto
npm run build:apk  # sube a la nube y compila
```

EAS tarda ~10 minutos y te manda un **link de descarga del APK**.

---

## Paso 4 — Instalar en el teléfono

1. Descargar el `.apk` del link de EAS
2. En Android: Ajustes → Seguridad → Instalar apps desconocidas → permitir
3. Abrir el APK descargado e instalar

---

## Desarrollo local (sin APK)

Para probar con recarga en caliente — requiere dispositivo físico Android conectado por USB:

```bash
npm run android
```

> Nota: el STT (`@react-native-voice/voice`) NO funciona en Expo Go ni en emulador sin micrófono real.

---

## Variables de EAS Build (producción)

Para builds en la nube sin exponer el `.env`, configurar en EAS:

```bash
eas secret:create --scope project --name ANTHROPIC_API_KEY --value sk-ant-...
```

Esto inyecta la key en el build sin que esté en el repo.

---

## Estructura
```
app/              → pantallas (HUD, Historial, Config)
components/       → UI modular
hooks/            → lógica (voz, wake word, proactivo, keep awake)
services/         → Claude, STT, TTS, clima, sistema, memoria
store/            → estado global
assets/           → ícono y splash
```
