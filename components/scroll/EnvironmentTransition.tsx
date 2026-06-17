"use client";

import { useEffect, useRef } from "react";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EnvironmentTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const { isReducedMode } = useDeviceCapability();

  useEffect(() => {
    if (isReducedMode) return;

    // Apply parallax scroll effect using GSAP (Section 5.3)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Layer 1 (far): Moves slow (0.2x)
    tl.to(layer1Ref.current, { yPercent: -15, ease: "none" }, 0);

    // Layer 2 (mid): Moves mid (0.5x) + subtle rotation
    tl.to(layer2Ref.current, { yPercent: -35, rotation: 3, ease: "none" }, 0);

    // Layer 3 (near): Moves fast (1x)
    tl.to(layer3Ref.current, { yPercent: -60, ease: "none" }, 0);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
    };
  }, [isReducedMode]);

  // Reduced Experience Mode (Section 5.9) - Static, calm background
  if (isReducedMode) {
    return (
      <section className="relative w-full h-[60vh] bg-gradient-to-b from-bg-primary via-bg-surface to-bg-primary flex items-center justify-center border-y border-border-subtle/20">
        <div className="text-center px-6">
          <p className="font-display text-sm tracking-[0.3em] text-accent uppercase mb-2">
            CHAPTER I
          </p>
          <h3 className="font-display text-2xl md:text-3xl tracking-[0.1em] text-text-primary uppercase">
            THE ATMOSPHERE OF PRESENCE
          </h3>
        </div>
      </section>
    );
  }

  // Full Cinematic Mode
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] bg-bg-primary overflow-hidden flex items-center justify-center z-10"
    >
      {/* Layer 1 (Far): Gradient Mesh Background */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 w-full h-[140%] -top-[20%] bg-gradient-to-tr from-bg-primary via-bg-surface to-bg-primary opacity-90 z-0"
      />

      {/* Layer 2 (Mid): Parallax Light Beams */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 w-full h-[140%] -top-[20%] z-10 pointer-events-none flex items-center justify-center"
      >
        {/* Beam 1 */}
        <div
          className="absolute w-[30vw] h-[120vh] bg-gradient-to-b from-accent/15 to-transparent blur-[80px] origin-top"
          style={{
            transform: "rotate(-35deg) translate(-20%, -10%)",
          }}
        />
        {/* Beam 2 */}
        <div
          className="absolute w-[20vw] h-[100vh] bg-gradient-to-b from-chrome/10 to-transparent blur-[60px] origin-top"
          style={{
            transform: "rotate(-25deg) translate(30%, -20%)",
          }}
        />
      </div>

      {/* Content Container (in between layers for deep perspective) */}
      <div className="relative z-20 text-center select-none px-6">
        <span className="font-sans text-xs tracking-[0.3em] text-accent font-bold uppercase block mb-3">
          CHAPTER I
        </span>
        <h3 className="font-display text-3xl md:text-5xl tracking-[0.15em] text-text-primary uppercase leading-snug">
          THE ATMOSPHERE <br /> OF PRESENCE
        </h3>
      </div>

      {/* Layer 3 (Near): Foreground Vignette & Particle Drift */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none z-30 bg-radial-gradient-vignette"
        style={{
          boxShadow: "inset 0 0 100px rgba(10, 10, 10, 0.95)",
        }}
      />
    </section>
  );
}
