import { useState, useRef, useEffect } from "react";

export function useYouTubePlayer({ nowPlaying, elapsedSeconds, isPlaying, isHost, onReady, playerRef }) {
  const [videoId, setVideoId] = useState(nowPlaying?.videoId || null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const localPlayerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 1,
    },
  };

  const handleYouTubeReady = (event) => {
    if (onReady) onReady(event.target);
    localPlayerRef.current = event.target;
    if (playerRef.current) {
      playerRef.current = event.target;
    }
    if (nowPlaying && nowPlaying.videoId) {
      setVideoId(nowPlaying.videoId);
      event.target.loadVideoById(nowPlaying.videoId, elapsedSeconds || 0);
    }
    startProgressTimer();
  };

  const onStateChange = (event) => {
    if (!isHost) return;
    const playing = event.data === 1;
    const paused = event.data === 2;
    if (!playing && !paused) {
      stopProgressTimer();
    } else if (playing) {
      startProgressTimer();
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => p + 1);
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!nowPlaying || !localPlayerRef.current) return;
    const p = localPlayerRef.current;
    if (p.getVideoData && p.getVideoData().video_id !== nowPlaying.videoId) {
      p.loadVideoById(nowPlaying.videoId, 0);
      setVideoId(nowPlaying.videoId);
      startProgressTimer();
    }
  }, [nowPlaying, isHost]);

  useEffect(() => {
    if (isPlaying) startProgressTimer();
    else stopProgressTimer();
  }, [isPlaying]);

  useEffect(() => {
    if (!localPlayerRef.current) return;
    if (isMuted) {
      localPlayerRef.current.mute();
    } else {
      localPlayerRef.current.unMute();
      localPlayerRef.current.setVolume(volume);
    }
  }, [isMuted, volume, localPlayerRef]);

  useEffect(() => {
    return () => stopProgressTimer();
  }, []);

  const togglePlayback = () => {
    if (!isHost || !localPlayerRef.current) return;
    const p = localPlayerRef.current;
    if (isPlaying) {
      p.pauseVideo();
      stopProgressTimer();
    } else {
      p.playVideo();
      startProgressTimer();
    }
  };

  const previousTrack = () => {
    if (!isHost) return;
    if (localPlayerRef.current) {
      localPlayerRef.current.seekTo(0, true);
    }
  };

  const nextTrack = () => {
    if (!isHost) return;
    if (localPlayerRef.current) {
      const current = localPlayerRef.current.getCurrentTime();
      const duration = localPlayerRef.current.getDuration();
      if (current >= duration - 1) return;
      localPlayerRef.current.seekTo(duration, true);
    }
  };

  const trackDuration = nowPlaying?.duration || 0;
  const progressPercent = trackDuration > 0 ? (progress / trackDuration) * 100 : 0;

  return {
    videoId,
    progress,
    volume,
    isMuted,
    localPlayerRef,
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
  };
}
