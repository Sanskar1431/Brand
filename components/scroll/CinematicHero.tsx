"use client";

import { useEffect, useRef, useState } from "react";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import ParticleField from "../canvas/ParticleField";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { isReducedMode, particleCount } = useDeviceCapability();
  const [convergence, setConvergence] = useState(0);
  const [particleOpacity, setParticleOpacity] = useState(0);

  useEffect(() => {
    if (isReducedMode) return;

    // Timeline 1: On-load entrance animation (Section 5.1)
    const tl = gsap.timeline({
      onUpdate: () => {
        // Map timeline progress to convergence
        // We want particle convergence to lerp up during the timeline
        const progress = tl.progress();
        if (progress > 0.1 && progress < 0.6) {
          setConvergence((progress - 0.1) / 0.5); // 0 to 1
        } else if (progress >= 0.6) {
          setConvergence(1);
        }
      }
    });

    // Pure black screen (0-200ms) - handled by initial state
    
    // Faint ambient particle field fades in (200-600ms)
    tl.to({}, { duration: 0.4 }, 0.2); // dummy target for timing
    tl.call(() => setParticleOpacity(0.4), [], 0.2);

    // Particles converge to center (600-1400ms)
    tl.to({}, { duration: 0.8 }, 0.6);

    // Logo wordmark scales & fades in (1400-2200ms)
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      1.4
    );

    // ScrollTrigger: Linking scroll to particle dispersion & headline reveal (Section 5.2)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=150%", // Pinned for 150vh
      pin: true,
      scrub: 1,
      animation: gsap.timeline()
        .fromTo(logoRef.current, { opacity: 1, scale: 1, y: 0 }, { opacity: 0, scale: 0.95, y: -50, duration: 1 })
        .call(() => {
          // As we scroll, fade particles slightly to background
          setParticleOpacity(0.2);
        }, [], 0.5)
        // Word-by-word headline reveal (Section 5.2)
        .fromTo(
          ".headline-word",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.12, ease: "power2.out" },
          0.8
        )
        // Subheadline reveal starts at 70% of headline
        .fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          1.2
        )
        // CTA buttons reveal last, staggered
        .fromTo(
          ".hero-cta-btn",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" },
          1.5
        ),
      onUpdate: (self) => {
        // If user scrolls back up, snap particles back to logo
        if (self.progress === 0) {
          setConvergence(1);
          setParticleOpacity(0.4);
        } else {
          // Fade convergence as we scroll into the headline
          setConvergence(1 - self.progress);
        }
      }
    });

    return () => {
      tl.kill();
      trigger.kill();
    };
  }, [isReducedMode]);

  // Reduced Experience Mode Fallback (Section 5.9)
  if (isReducedMode) {
    return (
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-bg-primary text-center">
        {/* Simple fade-in static content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-12"
        >
          <h1 className="font-display text-4xl sm:text-6xl tracking-[0.25em] font-semibold text-text-primary uppercase">
            PRINCE
          </h1>
          <p className="font-display text-2xl sm:text-4xl tracking-[0.1em] text-accent font-medium uppercase mt-4">
            RULE WITHOUT SPEAKING
          </p>
          <p className="text-chrome/85 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mt-6">
            Fine cinematic luxury streetwear designed with heavyweight structures, raw edges, and architectural discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-accent text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors"
            >
              EXPLORE COLLECTION
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto border border-chrome/30 text-chrome hover:text-text-primary hover:border-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all"
            >
              OUR PHILOSOPHY
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  // Full Cinematic Experience
  return (
    <div ref={containerRef} className="relative w-full h-screen bg-bg-primary overflow-hidden">
      {/* 3D Particle Field Canvas */}
      <ParticleField count={particleCount} convergence={convergence} opacity={particleOpacity} />

      {/* Scene 0: Pinned Logo Emergence Container */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 opacity-0"
      >
        <h1 className="font-display text-6xl md:text-8xl tracking-[0.35em] font-semibold uppercase text-text-primary">
          PRINCE
        </h1>
        <p className="text-chrome/50 tracking-[0.4em] uppercase text-xs mt-4 font-sans font-bold">
          RULE WITHOUT SPEAKING
        </p>
      </div>

      {/* Scene 1: Headline & Subheadline Reveal Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center select-none">
        <h2
          ref={headlineRef}
          className="font-display text-4xl md:text-7xl tracking-[0.2em] font-semibold uppercase text-text-primary max-w-5xl leading-tight"
        >
          {"RULE WITHOUT SPEAKING".split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block mr-4 md:mr-6 overflow-hidden">
              <span className="headline-word inline-block origin-bottom-left">
                {word}
              </span>
            </span>
          ))}
        </h2>

        <div ref={subheadlineRef} className="mt-8 opacity-0">
          <p className="text-chrome text-lg md:text-xl max-w-xl mx-auto font-sans leading-relaxed">
            Minimalist streetwear built with heavyweight materials and architectural geometry.
          </p>
        </div>

        <div ref={ctaRef} className="flex gap-4 mt-12 opacity-0">
          <Link
            href="/shop"
            className="hero-cta-btn bg-accent text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 cursor-pointer"
          >
            ENTER THE SHOP
          </Link>
          <Link
            href="/about"
            className="hero-cta-btn border border-chrome/30 text-chrome hover:text-text-primary hover:border-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            THE BRAND STORY
          </Link>
        </div>
      </div>
    </div>
  );
}
