"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/store/toastStore";

interface VarunVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVideoUrl?: string;
}

export default function VarunVideoModal({
  isOpen,
  onClose,
  defaultVideoUrl = "https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4",
}: VarunVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [inputUrl, setInputUrl] = useState("");
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPiPActive, setIsPiPActive] = useState(false);

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
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
      console.warn("PiP error:", err);
    }
  };

  // Detect iOS Safari / WebKit and load stored blob URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsIOSDevice(isIOS);

      const savedBlob = localStorage.getItem("prince_varun_blob_video_url");
      if (savedBlob) {
        setVideoUrl(savedBlob);
        setInputUrl(savedBlob);
      } else if (process.env.NEXT_PUBLIC_VARUN_VIDEO_URL) {
        setVideoUrl(process.env.NEXT_PUBLIC_VARUN_VIDEO_URL);
        setInputUrl(process.env.NEXT_PUBLIC_VARUN_VIDEO_URL);
      } else {
        setVideoUrl("https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4");
        setInputUrl("https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4");
      }
    }
  }, [defaultVideoUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-play on modal open
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay policy might require mute
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen, videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  /**
   * Robust Fullscreen Engine with complete iOS Safari webkitEnterFullscreen support!
   * On iPhone / iPad, HTMLVideoElement.webkitEnterFullscreen() opens native iOS full screen.
   */
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Direct iOS Safari Fullscreen API
    if (typeof (video as any).webkitEnterFullscreen === "function") {
      try {
        (video as any).webkitEnterFullscreen();
        addToast("LAUNCHING NATIVE iOS FULLSCREEN", "success");
        return;
      } catch (err) {
        console.warn("webkitEnterFullscreen failed, falling back to container fullscreen", err);
      }
    }

    // 2. Standard HTML5 Fullscreen API
    const elem = containerRef.current || video;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
        setIsFullscreen(true);
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
        setIsFullscreen(true);
      } else {
        // Fallback: Maximize container to full viewport
        setIsMaximized(true);
        addToast("EXPANDED TO FULL VIEWPORT", "info");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleSaveBlobUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      addToast("PLEASE ENTER A VALID BLOB VIDEO URL", "error");
      return;
    }
    setVideoUrl(trimmed);
    localStorage.setItem("prince_varun_blob_video_url", trimmed);
    setIsEditingUrl(false);
    addToast("BLOB VIDEO URL ATTACHED & SAVED", "success");
  };

  const handleSeek = (offsetSec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + offsetSec));
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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
        >
          {/* Main Player Box */}
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-4xl bg-bg-surface border border-accent/40 shadow-2xl flex flex-col overflow-hidden ${
              isMaximized ? "!fixed !inset-0 !max-w-none !h-full !rounded-none z-[110]" : "rounded-none"
            }`}
          >
            {/* Header Control Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-bg-primary/95 border-b border-border-subtle/50 text-left">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-accent uppercase">
                  VARUN // ARCHIVE CINEMATIC
                </span>
                {isIOSDevice && (
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 tracking-wider uppercase">
                    iOS READY
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className="px-2.5 py-1 text-[8.5px] font-mono text-chrome hover:text-accent border border-border-subtle hover:border-accent uppercase tracking-wider transition-colors cursor-pointer"
                  title="Configure Blob Storage URL"
                >
                  {isEditingUrl ? "HIDE BLOB URL" : "BLOB SOURCE URL"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center text-chrome hover:text-text-primary text-xs font-mono uppercase border border-border-subtle hover:border-accent transition-colors cursor-pointer"
                  aria-label="Close Varun Video"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Expandable Blob URL Config Drawer */}
            <AnimatePresence>
              {isEditingUrl && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-bg-primary/90 border-b border-accent/30 p-3 text-left"
                >
                  <form onSubmit={handleSaveBlobUrl} className="space-y-2">
                    <label className="text-[8.5px] font-mono text-chrome tracking-widest uppercase block">
                      UPLOADED BLOB VIDEO URL (e.g. Vercel Blob / S3 / Cloudflare)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://...public.blob.vercel-storage.com/varun.mp4"
                        className="flex-1 bg-bg-surface border border-border-subtle focus:border-accent p-2 text-xs font-mono text-text-primary outline-none focus:ring-1 focus:ring-accent/30"
                      />
                      <button
                        type="submit"
                        className="bg-accent hover:bg-accent-hover text-bg-primary px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer"
                      >
                        ATTACH BLOB URL ↗
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Stage */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
              <video
                ref={videoRef}
                src={videoUrl}
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                controls
                preload="metadata"
                onError={() => {
                  if (videoUrl === "/api/video") {
                    setVideoUrl("https://knlayhbwsv3ccvs3.public.blob.vercel-storage.com/Solo%20Leveling%20S02E01%20%5BHindi%5D_1080P%20FHD.mp4");
                  }
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Center Play Overlay Icon when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent pl-1 shadow-lg hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Progress Scrubber Bar */}
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

            {/* Luxury Transport & Fullscreen Controls Bar */}
            <div className="px-4 py-3 bg-bg-primary/95 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
              {/* Play/Pause & Time */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 border border-border-subtle hover:border-accent text-accent transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSeek(-10)}
                  className="px-2 py-1 text-[8px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                  title="Rewind 10 seconds"
                >
                  -10s
                </button>

                <button
                  type="button"
                  onClick={() => handleSeek(10)}
                  className="px-2 py-1 text-[8px] font-mono border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                  title="Forward 10 seconds"
                >
                  +10s
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  )}
                </button>

                <div className="text-[10px] font-mono text-chrome tracking-widest">
                  <span className="text-text-primary font-bold">{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Fullscreen Actions (Including iOS Support) */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Speed selector */}
                <div className="flex items-center gap-0.5 bg-bg-surface border border-border-subtle p-0.5">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handlePlaybackRate(rate)}
                      className={`px-1.5 py-0.5 text-[8px] font-mono transition-colors cursor-pointer ${
                        playbackRate === rate
                          ? "bg-accent text-bg-primary font-bold"
                          : "text-chrome hover:text-accent"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* PiP trigger */}
                <button
                  type="button"
                  onClick={togglePiP}
                  className={`px-2 py-1 text-[8.5px] font-mono border transition-all cursor-pointer ${
                    isPiPActive
                      ? "border-accent text-accent bg-accent/15"
                      : "border-border-subtle hover:border-accent text-chrome hover:text-accent"
                  }`}
                  title="Picture-in-Picture"
                >
                  PiP ⧉
                </button>

                <button
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="px-3 py-1.5 border border-border-subtle hover:border-accent text-chrome hover:text-accent text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isMaximized ? "RESTORE VIEW" : "THEATER VIEW"}
                </button>

                {/* Primary iOS + Cross-Platform Fullscreen Trigger */}
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="px-4 py-1.5 bg-accent text-bg-primary hover:bg-accent-hover text-[9px] font-mono font-bold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center gap-1.5 shadow-md outline-none focus:ring-1 focus:ring-accent"
                  title="Fullscreen mode (Supported on iOS iPhone & iPad)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <span>FULLSCREEN [iOS]</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
