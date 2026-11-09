"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function VarunVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isAmbientGlow, setIsAmbientGlow] = useState(true);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);
  const [activeSource, setActiveSource] = useState("/api/video");

  const rawBlobUrl =
    "https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn("Play error:", err);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.5;
      setVolume(0.5);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
      setIsMuted(clamped === 0);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleSeek = (offsetSec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + offsetSec)
      );
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = ratio * duration;
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (
        document.pictureInPictureEnabled &&
        typeof videoRef.current.requestPictureInPicture === "function"
      ) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (err) {
      console.warn("Picture-in-Picture error:", err);
    }
  };

  const triggerFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Native iOS Safari Fullscreen
    const iosVideo = video as unknown as { webkitEnterFullscreen?: () => void };
    if (typeof iosVideo.webkitEnterFullscreen === "function") {
      try {
        iosVideo.webkitEnterFullscreen();
        return;
      } catch (err) {
        console.warn("webkitEnterFullscreen fallback:", err);
      }
    }

    // 2. Standard HTML5 Fullscreen API
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn("requestFullscreen error:", err);
        });
      } else {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Keyboard Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input field
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        triggerFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePiP();
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleSeek(10);
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        handleSeek(-10);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleVolumeChange(volume + 0.1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleVolumeChange(volume - 0.1);
      } else if (e.key === "?") {
        setShowHotkeysModal((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setHasError(false);
    };
    const onError = () => {
      console.warn("Primary stream failed, switching to direct blob");
      setHasError(true);
      if (activeSource === "/api/video") {
        setActiveSource(rawBlobUrl);
      }
    };
    const onEnterPiP = () => setIsPiPActive(true);
    const onLeavePiP = () => setIsPiPActive(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("error", onError);
    video.addEventListener("enterpictureinpicture", onEnterPiP);
    video.addEventListener("leavepictureinpicture", onLeavePiP);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onError);
      video.removeEventListener("enterpictureinpicture", onEnterPiP);
      video.removeEventListener("leavepictureinpicture", onLeavePiP);
    };
  }, [activeSource, rawBlobUrl]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic Ambient Cinema Lighting Glow */}
      {isAmbientGlow && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[450px] sm:h-[650px] rounded-full pointer-events-none transition-all duration-700 blur-[130px] opacity-25 ${
            isPlaying ? "bg-accent scale-105" : "bg-accent/40 scale-95"
          }`}
          aria-hidden="true"
        />
      )}

      <div className="w-full max-w-5xl space-y-4 relative z-10">
        {/* Top Bar Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/50 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-mono tracking-widest text-chrome hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>RETURN HOME</span>
            </Link>
            <span className="text-border-subtle">|</span>
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold">
              CINEMA ATELIER SUITE
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Lighting Toggle */}
            <button
              type="button"
              onClick={() => setIsAmbientGlow((prev) => !prev)}
              className={`px-2.5 py-1 text-[9px] font-mono border transition-all cursor-pointer ${
                isAmbientGlow
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border-subtle text-chrome hover:text-text-primary"
              }`}
              title="Toggle Ambient Halo Lighting"
            >
              AMPLIGHT: {isAmbientGlow ? "ON" : "OFF"}
            </button>

            {/* Keyboard Hotkeys Guide Trigger */}
            <button
              type="button"
              onClick={() => setShowHotkeysModal(true)}
              className="px-2.5 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
              title="View Keyboard Hotkeys (?)"
            >
              HOTKEYS ⌨
            </button>

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-[10px] font-mono text-chrome tracking-wider uppercase hidden sm:inline">
              1080P BLOB READY
            </span>
          </div>
        </div>

        {/* Video Player Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black border border-accent/40 shadow-[0_0_50px_rgba(212,163,89,0.25)] overflow-hidden flex flex-col group"
        >
          <video
            ref={videoRef}
            src={activeSource}
            playsInline
            controls
            preload="metadata"
            className="w-full h-full object-contain cursor-pointer flex-1"
          />

          {/* Big Center Play Trigger (if paused and no error) */}
          {!isPlaying && !hasError && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer pointer-events-none"
            >
              <div className="w-20 h-20 rounded-full border-2 border-accent bg-bg-surface/80 flex items-center justify-center shadow-[0_0_30px_rgba(212,163,89,0.5)] group-hover:scale-105 transition-transform pointer-events-auto">
                <span className="text-accent text-2xl font-bold ml-1">▶</span>
              </div>
            </div>
          )}

          {/* Fallback Error Overlay */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 text-center z-20">
              <p className="text-accent font-bold font-mono text-sm uppercase mb-2">
                NETWORK BUFFERING DETECTED
              </p>
              <p className="text-chrome text-xs max-w-md mb-4 font-mono">
                Click below to switch between the direct Vercel Blob URL and the local streaming proxy.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSource(rawBlobUrl);
                    setHasError(false);
                    videoRef.current?.load();
                  }}
                  className="px-4 py-2 bg-accent text-bg-primary font-bold text-xs uppercase cursor-pointer"
                >
                  TRY DIRECT BLOB URL
                </button>
                <a
                  href={rawBlobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-bg-primary font-bold text-xs uppercase cursor-pointer"
                >
                  OPEN RAW IN NEW TAB ↗
                </a>
              </div>
            </div>
          )}

          {/* Interactive Progress Bar */}
          <div
            onClick={handleProgressBarClick}
            className="relative w-full h-2 bg-bg-primary border-t border-b border-border-subtle/40 hover:h-3 transition-all cursor-pointer group/progress"
            title="Click to seek"
          >
            <div
              className="h-full bg-accent transition-all duration-100 ease-linear relative"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Master Controls Bar */}
          <div className="px-4 py-3 bg-bg-surface/95 border-t border-border-subtle/50 flex flex-wrap items-center justify-between gap-3 select-none">
            {/* Play, Skip, Mute, Volume */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="px-3.5 py-1.5 bg-accent text-bg-primary font-bold text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                {isPlaying ? "PAUSE ❚❚" : "PLAY ▶"}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(-10)}
                className="px-2 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                title="Rewind 10s (← / J)"
              >
                -10s
              </button>

              <button
                type="button"
                onClick={() => handleSeek(10)}
                className="px-2 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                title="Forward 10s (→ / L)"
              >
                +10s
              </button>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-1.5 ml-1 border-l border-border-subtle/50 pl-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-2 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                  title="Toggle Mute (M)"
                >
                  {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-14 sm:w-20 accent-accent h-1 bg-border-subtle cursor-pointer"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
                <span className="text-[9px] font-mono text-chrome/60 w-7">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              <span className="text-[10px] font-mono text-chrome/80 tracking-wider ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Speed, PiP, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Playback Speed Selector */}
              <div className="flex items-center gap-1 bg-bg-primary/80 border border-border-subtle/60 p-0.5">
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handlePlaybackRate(rate)}
                    className={`px-1.5 py-0.5 text-[8.5px] font-mono transition-colors cursor-pointer ${
                      playbackRate === rate
                        ? "bg-accent text-bg-primary font-bold"
                        : "text-chrome hover:text-accent"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Picture-in-Picture */}
              <button
                type="button"
                onClick={togglePiP}
                className={`px-2.5 py-1 text-[9px] font-mono border transition-all cursor-pointer ${
                  isPiPActive
                    ? "border-accent text-accent bg-accent/15"
                    : "border-border-subtle hover:border-accent text-chrome hover:text-accent"
                }`}
                title="Picture-in-Picture Floating Mode (P)"
              >
                PiP ⧉
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={triggerFullscreen}
                className="px-3.5 py-1.5 bg-accent/20 hover:bg-accent border border-accent text-accent hover:text-bg-primary text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,163,89,0.3)] cursor-pointer"
                title="Toggle Fullscreen (F)"
              >
                FULLSCREEN ⛶
              </button>
            </div>
          </div>
        </div>

        {/* Video Telemetry & Stream Switcher */}
        <div className="p-4 bg-bg-surface/50 border border-border-subtle/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <p className="text-accent font-bold tracking-wider uppercase">
              SOLO LEVELING S02E01 [HINDI] 1080P FHD
            </p>
            <p className="text-chrome/70 text-[10px] truncate max-w-xl">
              Active Source: {activeSource}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextSrc = activeSource === "/api/video" ? rawBlobUrl : "/api/video";
                setActiveSource(nextSrc);
                videoRef.current?.load();
              }}
              className="px-3 py-1.5 border border-accent/50 text-accent hover:bg-accent hover:text-bg-primary transition-colors uppercase text-[10px] cursor-pointer"
            >
              SWITCH TO {activeSource === "/api/video" ? "DIRECT BLOB" : "PROXY STREAM"}
            </button>
            <a
              href={rawBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 border border-chrome/30 text-chrome hover:text-accent hover:border-accent transition-colors uppercase text-[10px]"
            >
              OPEN RAW BLOB ↗
            </a>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showHotkeysModal && (
        <div
          role="dialog"
          aria-label="Keyboard Shortcuts"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowHotkeysModal(false)}
        >
          <div
            className="w-full max-w-md bg-bg-surface border border-accent/40 p-6 shadow-[0_0_40px_rgba(212,163,89,0.3)] space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-accent font-bold tracking-widest uppercase">
                KEYBOARD COMMANDS
              </span>
              <button
                type="button"
                onClick={() => setShowHotkeysModal(false)}
                className="text-chrome hover:text-accent font-bold cursor-pointer"
                aria-label="Close keyboard shortcuts dialog"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-chrome/90">
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Play / Pause</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">Space</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Fullscreen Toggle</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">F</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Mute / Unmute</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">M</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Picture-in-Picture</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">P</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Forward 10 Seconds</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">→ or L</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/30">
                <span>Rewind 10 Seconds</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">← or J</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Volume Adjust</span>
                <kbd className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-accent font-bold">↑ / ↓</kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHotkeysModal(false)}
              className="w-full py-2 bg-accent text-bg-primary font-bold uppercase tracking-wider text-center cursor-pointer hover:bg-white transition-colors"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
