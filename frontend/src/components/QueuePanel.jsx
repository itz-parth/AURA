import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Search, Music, Play } from "lucide-react";

export default function QueuePanel({ roomCode, isHost }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (q) => setQueue(q);
    socket.on("queue_synced", handler);
    return () => socket.off("queue_synced", handler);
  }, []);

  async function searchMusic() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/music/search?q=${encodeURIComponent(query)}`);
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
    const newQueue = [...queue, track];
    setQueue(newQueue);
    socket.emit("sync_queue", { room_code: roomCode, user_id: "host", queue: newQueue });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Music className="w-5 h-5" /> Queue
      </h2>
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchMusic()}
            placeholder="Search music..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={searchMusic}
            className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded text-sm font-medium transition"
          >
            Search
          </button>
        </div>
        {loading && <p className="text-xs text-white/50">Searching...</p>}
        {results.map((t) => (
          <div
            key={t.videoId}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer transition group"
            onClick={() => addToQueue(t)}
          >
            <div className="w-12 h-12 rounded bg-white/10 flex-shrink-0">
              {t.thumbnail ? (
                <img src={t.thumbnail} alt={t.title} className="w-full h-full rounded object-cover" />
              ) : (
                <Music className="w-6 h-6 text-white/50 mx-auto mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{t.title}</div>
              <div className="text-xs text-white/50 truncate">{t.artist}</div>
            </div>
            <Play className="w-4 h-4 text-white/30 group-hover:text-purple-400" />
          </div>
        ))}
        {!isHost && (
          <p className="text-xs text-white/50 text-center">Waiting for host to add music...</p>
        )}
      </div>
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
        <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Current Queue ({queue.length})</h3>
        <div className="space-y-1">
          {queue.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/70">
              <span className="w-4 text-center">{i + 1}</span>
              <div className="flex-1 truncate">{t.title}</div>
              <div className="text-white/50">{t.artist}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
