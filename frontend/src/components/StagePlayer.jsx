import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { socket } from "../socket";

export default function StagePlayer({ roomCode, isHost }) {
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const onSync = (playback) => {
      setVideoId(playback.videoId);
      setIsPlaying(playback.isPlaying);
      if (!isHost && playerRef.current && playerRef.current.internalPlayer) {
        const p = playerRef.current.internalPlayer;
        if (playback.isPlaying) p.playVideo();
        else p.pauseVideo();
        if (playback.videoId) p.loadVideoById(playback.videoId);
      }
    };
    socket.on("playback_synced", onSync);
    return () => socket.off("playback_synced", onSync);
  }, [isHost]);

  const opts = {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 0,
      controls: isHost ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onStateChange = (event) => {
    if (!isHost) return;
    const playing = event.data === 1;
    setIsPlaying(playing);
    socket.emit("sync_playback", {
      room_code: roomCode,
      user_id: "host",
      playback: { videoId, isPlaying: playing },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Player</h2>
      <div className="bg-black rounded-xl p-2 border border-white/10 relative group">
        {!videoId ? (
          <div className="h-[360px] flex items-center justify-center bg-white/5 rounded-lg border border-dashed border-white/10 text-white/50">
            No video loaded
          </div>
        ) : (
          <YouTube
            videoId={videoId}
            opts={opts}
            onStateChange={onStateChange}
            ref={playerRef}
          />
        )}
      </div>
      {isHost && videoId && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              const p = playerRef.current?.internalPlayer;
              if (p) {
                isPlaying ? p.pauseVideo() : p.playVideo();
              }
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      )}
      {!isHost && (
        <p className="text-xs text-white/50 text-center">Mirroring host playback...</p>
      )}
    </div>
  );
}
