"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  const wordStaggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full bg-bg-primary text-text-primary select-none">
      
      {/* Section 1: Intro Hero */}
      <section className="relative w-full h-screen flex flex-col justify-center px-6 md:px-12 bg-gradient-to-b from-bg-primary via-bg-surface to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-xs text-accent tracking-[0.3em] font-bold uppercase block"
          >
            THE BRAND STORY
          </motion.span>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="font-display text-4xl sm:text-7xl tracking-wider uppercase leading-tight font-semibold"
          >
            ARCHITECTURAL STRENGTH, UNCOMMONLY SILENT.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-chrome/80 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed font-sans"
          >
            PRINCE is a luxury design experiment founded on the rejection of loud branding. We construct garments with heavy drapes, rigid silhouettes, and detailed seam metrics.
          </motion.p>
        </div>
      </section>

      {/* Section 2: Magazine Feature Style Section 1 */}
      <section className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center border-t border-border-subtle/20 bg-bg-primary">
        <div className="p-12 md:p-24 space-y-6 text-left">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block">
            THE ANATOMY OF STRUCTURE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl tracking-wide uppercase font-semibold leading-tight">
            HEAVYWEIGHT DENSIFYING COTTON
          </h2>
          <p className="text-chrome text-sm leading-relaxed font-sans">
            Every garment begins with our custom knit combs. We specify 280GSM for t-shirts and 450GSM for French terry hoodies. This density yields a rigid, architectural drape that retains its integrity indefinitely.
          </p>
          <p className="text-chrome/60 text-xs uppercase tracking-widest font-mono">
            Metric: 2x Twist Comb / Pre-shrunk weave integrity
          </p>
        </div>
        
        {/* Parallax Image Placeholder */}
        <div className="w-full h-full min-h-[50vh] bg-gradient-to-tr from-bg-elevated to-bg-primary flex items-center justify-center border-l border-border-subtle/20 p-12">
          <div className="w-[80%] aspect-[3/4] bg-bg-surface border border-border-subtle relative flex items-center justify-center">
            <span className="text-xs text-chrome/30 uppercase tracking-widest font-mono">WEAVE DETAILS // MACRO</span>
          </div>
        </div>
      </section>

      {/* Section 3: The Philosophy Quote Highlight (Section 7.3.1 Typography moment) */}
      <section className="relative w-full h-screen bg-bg-primary flex flex-col justify-center items-center px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={wordStaggerContainer}
          className="max-w-4xl text-center space-y-6"
        >
          <span className="text-[10px] text-accent tracking-[0.3em] font-bold uppercase block">
            THE CORE DOCTRINE
          </span>
          <h2 className="font-display text-4xl sm:text-6xl tracking-[0.2em] font-semibold text-text-primary uppercase leading-tight">
            {"LUXURY ISN'T A LOGO. LUXURY IS PRESENCE.".split(" ").map((word, idx) => (
              <span key={idx} className="inline-block mr-4 overflow-hidden">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            variants={textVariants}
            className="text-chrome/50 text-xs tracking-[0.2em] uppercase mt-6 font-semibold"
          >
            RULE WITHOUT SPEAKING
          </motion.p>
        </motion.div>
      </section>

      {/* Section 4: Magazine Feature Style Section 2 */}
      <section className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center border-t border-border-subtle/20 bg-bg-surface">
        {/* Parallax Image Placeholder */}
        <div className="w-full h-full min-h-[50vh] bg-gradient-to-br from-bg-elevated to-bg-primary flex items-center justify-center border-r border-border-subtle/20 p-12 order-2 lg:order-1">
          <div className="w-[80%] aspect-[3/4] bg-bg-primary border border-border-subtle relative flex items-center justify-center">
            <span className="text-xs text-chrome/30 uppercase tracking-widest font-mono">SILHOUETTE PROFILE // ARCHITECTURE</span>
          </div>
        </div>

        <div className="p-12 md:p-24 space-y-6 text-left order-1 lg:order-2">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block">
            THE ANATOMY OF CUT
          </span>
          <h2 className="font-display text-3xl sm:text-5xl tracking-wide uppercase font-semibold leading-tight">
            GEOMETRIC DROPPED SEAMS
          </h2>
          <p className="text-chrome text-sm leading-relaxed font-sans">
            We drop shoulder axes by exactly 4.5 inches on our oversized tees to create a boxy, squared frame without adding bulk to the torso. Side seams are double-stitched flat to keep profile lines clean and straight.
          </p>
          <p className="text-chrome/60 text-xs uppercase tracking-widest font-mono">
            Metric: Dropped seam axis / 3D block sizing
          </p>
        </div>
      </section>
      
    </div>
  );
}
