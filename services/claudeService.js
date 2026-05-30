// services/claudeService.js
// Módulo: comunicación con Groq API (compatible OpenAI, gratuita)
// Modelo: llama-3.1-8b-instant — rápido y funciona bien en español

import { GROQ_API_KEY } from "./config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export async function askApax({ message, history = [], language = "es", contextNote = "" }) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY no configurada. Revisá app.config.js.");
  }

  const basePrompt = language === "es"
    ? "Eres APAX, un asistente de IA personal. Respondés de forma concisa, clara y directa en español rioplatense. Cada acción que realizás la anunciás brevemente antes de ejecutarla. Sos eficiente, no verbose."
    : "You are APAX, a personal AI assistant. Respond concisely and directly. Announce each action briefly before executing it.";

  const systemPrompt = contextNote
    ? `${basePrompt}\n\nContexto adicional: ${contextNote}`
    : basePrompt;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-20),
    { role: "user", content: message },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
