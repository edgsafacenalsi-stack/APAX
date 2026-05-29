// services/intentService.js
// Módulo: detección de intención a partir del texto del usuario
// Clasifica el input antes de enviarlo a Claude para enriquecer el contexto

const INTENTS = {
  GREETING: /^(hola|buenas|hey|qué tal|good morning|hi|hello)/i,
  TIME: /(qué hora|hora es|what time|current time)/i,
  DATE: /(qué día|fecha|what date|today is)/i,
  WEATHER: /(clima|tiempo|lluvia|calor|frío|weather|temperature)/i,
  MEMORY: /(recuerdas|te acuerdas|do you remember|recall)/i,
  CLEAR: /(borra|olvidar|limpiar historial|clear history|forget)/i,
  LANGUAGE: /(cambia.*idioma|habla.*inglés|habla.*español|switch.*language|change.*language)/i,
  IDENTITY: /(quién eres|cómo te llamas|who are you|your name)/i,
};

export function detectIntent(text) {
  for (const [intent, pattern] of Object.entries(INTENTS)) {
    if (pattern.test(text)) return intent;
  }
  return "GENERAL";
}

export function buildContextNote(intent, profile) {
  const name = profile?.name ? `, el usuario se llama ${profile.name}` : "";
  switch (intent) {
    case "GREETING":
      return `El usuario está saludando${name}. Responde de forma breve y cálida.`;
    case "TIME":
      return `El usuario pregunta la hora. La hora actual es ${new Date().toLocaleTimeString("es-AR")}.`;
    case "DATE":
      return `El usuario pregunta la fecha. Hoy es ${new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;
    case "CLEAR":
      return "El usuario quiere borrar el historial. Confirmalo y ejecutá la acción.";
    case "IDENTITY":
      return "El usuario pregunta quién eres. Recordale que eres APAX, su asistente personal.";
    default:
      return "";
  }
}
