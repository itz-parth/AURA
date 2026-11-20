import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage, connected }) {
  return (
    <div className="mt-2 pt-2 border-t border-white/10 flex gap-2 bg-[#080A16] rounded-t-none">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message…"
        className="flex-1 bg-white/5 border border-white/10 rounded-lg pl-3 pr-2.5 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-aura-pink transition-all placeholder-white/30"
      />
      <button
        onClick={sendMessage}
        disabled={!input.trim() || !connected}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          input.trim() && connected
            ? "bg-aura-pink text-white shadow-[0_0_16px_rgba(245,44,155,0.4)] hover:bg-aura-pink/90"
            : "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
        }`}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
