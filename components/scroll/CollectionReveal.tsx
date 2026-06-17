"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    id: "tshirt",
    name: "SIGNATURE TEES",
    category: "01 // ARCHIVE",
    description: "Heavyweight combed cotton shirts engineered with dropped shoulder axes, raw edges, and structural drape. Built for presence.",
    fabric: "280GSM - 320GSM ORGANIC COTTON",
    link: "/shop/tshirt",
    btnText: "EXPLORE TEES",
    priceText: "FROM ₹2,500",
    placeholderText: "TEES"
  },
  {
    id: "jogger",
    name: "PREMIUM JOGGERS",
    category: "02 // ARCHIVE",
    description: "Double-knit interlock and French terry fleece sweatpants constructed with hidden YKK zippers and custom metal-tipped drawcords.",
    fabric: "380GSM - 450GSM French Terry",
    link: "/shop/jogger",
    btnText: "EXPLORE JOGGERS",
    priceText: "FROM ₹3,500",
    placeholderText: "JOGGERS"
  }
];

export default function CollectionReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { isReducedMode } = useDeviceCapability();
  
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isReducedMode) return;

    const track = trackRef.current;
    if (!track) return;

    const slides = gsap.utils.toArray(".collection-slide") as HTMLElement[];
    const numSlides = slides.length;
    
    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth;
    };

    // Main scroll trigger for horizontal pin/translation
    const mainTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      scrub: 1,
      snap: 1 / (numSlides - 1),
      animation: gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
      }),
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        const currentActive = Math.round(self.progress * (numSlides - 1));
        setActiveIdx(currentActive);
      },
    });

    // Fade/scale animations on each slide
    slides.forEach((slide) => {
      gsap.fromTo(
        slide,
        { opacity: 0.3, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: slide,
            containerAnimation: mainTrigger.animation,
            start: "left right",
            end: "left left",
            scrub: true,
          },
        }
      );
    });

    return () => {
      mainTrigger.kill();
    };
  }, [isReducedMode]);

  // Arrow controls programmatically scroll viewport (Section 5.4 mitigations)
  const handleArrowNav = (direction: "prev" | "next") => {
    if (isReducedMode) {
      const track = trackRef.current;
      if (track) {
        const slideWidth = track.clientWidth * 0.7; // 70vw
        const scrollAmount = direction === "next" ? slideWidth : -slideWidth;
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
      return;
    }

    const trigger = ScrollTrigger.getAll().find(
      (t) => t.vars.trigger === containerRef.current
    );
    if (!trigger) return;

    const numSlides = categories.length;
    let nextIndex = activeIdx;
    if (direction === "next" && activeIdx < numSlides - 1) {
      nextIndex = activeIdx + 1;
    } else if (direction === "prev" && activeIdx > 0) {
      nextIndex = activeIdx - 1;
    }

    const scrollRange = trigger.end - trigger.start;
    const targetScrollY = trigger.start + (nextIndex / (numSlides - 1)) * scrollRange;
    
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Reduced Experience Mode Fallback:
  // Renders a normal horizontal-scroll carousel with no pinning
  if (isReducedMode) {
    return (
      <section className="relative bg-bg-primary py-24 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto mb-10 flex justify-between items-end">
          <div>
            <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase">
              CHAPTER II
            </span>
            <h2 className="font-display text-2xl md:text-4xl tracking-wider uppercase mt-2">
              CURATED COLLECTION
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleArrowNav("prev")}
              className="p-3 border border-chrome/30 hover:border-accent text-chrome hover:text-text-primary transition-all cursor-pointer"
              aria-label="Previous category"
            >
              ←
            </button>
            <button
              onClick={() => handleArrowNav("next")}
              className="p-3 border border-chrome/30 hover:border-accent text-chrome hover:text-text-primary transition-all cursor-pointer"
              aria-label="Next category"
            >
              →
            </button>
          </div>
        </div>

        {/* Horizontal Swipeable Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="snap-start flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[35vw] border border-border-subtle p-6 bg-bg-surface"
            >
              <div className="aspect-[3/4] bg-bg-elevated relative overflow-hidden mb-4 flex items-center justify-center">
                <span className="text-xl font-bold uppercase text-chrome">{cat.placeholderText}</span>
              </div>
              <h3 className="font-display text-lg tracking-wider uppercase font-semibold text-text-primary">
                {cat.name}
              </h3>
              <p className="text-sm text-chrome mt-1">{cat.fabric}</p>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-subtle/50">
                <span className="font-sans font-bold text-accent">{cat.priceText}</span>
                <Link
                  href={cat.link}
                  className="text-xs uppercase tracking-widest font-bold underline hover:text-accent transition-colors"
                >
                  {cat.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll-jacked Mode
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-bg-primary overflow-hidden z-20 flex flex-col justify-center"
    >
      <div className="absolute top-12 left-6 md:left-12 z-30">
        <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
          CHAPTER II
        </span>
        <h2 className="font-display text-2xl md:text-3xl tracking-widest text-text-primary uppercase">
          CURATED CATEGORIES
        </h2>
      </div>

      {/* Horizontal Flex Track */}
      <div ref={trackRef} className="flex h-[75vh] md:h-[60vh] items-center px-[8vw] md:px-[20vw] gap-[6vw] md:gap-[10vw]">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="collection-slide flex-shrink-0 w-[84vw] md:w-[60vw] h-full flex flex-col md:flex-row gap-4 md:gap-8 items-center bg-bg-surface border border-border-subtle/40 p-5 md:p-8"
          >
            {/* Slide Image Panel (50% width on desktop) */}
            <div className="w-full md:w-[50%] h-[28vh] md:h-full bg-bg-elevated relative overflow-hidden group">
              <div
                className={`w-full h-full bg-gradient-to-tr from-bg-elevated via-bg-primary to-bg-elevated flex items-center justify-center transition-transform duration-10000 ease-linear ${
                  activeIdx === idx ? "scale-105" : "scale-100"
                }`}
              >
                <h3 className="font-display text-4xl tracking-[0.3em] font-bold text-chrome/10 select-none uppercase">
                  {cat.placeholderText}
                </h3>
              </div>
            </div>

            {/* Slide Details Panel (50% width on desktop) */}
            <div className="w-full md:w-[50%] flex flex-col justify-between h-[40vh] md:h-full py-1 md:py-4 text-left">
              <div>
                <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase">
                  {cat.category}
                </span>
                <h3 className="font-display text-2xl md:text-3xl tracking-wider text-text-primary uppercase mt-2 font-semibold">
                  {cat.name}
                </h3>
                <p className="text-chrome text-xs mt-3 leading-relaxed font-sans line-clamp-3">
                  {cat.description}
                </p>
                <p className="text-[11px] text-chrome/50 mt-2 uppercase tracking-widest font-mono">
                  Materials: {cat.fabric}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-border-subtle/50 pt-4 mt-6">
                <span className="font-sans font-bold text-xl tabular-nums text-text-primary">
                  {cat.priceText}
                </span>
                <Link
                  href={cat.link}
                  className="text-xs bg-white text-black hover:bg-accent hover:text-white px-5 py-3 font-bold uppercase tracking-widest transition-colors"
                >
                  {cat.btnText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating navigation controls */}
      <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 z-30 flex items-center justify-between">
        {/* Progress indicator bar */}
        <div className="w-[40%] bg-chrome/10 h-[2px] relative overflow-hidden">
          <div
            className="bg-accent h-full absolute top-0 left-0 transition-transform duration-300 origin-left"
            style={{
              width: "100%",
              transform: `scaleX(${scrollProgress})`,
            }}
          />
        </div>

        {/* Prev / Next buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleArrowNav("prev")}
            disabled={activeIdx === 0}
            className={`p-4 border border-chrome/30 hover:border-accent text-chrome hover:text-text-primary transition-all cursor-pointer ${
              activeIdx === 0 ? "opacity-30 pointer-events-none" : ""
            }`}
            aria-label="Previous category"
          >
            ←
          </button>
          <button
            onClick={() => handleArrowNav("next")}
            disabled={activeIdx === categories.length - 1}
            className={`p-4 border border-chrome/30 hover:border-accent text-chrome hover:text-text-primary transition-all cursor-pointer ${
              activeIdx === categories.length - 1 ? "opacity-30 pointer-events-none" : ""
            }`}
            aria-label="Next category"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
