import { useRef } from "react";
import YouTube from "react-youtube";
import { Music2 } from "lucide-react";
import { motion } from "framer-motion";

import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import ProgressBar from "./stage/ProgressBar";
import PlaybackControls from "./stage/PlaybackControls";
import AudioVisualizer from "./stage/AudioVisualizer";

export default function StagePlayer({
  _roomCode,
  isHost,
  nowPlaying,
  onReady,
  playerRef,
  isPlaying,
  elapsedSeconds,
}) {
  const localPlayerRef = useRef(null);

  const {
    videoId,
    progress,
    volume,
    isMuted,
    opts,
    onStateChange,
    handleYouTubeReady,
    togglePlayback,
    previousTrack,
    nextTrack,
    setVolume,
    setIsMuted,
    trackDuration,
    progressPercent,
  } = useYouTubePlayer({
    nowPlaying,
    elapsedSeconds,
    isPlaying,
    isHost,
    onReady,
    playerRef,
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#080A16] radial-gradient bg-gradient-to-br from-aura-purple/20 via-aura-pink/10 to-transparent blur-[100px]"
      />

      <div className="relative flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group"
        >
          <div
            className="w-80 h-80 lg:w-96 lg:h-96 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group"
          >
            {nowPlaying?.thumbnail ? (
              <img
                src={nowPlaying.thumbnail}
                alt={nowPlaying.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-aura-purple/20 via-aura-pink/10 to-aura-cyan/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Music2 className="w-12 h-12 text-white/30" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 blur-[6px]" />

            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-spin-slow" />
            )}
          </div>

          <div className="mt-8 lg:mt-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
              {nowPlaying?.title || "No music playing"}
            </h2>
            <p className="text-white/60 text-sm lg:text-base mb-1">
              {nowPlaying?.artist || "Unknown artist"}
            </p>
            {isHost && (
              <span className="text-xs bg-aura-pink/10 text-aura-pink px-2 py-1 rounded-full border border-aura-pink/20">
                HOST
              </span>
            )}
          </div>
        </motion.div>

        <ProgressBar progress={progress} trackDuration={trackDuration} />

        <PlaybackControls
          isHost={isHost}
          isPlaying={isPlaying}
          videoId={videoId}
          trackDuration={trackDuration}
          progressPercent={progressPercent}
          progress={progress}
          onTogglePlayback={togglePlayback}
          onPreviousTrack={previousTrack}
          onNextTrack={nextTrack}
          onMuteToggle={() => setIsMuted((v) => !v)}
          volume={volume}
          isMuted={isMuted}
          setVolume={setVolume}
          setIsMuted={setIsMuted}
        />

        <AudioVisualizer isPlaying={isPlaying} videoId={videoId} />
      </div>

      {videoId && (
        <div className="absolute inset-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
          <YouTube
            videoId={videoId}
            opts={opts}
            onStateChange={onStateChange}
            onReady={handleYouTubeReady}
            ref={localPlayerRef}
          />
        </div>
      )}
    </div>
  );
}
