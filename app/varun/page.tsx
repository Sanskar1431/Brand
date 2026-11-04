"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function VarunVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
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
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
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

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onError);
    };
  }, [activeSource, rawBlobUrl]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl space-y-4">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-mono tracking-widest text-chrome hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>RETURN HOME</span>
            </Link>
            <span className="text-border-subtle">|</span>
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
              DIRECT VIDEO STREAM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-chrome tracking-wider uppercase">
              1080P FHD BLOB READY
            </span>
          </div>
        </div>

        {/* Video Player Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black border border-accent/40 shadow-[0_0_50px_rgba(212,163,89,0.2)] overflow-hidden flex flex-col group"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center z-20">
              <p className="text-accent font-bold font-mono text-sm uppercase mb-2">
                STREAM BUFFERS OR NETWORK BLOCKED
              </p>
              <p className="text-chrome text-xs max-w-md mb-4 font-mono">
                Click below to switch stream source or open directly in your device media player.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSource(rawBlobUrl);
                    setHasError(false);
                    videoRef.current?.load();
                  }}
                  className="px-4 py-2 bg-accent text-bg-primary font-bold text-xs uppercase"
                >
                  TRY DIRECT BLOB URL
                </button>
                <a
                  href={rawBlobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-bg-primary font-bold text-xs uppercase"
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

          {/* Controls Bar */}
          <div className="px-4 py-3 bg-bg-surface/95 border-t border-border-subtle/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="px-4 py-1.5 bg-accent text-bg-primary font-bold text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                {isPlaying ? "PAUSE ❚❚" : "PLAY ▶"}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(-10)}
                className="px-2.5 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
              >
                -10s
              </button>

              <button
                type="button"
                onClick={() => handleSeek(10)}
                className="px-2.5 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
              >
                +10s
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="px-3 py-1 text-[9px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
              >
                {isMuted ? "UNMUTE 🔇" : "MUTE 🔊"}
              </button>

              <span className="text-[10px] font-mono text-chrome/80 tracking-wider ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerFullscreen}
                className="px-4 py-1.5 bg-accent/20 hover:bg-accent border border-accent text-accent hover:text-bg-primary text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,163,89,0.3)] cursor-pointer"
              >
                FULLSCREEN (iOS) ⛶
              </button>
            </div>
          </div>
        </div>

        {/* Video Info Card */}
        <div className="p-4 bg-bg-surface/50 border border-border-subtle/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <p className="text-accent font-bold tracking-wider uppercase">
              SOLO LEVELING S02E01 [HINDI] 1080P FHD
            </p>
            <p className="text-chrome/70 text-[10px] truncate max-w-xl">
              Active Stream: {activeSource}
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
              className="px-3 py-1.5 border border-accent/50 text-accent hover:bg-accent hover:text-bg-primary transition-colors uppercase text-[10px]"
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
    </div>
  );
}
