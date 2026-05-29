// services/claudeService.js
// Módulo: comunicación con Claude API (Anthropic)

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function askApax({ message, history = [], language = "es" }) {
  const systemPrompt =
    language === "es"
      ? "Eres APAX, un asistente de IA personal. Respondés de forma concisa, clara y directa en español. Cada acción que realizás la anunciás brevemente antes de ejecutarla."
      : "You are APAX, a personal AI assistant. You respond concisely, clearly and directly in English. You briefly announce each action before executing it.";

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [...history, { role: "user", content: message }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}
