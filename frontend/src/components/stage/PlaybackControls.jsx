import { SkipBack, Play, SkipForward, Volume2, VolumeX } from "lucide-react";

export default function PlaybackControls({
  isHost,
  isPlaying,
  videoId,
  trackDuration,
  progressPercent,
  progress,
  onTogglePlayback,
  onPreviousTrack,
  onNextTrack,
  onMuteToggle,
  volume,
  isMuted,
  setVolume,
  setIsMuted,
}) {
  return (
    <div className="mt-8 lg:mt-12 flex flex-col items-center gap-6">
      <div className="w-full max-w-[600px]">
        <div className="flex items-center gap-2 mb-2 text-xs text-white/50">
          <span className="text-white/40">
            {Math.floor(progress / 60)}:{Math.floor(progress % 60).toString().padStart(2, "0")}
          </span>
          <span className="ml-auto text-white/40">
            {Math.floor(trackDuration / 60)}:{Math.floor(trackDuration % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <div className="relative h-2 bg-white/10 rounded-full cursor-pointer group">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-aura-pink to-aura-purple rounded-full transition-all duration-100"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            style={{ left: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onPreviousTrack}
          disabled={!isHost}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed ${!isHost ? "bg-white/5" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlayback}
          disabled={!videoId}
          className={`w-18 h-18 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${
            videoId ? "btn-gradient hover:scale-105" : "bg-white/5 border border-white/10"
          } ${!videoId ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Play className={`w-7 h-7 ${isPlaying ? "ml-1" : ""}`} />
        </button>

        <button
          onClick={onNextTrack}
          disabled={!isHost}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed ${!isHost ? "bg-white/5" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {isHost && (
        <div className="flex items-center gap-2">
          <button
            onClick={onMuteToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setIsMuted(false);
              setVolume(parseInt(e.target.value));
            }}
            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-aura-pink"
          />
        </div>
      )}
    </div>
  );
}
