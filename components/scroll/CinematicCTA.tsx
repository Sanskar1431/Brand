"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import ParticleField from "../canvas/ParticleField";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const { isReducedMode, particleCount } = useDeviceCapability();

  const [convergence, setConvergence] = useState(1);
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    if (isReducedMode) return;

    // ScrollTrigger to drive the logo scaling up and particles streaming outward (Section 5.7)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: true,
      animation: gsap.timeline()
        // Scale the wordmark to fill 70% width of the viewport
        .fromTo(
          textRef.current,
          { scale: 1, opacity: 0.3 },
          { scale: 1.5, opacity: 1, duration: 1, ease: "none" }
        )
        // Reveal CTA button
        .fromTo(
          btnRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.4
        ),
      onUpdate: (self) => {
        // As scroll progresses, let particles disperse and stream outward
        // We do this by decreasing convergence and increasing opacity to show expansion
        setConvergence(1 - self.progress * 1.5); // disperse past 0
        setOpacity(0.5 + self.progress * 0.3);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isReducedMode]);

  // Reduced Experience Mode Fallback (Section 5.9)
  if (isReducedMode) {
    return (
      <section className="bg-bg-primary py-32 px-6 text-center flex flex-col justify-center items-center border-t border-border-subtle/10">
        <div className="max-w-xl space-y-8">
          <h2 className="font-display text-4xl sm:text-5xl tracking-[0.25em] font-semibold text-text-primary uppercase">
            PRINCE
          </h2>
          <p className="text-chrome text-sm uppercase tracking-widest leading-relaxed">
            RULE WITHOUT SPEAKING. ENTER THE SHIELD OF TRUE CRAFTSMANSHIP.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-block bg-white text-black hover:bg-accent hover:text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.25em] transition-colors"
            >
              ENTER THE KINGDOM
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Mode
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-bg-primary overflow-hidden flex flex-col items-center justify-center z-20"
    >
      {/* Background Particle Field Canvas configured for dispersion */}
      <ParticleField count={particleCount} convergence={convergence} opacity={opacity} />

      {/* Massive scaling logo (Section 5.7) */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 text-center"
      >
        <h2 className="font-display text-5xl md:text-8xl tracking-[0.4em] font-semibold uppercase text-text-primary">
          PRINCE
        </h2>
        <span className="text-[10px] tracking-[0.45em] text-chrome/40 uppercase font-bold mt-6">
          RULE WITHOUT SPEAKING
        </span>
      </div>

      {/* Confident single button (Section 5.7) */}
      <div ref={btnRef} className="relative z-20 mt-[35vh] opacity-0">
        <Link
          href="/shop"
          className="bg-accent hover:bg-accent-hover text-white px-12 py-5 text-xs font-bold uppercase tracking-[0.25em] transition-colors shadow-xl shadow-accent/20 cursor-pointer"
        >
          ENTER THE KINGDOM
        </Link>
      </div>
    </div>
  );
}
