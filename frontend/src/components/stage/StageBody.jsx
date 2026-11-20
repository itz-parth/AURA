import QueuePanel from "../QueuePanel";
import StagePlayer from "../StagePlayer";
import ChatPanel from "../ChatPanel";

export default function StageBody({
  code,
  isHost,
  state,
  user,
  socket,
  listenerCount,
  onListenerChange,
  playerRef,
  onReady,
  handleAddToQueue,
}) {
  return (
    <div className="hidden lg:grid grid-cols-[260px_minmax(0,1fr)_320px] gap-5 h-[calc(100vh-140px)]">
      <div className="space-y-4 min-h-0 min-w-0">
        <QueuePanel
          roomCode={code}
          isHost={isHost}
          queue={state?.queue || []}
          nowPlaying={state?.now_playing || null}
          onAddToQueue={handleAddToQueue}
        />
      </div>

      <div className="space-y-4 min-h-0 min-w-0 flex flex-col">
        <StagePlayer
          roomCode={code}
          isHost={isHost}
          nowPlaying={state?.now_playing || null}
          onReady={onReady}
          playerRef={playerRef}
          isPlaying={state?.now_playing ? true : false}
          elapsedSeconds={state?.elapsed_seconds || 0}
        />
      </div>

      <div className="space-y-4 min-h-0 min-w-0">
        <ChatPanel
          roomCode={code}
          user={user}
          socket={socket}
          listenerCount={listenerCount}
          onListenerChange={onListenerChange}
          isHost={isHost}
        />
      </div>
    </div>
  );
}
