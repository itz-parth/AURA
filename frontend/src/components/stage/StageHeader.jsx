import { Music2, Users2 } from "lucide-react";

export default function StageHeader({
  code,
  connected,
  listenerCount,
  handleCopyCode,
  handleLeave,
  showLeaveConfirm,
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 pt-5 pb-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-aura-pink to-aura-purple flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">AURA</h1>
            <p className="text-xs text-white/40">Stage • Room #{code}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
            <div className="flex items-center gap-1 text-xs">
              <span
                className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-aura-cyan" : "bg-white/40"}`}
              />
              <span className={connected ? "text-white" : "text-white/50"}>
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Users2 className="w-3 h-3" />
              <span>{listenerCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition border border-white/10"
              title="Copy room code"
            >
              {code}
            </button>
            <button
              onClick={handleLeave}
              className={showLeaveConfirm
                ? "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition shadow-lg shadow-red-900/30"
                : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition border border-white/10"}
            >
              {showLeaveConfirm ? "Leave again?" : "Leave room"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
