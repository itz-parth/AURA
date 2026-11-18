import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatPanel from "../components/ChatPanel";
import QueuePanel from "../components/QueuePanel";
import StagePlayer from "../components/StagePlayer";

export default function SyncStage() {
  const { code } = useParams();
  const { token, user } = useAuth();
  const [isHost, setIsHost] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState(null);
  const playerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const res = await fetch(`http://localhost:8000/rooms/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!mounted) return;
        setIsHost(data.room.host_id === user?.id);
        setLoaded(true);
      } catch (err) {
        console.error(err);
      }
    }

    init();

    async function poll() {
      if (!mounted) return;
      try {
        const res = await fetch(`http://localhost:8000/rooms/${code}/state`);
        const data = await res.json();
        if (!mounted) return;
        setState(data);
      } catch (err) {
        console.error(err);
      }
    }

    poll();
    const interval = setInterval(poll, 3000);
    pollIntervalRef.current = interval;

    return () => {
      mounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [code, token, user]);

  const handleYouTubeReady = (player) => {
    playerRef.current = player;
    if (state && state.now_playing) {
      const p = player.internalPlayer;
      p.loadVideoById(state.now_playing.videoId, state.elapsed_seconds);
    }
  };

  useEffect(() => {
    if (!state || !state.now_playing || !playerRef.current) return;
    const p = playerRef.current.internalPlayer;
    const currentVideoId = p.getVideoData ? p.getVideoData().video_id : null;
    const currentTime = p.getCurrentTime ? p.getCurrentTime() : 0;

    if (state.now_playing.videoId !== currentVideoId) {
      p.loadVideoById(state.now_playing.videoId, state.elapsed_seconds);
    } else if (Math.abs(currentTime - state.elapsed_seconds) > 3) {
      p.seekTo(state.elapsed_seconds);
    }
  }, [state]);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#050505] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Room #{code}</h1>
            <p className="text-white/50 text-sm">
              {isHost ? "You are the host" : "Guest"}
            </p>
          </div>
          <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-xs text-white/70">
            <span className={isHost ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-white"}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isHost ? "bg-purple-500" : "bg-white"}`} />
              {isHost ? "HOST" : "GUEST"}
            </span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <QueuePanel roomCode={code} isHost={isHost} />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <StagePlayer
                roomCode={code}
                isHost={isHost}
                nowPlaying={state ? state.now_playing : null}
                onReady={handleYouTubeReady}
              />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <ChatPanel roomCode={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
