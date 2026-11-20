import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import { request } from "../services/api";
import { useRoomPolling } from "../hooks/useRoomPolling";
import { useStageSocket } from "../hooks/useStageSocket";
import MobileTabBar from "../components/common/MobileTabBar";
import StageHeader from "../components/stage/StageHeader";
import StageBody from "../components/stage/StageBody";

export default function SyncStage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 1024);
  const playerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { state, setState, loaded, isHost } = useRoomPolling({
    code,
    token,
    userId: user?.id,
  });
  const { connected } = useStageSocket({
    socket,
    code,
    userId: user?.id,
    setState,
  });

  const handleYouTubeReady = (player) => {
    playerRef.current = player;
    if (state && state.now_playing) {
      const p = playerRef.current;
      p.loadVideoById(state.now_playing.videoId, state.elapsed_seconds);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleLeave = () => {
    if (showLeaveConfirm) {
      socket.disconnect();
      navigate("/nexus");
    } else {
      setShowLeaveConfirm(true);
    }
  };

  const handleAddToQueue = (track) => {
    if (!isHost) return;
    request(`/rooms/${code}/queue`, {
      method: "POST",
      body: track,
      token,
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit("sync_queue", {
          code,
          user_id: user?.id,
          queue: data.queue || [],
          now_playing: data.now_playing || null,
        });
      })
      .catch((err) => console.error(err));
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#080A16] text-white overflow-hidden relative">
      <div className="ambient-light" />

      <StageHeader
        code={code}
        connected={connected}
        listenerCount={listenerCount}
        handleCopyCode={handleCopyCode}
        handleLeave={handleLeave}
        showLeaveConfirm={showLeaveConfirm}
      />

      {showLeaveConfirm && (
        <div className="fixed top-20 right-6 z-50 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs text-white/80 shadow-lg animate-in fade-in slide-in-from-right-2 duration-200">
          Click again to confirm leaving the room.
        </div>
      )}

      <main className="pt-24 pb-6 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {isMobile ? (
          <MobileTabBar
            code={code}
            isHost={isHost}
            user={user}
            socket={socket}
            state={state}
            listenerCount={listenerCount}
            onListenerChange={setListenerCount}
            onReady={handleYouTubeReady}
            playerRef={playerRef}
            onAddToQueue={handleAddToQueue}
          />
        ) : (
          <StageBody
            code={code}
            isHost={isHost}
            state={state}
            user={user}
            socket={socket}
            listenerCount={listenerCount}
            onListenerChange={setListenerCount}
            playerRef={playerRef}
            onReady={handleYouTubeReady}
            handleAddToQueue={handleAddToQueue}
          />
        )}
      </main>
    </div>
  );
}
