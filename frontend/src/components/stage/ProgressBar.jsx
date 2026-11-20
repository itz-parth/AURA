function formatTime(seconds) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProgressBar({ progress, trackDuration }) {
  const progressPercent = trackDuration > 0 ? (progress / trackDuration) * 100 : 0;

  return (
    <div className="w-full max-w-[600px]">
      <div className="flex items-center gap-2 mb-2 text-xs text-white/50">
        <span className="text-white/40">{formatTime(progress)}</span>
        <span className="ml-auto text-white/40">{formatTime(trackDuration)}</span>
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
  );
}
