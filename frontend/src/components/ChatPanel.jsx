import { useRef, useEffect } from "react";
import { Users2, Mic2 } from "lucide-react";

import { useChatSocket } from "../hooks/useChatSocket";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";

const listenerColorMap = {
  "bg-aura-pink/20 border-aura-pink/40": "var(--color-aura-pink)",
  "bg-aura-purple/20 border-aura-purple/40": "var(--color-aura-purple)",
  "bg-aura-cyan/20 border-aura-cyan/40": "var(--color-aura-cyan)",
};

const AVATAR_COLORS = Object.keys(listenerColorMap);

export default function ChatPanel({
  roomCode,
  user,
  socket,
  listenerCount,
  onListenerChange,
  isHost,
}) {
  const username = user?.username || localStorage.getItem("aura_username") || "";
  const messagesEndRef = useRef(null);

  const listenerColor = listenerColorMap[
    AVATAR_COLORS[(username.length || 0) % AVATAR_COLORS.length]
  ];

  const { messages, input, setInput, sendMessage } = useChatSocket({
    socket,
    roomCode,
    username,
    listenerCount,
    onListenerChange,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-aura-cyan/20 flex items-center justify-center text-aura-cyan">
              <Users2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Listening together</h2>
          </div>
          <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10">
            {listenerCount || 1} listening
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white/20"
            style={{ backgroundColor: listenerColor }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-white font-medium">{username || "You"}</span>
          {isHost && (
            <span className="text-[10px] bg-aura-pink/10 text-aura-pink px-2 py-0.5 rounded-full border border-aura-pink/20">
              Host
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-white">Room chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Mic2 className="w-6 h-6 text-white/20 mb-2" />
              <p className="text-xs text-white/40">Start the conversation</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              msg={msg}
              index={i}
              username={username}
              listenerColor={listenerColor}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} connected={socket.connected} />
      </div>
    </div>
  );
}
