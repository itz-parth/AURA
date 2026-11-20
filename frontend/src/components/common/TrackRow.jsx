import { Music, Plus } from "lucide-react";

export default function TrackRow({ track, index, onSelect }) {
  const isFirst = index === 0;
  const thumb = track.thumbnail ? (
    <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
  ) : (
    <Music className="w-4 h-4 text-white/40 mx-auto mt-0.5" />
  );

  return (
    <div
      onClick={onSelect ? () => onSelect(track) : undefined}
      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
        isFirst
          ? "bg-aura-pink/10 border-aura-pink/30"
          : "bg-white/5 border-white/10"
      } ${onSelect ? "hover:border-white/20 hover:bg-white/10 cursor-pointer" : ""}`}
    >
      {index !== undefined && (
        <span className={`w-5 text-center text-[10px] font-bold ${isFirst ? "text-aura-pink" : "text-white/40"}`}>
          {index + 1}
        </span>
      )}
      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">{thumb}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white truncate">{track.title}</div>
        <div className="text-[10px] text-white/50 truncate">{track.artist}</div>
      </div>
      {isFirst ? (
        <div className="w-5 h-5 rounded-full bg-aura-pink flex items-center justify-center text-[10px] text-white">
          ▶
        </div>
      ) : onSelect ? (
        <Plus className="w-3 h-3 text-aura-pink" />
      ) : null}
    </div>
  );
}
