import { useState } from "react";
import { Search, Music, Plus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { request } from "../services/api";
import TrackRow from "./common/TrackRow";

export default function QueuePanel({
  _roomCode,
  isHost,
  queue,
  nowPlaying,
  onAddToQueue,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  async function searchMusic() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await request(
        `/music/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function addToQueue(track) {
    if (!isHost) return;
    onAddToQueue(track);
    setResults([]);
    setQuery("");
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-aura-pink/20 flex items-center justify-center text-aura-pink">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Up Next</h2>
            <p className="text-xs text-white/50">
              {queue.length} track{queue.length !== 1 ? "s" : ""} in queue
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all ${
            showSearch
              ? "bg-aura-pink text-white shadow-[0_0_16px_rgba(245,44,155,0.4)]"
              : "bg-white/5 hover:bg-white/10 border border-white/10"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {nowPlaying && (
        <div
          className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <img
              src={nowPlaying.thumbnail || ""}
              alt={nowPlaying.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {nowPlaying.title}
            </div>
            <div className="text-[10px] text-white/50 truncate">
              {nowPlaying.artist}
            </div>
          </div>
          <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full">
            Now Playing
          </span>
        </div>
      )}

      {showSearch && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchMusic()}
              placeholder="Search tracks…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-aura-pink transition-all"
            />
            <button
              onClick={searchMusic}
              className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
            >
              Search
            </button>
          </div>
          {loading && <p className="text-[10px] text-white/50">Searching…</p>}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {results.map((t) => (
              <TrackRow key={t.videoId} track={t} onSelect={addToQueue} />
            ))}
            {results.length === 0 && query && !loading && (
              <p className="text-[10px] text-white/40 text-center py-2">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
      {!showSearch && queue.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-aura-pink/10 flex items-center justify-center text-aura-pink mb-3">
            <Music className="w-6 h-6" />
          </div>
          {isHost ? (
            <>
              <p className="text-xs font-bold text-white mb-1">Add your first track</p>
              <p className="text-[10px] text-white/50 mb-4">Search and add music to get started</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-white mb-1">Waiting for host…</p>
              <p className="text-[10px] text-white/50">The host controls the queue</p>
            </>
          )}
        </div>
      )}

      {!showSearch && queue.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          <motion.div layout className="flex flex-col gap-2">
            {queue.map((t, i) => (
              <motion.div
                key={t.videoId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TrackRow track={t} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {!isHost && !showSearch && (
        <div className="flex items-center justify-center py-4">
          <p className="text-[10px] text-white/40">
            Host controls the queue
          </p>
        </div>
      )}
    </div>
  );
}
