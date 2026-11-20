import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, Music2, Plus, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { request } from "../services/api";

export default function JoinFrequencyModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [mode, setMode] = useState("create");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateRoom(e) {
    e.preventDefault();
    setError("");
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }
    setLoading(true);
    try {
      const res = await request("/rooms/", {
        method: "POST",
        token,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create room");
      onClose();
      navigate(`/stage/${data.code}`);
    } catch (err) {
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinRoom(e) {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(roomCode)) {
      setError("Please enter a valid 6-digit room code");
      return;
    }
    setLoading(true);
    try {
      const res = await request(`/rooms/${roomCode}`, {
        token,
      });
      if (!res.ok) throw new Error("Room not found");
      onClose();
      navigate(`/stage/${roomCode}`);
    } catch (err) {
      setError(err.message || "Room not found");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const isCreate = mode === "create";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-[780px] max-h-[85vh] overflow-y-auto relative flex flex-col gap-0"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="px-6 lg:px-8 pt-6 pb-4 flex flex-col items-start gap-3 border-b border-white/10 bg-white/4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-aura-pink to-aura-purple flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Music2 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Let's get in sync.</h2>
              <p className="text-white/50 text-sm">Your people are just one room away.</p>
            </div>
          </div>

          <div className="flex w-full mt-2">
            <button
              onClick={() => setMode("create")}
              className={`flex-1 h-[44px] rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                isCreate
                  ? "bg-white/8 border border-white/12 text-white shadow-[0_0_16px_rgba(245,44,155,0.25)]"
                  : "text-white/50 hover:bg-white/6 hover:text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
            <button
              onClick={() => setMode("join")}
              className={`flex-1 h-[44px] rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                !isCreate
                  ? "bg-white/8 border border-white/12 text-white shadow-[0_0_16px_rgba(85,217,245,0.25)]"
                  : "text-white/50 hover:bg-white/6 hover:text-white"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Join</span>
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 lg:px-8 py-4">
          {isCreate ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 lg:p-6 shadow-[0_0_24px_rgba(245,44,155,0.15)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-aura-pink/15 flex items-center justify-center text-aura-pink">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create a room</h3>
                  <p className="text-white/50 text-xs">
                    Start the music. Invite your people.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateRoom} className="mt-2 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full h-[50px] bg-white/6 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-aura-pink focus:bg-white/8 transition-all placeholder-white/30 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient text-white font-bold h-[50px] rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                >
                  {loading ? "Creating…" : "Create Room"}
                </button>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 lg:p-6 shadow-[0_0_24px_rgba(85,217,245,0.15)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-aura-cyan/15 flex items-center justify-center text-aura-cyan">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Join a room</h3>
                  <p className="text-white/50 text-xs">
                    Got a code? Your people are waiting.
                  </p>
                </div>
              </div>

              <form onSubmit={handleJoinRoom} className="mt-2 flex flex-col gap-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full h-[50px] bg-white/6 border border-white/10 rounded-xl px-4 text-white text-center focus:outline-none focus:ring-2 focus:ring-aura-cyan focus:bg-white/8 transition-all placeholder-white/30 text-sm uppercase tracking-widest"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient text-white font-bold h-[50px] rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                >
                  {loading ? "Joining…" : "Join Room"}
                </button>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
