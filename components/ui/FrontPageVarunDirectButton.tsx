"use client";

import { useState } from "react";
import VarunVideoModal from "./VarunVideoModal";

export default function FrontPageVarunDirectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Direct Front Page Hero Centered Action Pill (Immediately Visible Above the Fold) */}
      <div className="absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-6 py-2.5 bg-accent text-bg-primary hover:bg-white hover:text-bg-primary transition-all duration-300 font-display font-bold text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(212,163,89,0.5)] cursor-pointer outline-none focus:ring-2 focus:ring-accent"
          aria-label="Direct play Varun video"
        >
          <span className="w-2 h-2 rounded-full bg-bg-primary animate-pulse" />
          <span>VARUN</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-primary/20 text-bg-primary">
            PLAY VIDEO ▶
          </span>
        </button>
      </div>

      {/* 2. Direct Front Page Floating Quick Trigger (Persistent Across Front Page) */}
      <aside
        aria-label="Varun Video Player Trigger"
        className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 bg-bg-surface/95 hover:bg-accent border-2 border-accent text-accent hover:text-bg-primary backdrop-blur-md shadow-[0_0_25px_rgba(212,163,89,0.35)] hover:shadow-[0_0_35px_rgba(212,163,89,0.6)] transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-accent"
          title="Direct Front Page Video - Click to Play"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent group-hover:bg-bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent group-hover:bg-bg-primary"></span>
          </span>
          <span className="font-display font-bold tracking-[0.25em] text-xs sm:text-sm uppercase">
            VARUN
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-accent/20 group-hover:bg-bg-primary/20 text-accent group-hover:text-bg-primary border border-accent/40 font-bold">
            PLAY ▶
          </span>
        </button>
      </aside>

      {/* Video Modal with Solo Leveling Blob Stream & iOS Fullscreen */}
      <VarunVideoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
