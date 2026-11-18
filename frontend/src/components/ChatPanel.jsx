import { useEffect, useState } from "react";

export default function ChatPanel({ roomCode, username, setUsername }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;
    const message = { user: username || "Anonymous", text: input };
    setMessages((prev) => [...prev, message]);
    setInput("");
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="h-64 overflow-y-auto space-y-2 p-3 bg-black/20 rounded-lg border border-white/5">
        {messages.map((m, i) => (
          <div key={i} className="text-sm text-white/80">
            <span className="text-purple-400 font-medium">{m.user}:</span> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-white text-sm font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
