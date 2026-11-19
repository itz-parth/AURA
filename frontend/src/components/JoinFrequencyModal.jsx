import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, Music2, Plus, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8000";

export default function JoinFrequencyModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [mode, setMode] = useState("create"); // "create" | "join"
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
      const res = await fetch(`${API_BASE}/rooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch(`${API_BASE}/rooms/${roomCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row gap-0"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header (shared on both panels) */}
        <div className="lg:w-full lg:flex-none lg:rounded-2xl-none lg:border-none lg:shadow-none lg:border-0 lg:bg-transparent lg:p-0 p-8 lg:p-10 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-aura-pink to-aura-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Let's get in sync.</h2>
          <p className="text-white/60 text-lg">
            Create your own space or join your friends.
          </p>
        </div>

        {/* Divider between header and panels (desktop) */}
        <div className="hidden lg:block border-l border-white/10 h-32" />

        {/* Panels container */}
        <div className="flex-1 lg:flex lg:h-full gap-0">
          {/* Option A: Create a room */}
          <div
            className={`flex-1 p-8 lg:p-10 flex flex-col gap-4 ${
              mode === "create"
                ? "border-r border-white/10 lg:border-r lg:border-b-0"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-aura-pink" />
              <h3 className="text-xl font-bold">Create a room</h3>
            </div>
            <p className="text-white/50">Start the music. Invite your people.</p>

            <form onSubmit={handleCreateRoom} className="mt-4 flex flex-col gap-3 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-aura-pink transition placeholder-white/40"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </form>
          </div>

          {/* Option B: Join a room */}
          <div
            className={`flex-1 p-8 lg:p-10 flex flex-col gap-4 ${
              mode === "join"
                ? "border-l border-white/10 lg:border-l lg:border-t-0"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-aura-cyan" />
              <h3 className="text-xl font-bold">Join a room</h3>
            </div>
            <p className="text-white/50">Got a code? Your people are waiting.</p>

            <form onSubmit={handleJoinRoom} className="mt-4 flex flex-col gap-3 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-aura-cyan transition placeholder-white/40 uppercase tracking-widest text-xl"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Joining..." : "Join Room"}
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </form>
          </div>
        </div>

        {/* Switch mode hints (mobile/stacked) */}
        <div className="lg:hidden p-6 border-t border-white/10 bg-white/5">
          <p className="text-xs text-white/40 text-center mb-3">
            Switch:
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setMode("create")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === "create"
                  ? "bg-aura-pink text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setMode("join")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === "join"
                  ? "bg-aura-cyan text-[#080A16]"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Join
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
