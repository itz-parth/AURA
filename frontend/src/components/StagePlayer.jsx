import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

export default function StagePlayer({ roomCode, isHost, nowPlaying, onReady }) {
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

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
  };

  const handleYouTubeReady = (event) => {
    if (onReady) onReady(event.target);
    if (nowPlaying && nowPlaying.videoId) {
      setVideoId(nowPlaying.videoId);
      setIsPlaying(true);
      const p = event.target;
      p.loadVideoById(nowPlaying.videoId, 0);
    }
  };

  useEffect(() => {
    if (!nowPlaying || !playerRef.current) return;
    const p = playerRef.current.internalPlayer;
    if (p.getVideoData && p.getVideoData().video_id !== nowPlaying.videoId) {
      p.loadVideoById(nowPlaying.videoId, 0);
      setVideoId(nowPlaying.videoId);
    }
  }, [nowPlaying]);

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
            onReady={handleYouTubeReady}
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
