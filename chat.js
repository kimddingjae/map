// chat.js
window.askGPT = async function askGPT({ messages, prompt, signal } = {}) {
  const body = messages
    ? { messages }
    : { messages: [{ role: "user", content: String(prompt ?? "") }] };

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.content;
};
