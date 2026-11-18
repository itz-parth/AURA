import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, LogIn, User, Play } from "lucide-react";
import { socket } from "../socket";

export default function Nexus() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function createRoom() {
    setError("");
    try {
      const res = await fetch("http://localhost:8000/rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create room");
      navigate(`/stage/${data.code}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function joinRoom() {
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/rooms/${code}`);
      if (!res.ok) throw new Error("Room not found");
      navigate(`/stage/${code}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6">
      <div className="glass px-8 py-12 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-8">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-purple-400 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Aura</h1>
        <p className="text-white/50 text-lg">Listen Together</p>

        <button
          onClick={createRoom}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-900/20"
        >
          <Plus className="w-5 h-5" />
          Start a Frequency
        </button>

        <div className="space-y-3">
          <label className="text-left text-sm text-white/70 font-medium">
            Join by Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase tracking-widest"
            />
            <button
              onClick={joinRoom}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join
            </button>
          </div>
          {error && <p className="text-left text-red-400 text-sm">{error}</p>}
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-white/50 text-sm">
          <User className="w-4 h-4 inline mr-2" /> Host controls queue &amp; playback
        </div>
      </div>
    </div>
  );
}
