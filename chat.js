const CHAT_API_URL = "https://random-trip-backend.vercel.app/api/chat";

window.askGPT = async function askGPT({ messages, prompt, signal } = {}) {
  const body = messages
    ? { messages }
    : { messages: [{ role: "user", content: String(prompt ?? "") }] };

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // ← 이게 있으면 브라우저가 OPTIONS 예비요청 보냄
    body: JSON.stringify(body),
    mode: "cors",
    signal
  });

  if (!res.ok) throw new Error(`Chat API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.content;
};
