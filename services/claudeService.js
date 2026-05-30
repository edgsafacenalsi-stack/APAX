// services/claudeService.js
// Módulo: comunicación con Claude API

import { ANTHROPIC_API_KEY } from "./config";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function askApax({ message, history = [], language = "es", contextNote = "" }) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY no configurada. Revisá app.config.js.");
  }

  const basePrompt = language === "es"
    ? "Eres APAX, un asistente de IA personal. Respondés de forma concisa, clara y directa en español rioplatense. Cada acción que realizás la anunciás brevemente antes de ejecutarla. Sos eficiente, no verbose."
    : "You are APAX, a personal AI assistant. You respond concisely, clearly and directly in English. You briefly announce each action before executing it. Be efficient, not verbose.";

  const systemPrompt = contextNote
    ? `${basePrompt}\n\nContexto adicional: ${contextNote}`
    : basePrompt;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [...history.slice(-20), { role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}
