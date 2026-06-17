"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { products as allProducts } from "@/lib/products/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SignatureProducts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const { isReducedMode } = useDeviceCapability();

  // Retrieve our signature t-shirt and jogger
  const sigTee = allProducts.find((p) => p.category === "tshirt" && p.isSignature) || allProducts[0];
  const sigJogger = allProducts.find((p) => p.category === "jogger" && p.isSignature) || allProducts[50];

  useEffect(() => {
    if (isReducedMode) return;

    // SCENE 4: Signature Pinned Reveals (Section 5.5)
    // Pin Section 1 (Tee)
    const pin1 = ScrollTrigger.create({
      trigger: section1Ref.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 1,
      animation: gsap.timeline()
        // Image scales in and rotates slightly (rotateY faked with transform)
        .fromTo(
          ".sig-img-1",
          { opacity: 0, scale: 0.85, rotationY: 3 },
          { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "power2.out" }
        )
        // Copy stagger reveal
        .fromTo(
          ".sig-copy-1 > *",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" },
          0.3
        )
        // Micro-detail annotations reveal on slight delay (Section 5.5)
        .fromTo(
          ".sig-annotation-1",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.7)" },
          0.8
        ),
    });

    // Pin Section 2 (Jogger)
    const pin2 = ScrollTrigger.create({
      trigger: section2Ref.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 1,
      animation: gsap.timeline()
        .fromTo(
          ".sig-img-2",
          { opacity: 0, scale: 0.85, rotationY: -3 },
          { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "power2.out" }
        )
        .fromTo(
          ".sig-copy-2 > *",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" },
          0.3
        )
        .fromTo(
          ".sig-annotation-2",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.7)" },
          0.8
        ),
    });

    return () => {
      pin1.kill();
      pin2.kill();
    };
  }, [isReducedMode, sigTee, sigJogger]);

  // Render a clean static document flow layout for Reduced Experience Mode
  if (isReducedMode) {
    return (
      <section className="bg-bg-surface py-24 px-6 md:px-12 space-y-32">
        <div className="max-w-[1600px] mx-auto text-center mb-10">
          <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase">
            CHAPTER III
          </span>
          <h2 className="font-display text-2xl md:text-4xl tracking-wider uppercase mt-2">
            SIGNATURE PIECES
          </h2>
        </div>

        {/* Tee item */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[3/4] bg-bg-primary flex items-center justify-center border border-border-subtle">
            <span className="text-lg font-bold text-chrome uppercase">SIGNATURE TEE</span>
          </div>
          <div className="space-y-6">
            <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase">
              01 // THE SHIRT
            </span>
            <h3 className="font-display text-3xl tracking-wider uppercase font-semibold">
              {sigTee.name}
            </h3>
            <p className="text-chrome text-base leading-relaxed">{sigTee.description}</p>
            <p className="text-sm text-chrome/60 uppercase tracking-widest font-mono">
              Fabric: {sigTee.fabric}
            </p>
            <Link
              href={`/product/${sigTee.slug}`}
              className="inline-block bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Jogger item */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase">
              02 // THE JOGGER
            </span>
            <h3 className="font-display text-3xl tracking-wider uppercase font-semibold">
              {sigJogger.name}
            </h3>
            <p className="text-chrome text-base leading-relaxed">{sigJogger.description}</p>
            <p className="text-sm text-chrome/60 uppercase tracking-widest font-mono">
              Fabric: {sigJogger.fabric}
            </p>
            <Link
              href={`/product/${sigJogger.slug}`}
              className="inline-block bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
          <div className="aspect-[3/4] bg-bg-primary flex items-center justify-center border border-border-subtle order-1 md:order-2">
            <span className="text-lg font-bold text-chrome uppercase">SIGNATURE JOGGER</span>
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll Mode
  return (
    <div ref={containerRef} className="relative w-full z-20">
      {/* 01: SIGNATURE TEE */}
      <section
        ref={section1Ref}
        className="relative w-full h-screen bg-bg-surface overflow-hidden flex items-center justify-center"
      >
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-10 items-center h-full">
          {/* Spotlight Pedestal Image Area (65% width equivalent) */}
          <div className="md:col-span-6 h-[50vh] md:h-[75vh] relative flex items-center justify-center">
            {/* Spotlight Gradient Behind Pedestal (Section 5.5) */}
            <div className="absolute w-[450px] h-[450px] bg-accent/20 rounded-full blur-[100px] z-0" />
            
            {/* Pedestal Shadow/Glow Base */}
            <div className="absolute bottom-[10%] w-[60%] h-[40px] bg-black/80 rounded-full blur-md z-0 border-t border-chrome/10" />

            {/* Main Product Frame */}
            <div className="sig-img-1 w-[75%] h-[80%] bg-gradient-to-tr from-bg-elevated via-bg-primary to-bg-elevated border border-border-subtle/30 z-10 flex items-center justify-center relative shadow-2xl">
              <h3 className="font-display text-4xl tracking-[0.3em] font-bold text-chrome/10 uppercase">
                {sigTee.name.split(" ")[0]}
              </h3>

              {/* Annotation labels (Section 5.5 spec callouts) */}
              <div className="sig-annotation-1 absolute top-[25%] left-[10%] bg-bg-surface/90 border border-border-subtle/80 px-3 py-2 text-[10px] tracking-wider text-chrome font-bold uppercase shadow-md hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                280GSM HEAVYWEIGHT COTTON
              </div>

              <div className="sig-annotation-1 absolute bottom-[35%] right-[10%] bg-bg-surface/90 border border-border-subtle/80 px-3 py-2 text-[10px] tracking-wider text-chrome font-bold uppercase shadow-md hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                DOUBLE-NEEDLE STITCH COLLAR
              </div>
            </div>
          </div>

          {/* Copy Area (35% width equivalent) */}
          <div className="md:col-span-4 pl-0 md:pl-10 text-left sig-copy-1 z-20">
            <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block mb-2">
              SIGNATURE 01
            </span>
            <h2 className="font-display text-3xl md:text-5xl tracking-wide text-text-primary uppercase leading-tight font-semibold">
              {sigTee.name}
            </h2>
            <p className="text-chrome text-sm mt-6 leading-relaxed font-sans">
              {sigTee.description}
            </p>
            <div className="mt-8">
              <Link
                href={`/product/${sigTee.slug}`}
                className="bg-white text-black hover:bg-accent hover:text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                SHOP THE LAUNCH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02: SIGNATURE JOGGER */}
      <section
        ref={section2Ref}
        className="relative w-full h-screen bg-bg-surface overflow-hidden flex items-center justify-center border-t border-border-subtle/20"
      >
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-10 items-center h-full">
          {/* Copy Area (35% width equivalent) */}
          <div className="md:col-span-4 pr-0 md:pr-10 text-left sig-copy-2 order-2 md:order-1 z-20">
            <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block mb-2">
              SIGNATURE 02
            </span>
            <h2 className="font-display text-3xl md:text-5xl tracking-wide text-text-primary uppercase leading-tight font-semibold">
              {sigJogger.name}
            </h2>
            <p className="text-chrome text-sm mt-6 leading-relaxed font-sans">
              {sigJogger.description}
            </p>
            <div className="mt-8">
              <Link
                href={`/product/${sigJogger.slug}`}
                className="bg-white text-black hover:bg-accent hover:text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                SHOP THE LAUNCH
              </Link>
            </div>
          </div>

          {/* Spotlight Pedestal Image Area (65% width equivalent) */}
          <div className="md:col-span-6 h-[50vh] md:h-[75vh] relative flex items-center justify-center order-1 md:order-2">
            {/* Spotlight Gradient Behind Pedestal */}
            <div className="absolute w-[450px] h-[450px] bg-purple-900/10 rounded-full blur-[100px] z-0" />

            {/* Pedestal Shadow/Glow Base */}
            <div className="absolute bottom-[10%] w-[60%] h-[40px] bg-black/80 rounded-full blur-md z-0 border-t border-chrome/10" />

            {/* Main Product Frame */}
            <div className="sig-img-2 w-[75%] h-[80%] bg-gradient-to-br from-bg-elevated via-bg-primary to-bg-elevated border border-border-subtle/30 z-10 flex items-center justify-center relative shadow-2xl">
              <h3 className="font-display text-4xl tracking-[0.3em] font-bold text-chrome/10 uppercase">
                {sigJogger.name.split(" ")[0]}
              </h3>

              {/* Annotation labels (Section 5.5 spec callouts) */}
              <div className="sig-annotation-2 absolute top-[30%] right-[10%] bg-bg-surface/90 border border-border-subtle/80 px-3 py-2 text-[10px] tracking-wider text-chrome font-bold uppercase shadow-md hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                METAL-TIPPED DRAWCORDS
              </div>

              <div className="sig-annotation-2 absolute bottom-[25%] left-[10%] bg-bg-surface/90 border border-border-subtle/80 px-3 py-2 text-[10px] tracking-wider text-chrome font-bold uppercase shadow-md hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                HIDDEN SIDE-ZIP POCKETS
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
