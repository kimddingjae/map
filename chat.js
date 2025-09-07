const CHAT_API_URL = "https://random-trip-backend.vercel.app/api/chat";


window.askGPT = async function askGPT({ messages, prompt, signal } = {}) {
  const body = messages
    ? { messages }
    : { messages: [{ role: "user", content: String(prompt ?? "") }] };

  const res = await fetch(CHAT_API_URL, {
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
  return data.content; // 서버에서 { content: "..." } 로 응답하게 맞춰둠
};
