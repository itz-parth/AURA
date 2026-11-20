import { useState } from "react";
import { Music2, TrendingUp, MessageSquare } from "lucide-react";

import StagePlayer from "../StagePlayer";
import QueuePanel from "../QueuePanel";
import ChatPanel from "../ChatPanel";

export default function MobileTabBar({
  code,
  isHost,
  user,
  socket,
  state,
  listenerCount,
  onListenerChange,
  onReady,
  playerRef,
  onAddToQueue,
}) {
  const [mobileTab, setMobileTab] = useState("player");

  const playerProps = {
    roomCode: code,
    isHost,
    nowPlaying: state?.now_playing || null,
    onReady,
    playerRef,
    isPlaying: state?.now_playing ? true : false,
    elapsedSeconds: state?.elapsed_seconds || 0,
  };

  const queueProps = {
    roomCode: code,
    isHost,
    queue: state?.queue || [],
    nowPlaying: state?.now_playing || null,
    onAddToQueue,
  };

  const chatProps = {
    roomCode: code,
    user,
    socket,
    listenerCount,
    onListenerChange,
    isHost,
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-aura-pink" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">AURA</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-white/60">Room #{code}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {mobileTab === "player" && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <StagePlayer {...playerProps} />
          </div>
        )}
        {mobileTab === "queue" && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <QueuePanel {...queueProps} />
          </div>
        )}
        {mobileTab === "chat" && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <ChatPanel {...chatProps} />
          </div>
        )}
      </div>

      <div className="flex border-t border-white/10 bg-white/5">
        {["player", "queue", "chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${
              mobileTab === tab
                ? "text-aura-cyan bg-white/10"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab === "player" && <Music2 className="w-4 h-4" />}
            {tab === "queue" && <TrendingUp className="w-4 h-4" />}
            {tab === "chat" && <MessageSquare className="w-4 h-4" />}
            <span className={mobileTab === tab ? "font-bold" : "font-normal"}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
