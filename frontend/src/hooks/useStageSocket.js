import { useState, useEffect } from "react";

export function useStageSocket({ socket, code, userId, setState }) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    socket.connect();

    socket.on("connect", () => {
      if (!mounted) return;
      setConnected(true);
      socket.emit("join_room", { code, user_id: userId });
    });

    socket.on("disconnect", () => {
      if (!mounted) return;
      setConnected(false);
    });

    socket.on("playback_synced", (data) => {
      if (!mounted) return;
      setState((prev) => ({
        ...prev,
        now_playing: data.now_playing || prev?.now_playing,
        elapsed_seconds: data.elapsed_seconds || 0,
      }));
    });

    socket.on("queue_synced", (data) => {
      if (!mounted) return;
      setState((prev) => ({
        ...prev,
        queue: data.queue || prev?.queue,
        now_playing: data.now_playing || prev?.now_playing,
      }));
    });

    socket.on("chat_message", () => {
      // ChatPanel handles its own socket listener internally
    });

    return () => {
      mounted = false;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("playback_synced");
      socket.off("queue_synced");
      socket.off("chat_message");
      socket.disconnect();
    };
  }, [socket, code, userId, setState]);

  return { connected };
}
