import { useState, useEffect } from "react";

export function useChatSocket({ socket, roomCode, username, listenerCount, onListenerChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("joined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          user: "System",
          text: `${data.user_id || "Someone"} joined the room`,
          system: true,
        },
      ]);
    });

    if (onListenerChange && listenerCount !== undefined) {
      onListenerChange(listenerCount + 1);
    }

    return () => {
      socket.off("chat_message");
      socket.off("joined");
      if (onListenerChange) {
        onListenerChange(Math.max(0, (listenerCount || 1) - 1));
      }
    };
  }, [socket, roomCode, username, listenerCount, onListenerChange]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const message = {
      user: username || "Anonymous",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, message]);
    setInput("");

    if (socket.connected) {
      socket.emit("chat_message", {
        code: roomCode,
        user: message.user,
        text: message.text,
        timestamp: message.timestamp,
      });
    }
  };

  return { messages, input, setInput, sendMessage };
}
