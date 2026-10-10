"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  const [selectedFabricIndex, setSelectedFabricIndex] = useState(0);
  const [customGsm, setCustomGsm] = useState(380);

  // Archive Longevity & Micro-Weave Inspector State
  const [activeWeaveIndex, setActiveWeaveIndex] = useState(0);
  const [washTemp, setWashTemp] = useState<"COLD" | "WARM" | "HOT">("COLD");
  const [dryingMethod, setDryingMethod] = useState<"LINE" | "TUMBLE">("LINE");

  const weaveSpecs = [
    {
      name: "240 GSM SINGLE JERSEY",
      yarnCount: "32/1 Combed Ring-Spun",
      threadDensity: "128 x 84 picks/in",
      tensileStrength: "460 Newtons",
      shrinkageRate: "< 0.6% after 40 cycles",
      gaugeType: "28 Gauge Single Knit Circular",
    },
    {
      name: "400 GSM FRENCH TERRY",
      yarnCount: "20/1 + 10/1 Loopback",
      threadDensity: "142 x 98 picks/in",
      tensileStrength: "580 Newtons",
      shrinkageRate: "< 0.4% after 40 cycles",
      gaugeType: "20 Gauge Double Loopback",
    },
    {
      name: "500 GSM LOOPBACK FLEECE",
      yarnCount: "16/1 Heavy Twist Ring-Spun",
      threadDensity: "165 x 110 picks/in",
      tensileStrength: "720 Newtons",
      shrinkageRate: "< 0.2% after 40 cycles",
      gaugeType: "18 Gauge Heavy Armor Knit",
    },
  ];

  const getLifespanMetrics = () => {
    let wears = 360;
    let score = 99;
    if (washTemp === "WARM") { wears -= 80; score -= 18; }
    if (washTemp === "HOT") { wears -= 190; score -= 45; }
    if (dryingMethod === "TUMBLE") { wears -= 70; score -= 16; }
    return { wears, score };
  };

  const fabrics = [
    {
      id: "tee-cotton",
      name: "280 GSM COMBED COTTON",
      category: "SIGNATURE TEES & TOPS",
      density: "280 GSM",
      rigidity: 88,
      breathability: 94,
      durability: 96,
      structure: "2x Twist Ring-Spun Comb with Pre-Shrunk Bio-Polish",
      drapeBehavior: "Architectural boxy drape that hangs off the shoulders without clinging. Holds silhouette cleanly through daily wear.",
      recommendedLink: "/shop/tshirt",
      recommendedLabel: "EXPLORE SIGNATURE TEES →",
    },
    {
      id: "terry-fleece",
      name: "450 GSM FRENCH TERRY",
      category: "PREMIUM JOGGERS & HOODIES",
      density: "450 GSM",
      rigidity: 96,
      breathability: 82,
      durability: 99,
      structure: "High-Density Compact Loopback Interior with Micro-Sueded Face",
      drapeBehavior: "Substantial structural weight creating clean taper folds and unyielding leg silhouette lines. Maximum insulation.",
      recommendedLink: "/shop/jogger",
      recommendedLabel: "EXPLORE PREMIUM JOGGERS →",
    },
    {
      id: "vault-loopback",
      name: "520 GSM LOOPBACK FLEECE",
      category: "VAULT OUTERWEAR ARCHIVES",
      density: "520 GSM",
      rigidity: 100,
      breathability: 74,
      durability: 100,
      structure: "Ultra-Heavyweight Heavy Twill Terry with Reinforced Double Seams",
      drapeBehavior: "Armor-like drape resistant to wind deformation and structural creasing. The pinnacle of silent luxury weight.",
      recommendedLink: "/shop",
      recommendedLabel: "EXPLORE FULL ARCHIVE →",
    },
  ];

  const currentFabric = fabrics[selectedFabricIndex];

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
          <div className="pt-2">
            <Link
              href="/shop/tshirt"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent hover:text-text-primary transition-colors outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded"
            >
              <span>VIEW SIGNATURE TEES</span>
              <span>→</span>
            </Link>
          </div>
        </div>
        
        {/* Parallax Image Placeholder */}
        <div className="w-full h-full min-h-[50vh] bg-gradient-to-tr from-bg-elevated to-bg-primary flex items-center justify-center border-l border-border-subtle/20 p-12">
          <div className="w-[80%] aspect-[3/4] bg-bg-surface border border-border-subtle relative flex items-center justify-center">
            <span className="text-xs text-chrome/30 uppercase tracking-widest font-mono">WEAVE DETAILS // MACRO</span>
          </div>
        </div>
      </section>

      {/* Interactive Material & Craftsmanship Matrix (Section 2.5) */}
      <section className="relative w-full py-24 bg-bg-surface/40 border-t border-border-subtle/20 px-6 md:px-12 text-left">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block">
              TEXTILE ENGINEERING
            </span>
            <h2 className="font-display text-2xl sm:text-4xl tracking-widest uppercase font-semibold text-text-primary">
              MATERIAL SPECIFICATION MATRIX
            </h2>
            <p className="text-chrome text-xs sm:text-sm max-w-2xl uppercase tracking-wider font-mono">
              Select an atelier textile matrix to inspect structural density metrics, drape stiffness ratings, and weave formulations.
            </p>
          </div>

          {/* Fabric Selection Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border-subtle/40 pb-4">
            {fabrics.map((fabric, idx) => (
              <button
                key={fabric.id}
                type="button"
                onClick={() => setSelectedFabricIndex(idx)}
                className={`px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedFabricIndex === idx
                    ? "bg-accent text-white border-accent shadow-md shadow-accent/15"
                    : "bg-bg-surface text-chrome hover:text-accent border-border-subtle hover:border-accent outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                }`}
              >
                {fabric.name}
              </button>
            ))}
          </div>

          {/* Active Fabric Metric Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFabric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-border-subtle bg-bg-primary p-6 md:p-8"
            >
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
                  <div>
                    <span className="text-[9px] text-accent font-mono font-bold uppercase tracking-widest block">
                      {currentFabric.category}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-text-primary mt-0.5">
                      {currentFabric.name}
                    </h3>
                  </div>
                  <span className="text-sm font-mono font-bold text-accent px-3 py-1 bg-accent/10 border border-accent/30">
                    {currentFabric.density}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-chrome/90 leading-relaxed font-sans uppercase">
                  {currentFabric.drapeBehavior}
                </p>

                <div className="space-y-1 bg-bg-surface/50 p-4 border border-border-subtle/40">
                  <span className="text-[9px] text-accent font-mono font-bold uppercase tracking-widest block">
                    WEAVE ARCHITECTURE
                  </span>
                  <p className="text-[11px] font-mono text-chrome uppercase tracking-wider">
                    {currentFabric.structure}
                  </p>
                </div>

                <div>
                  <Link
                    href={currentFabric.recommendedLink}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent hover:text-text-primary transition-colors outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] py-1"
                  >
                    <span>{currentFabric.recommendedLabel}</span>
                  </Link>
                </div>
              </div>

              {/* Performance Gauges */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border-subtle/30 pt-6 lg:pt-0 lg:pl-8">
                <span className="text-[9px] text-accent font-mono font-bold uppercase tracking-widest block mb-2">
                  STRUCTURAL PERFORMANCE METRICS
                </span>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-chrome">
                    <span>Drape Rigidity Index</span>
                    <span className="text-accent font-bold">{currentFabric.rigidity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-subtle/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFabric.rigidity}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-chrome">
                    <span>Tensile Weave Durability</span>
                    <span className="text-accent font-bold">{currentFabric.durability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-subtle/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFabric.durability}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-chrome">
                    <span>Thermal Air Flow &amp; Breathability</span>
                    <span className="text-accent font-bold">{currentFabric.breathability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-subtle/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentFabric.breathability}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Real-Time GSM Density Comparator Slider */}
          <div className="p-6 bg-bg-surface border border-border-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[9px] text-accent font-mono font-bold uppercase tracking-widest block">
                  INTERACTIVE COMPARATOR
                </span>
                <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-text-primary">
                  EXPLORE GSM WEIGHT SPECTRUM ({customGsm} GSM)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest px-3 py-1 bg-bg-primary border border-border-subtle/60">
                {customGsm < 300
                  ? "LIGHTWEIGHT / ARCHIVAL TEE"
                  : customGsm < 460
                  ? "HEAVYWEIGHT / SWEATSHIRT & JOGGER"
                  : "ULTRA-HEAVY / WINTER VAULT"}
              </span>
            </div>

            <input
              type="range"
              min="200"
              max="550"
              step="10"
              value={customGsm}
              onChange={(e) => setCustomGsm(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer outline-none"
            />

            <div className="flex justify-between text-[8px] sm:text-[9px] font-mono text-chrome uppercase tracking-wider pt-1">
              <span>200 GSM (STANDARD COMMODITY)</span>
              <span>280 GSM (PRINCE TEE SPEC)</span>
              <span>450 GSM (PRINCE TERRY SPEC)</span>
              <span>550 GSM (VAULT SPEC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.6: Micro-Weave Inspector & Longevity Simulator */}
      <section className="relative w-full py-20 bg-bg-primary border-t border-border-subtle/20 px-6 md:px-12 text-left">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle/30 pb-4 gap-3">
            <div>
              <span className="text-[10px] text-accent tracking-[0.25em] font-mono font-bold uppercase block">
                ATELIER SCIENCE
              </span>
              <h3 className="font-display text-2xl sm:text-3xl tracking-widest uppercase font-semibold text-text-primary mt-1">
                MICRO-WEAVE SPECS &amp; LONGEVITY PROTOCOL
              </h3>
            </div>
            <span className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest border border-border-subtle/40 px-3 py-1.5 self-start md:self-auto bg-bg-surface">
              MOLECULAR TWIST INTEGRITY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Micro-weave specs */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[9px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                SELECT TEXTILE STRUCTURE FOR WEAVE ANALYSIS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {weaveSpecs.map((spec, idx) => {
                  const isSelected = activeWeaveIndex === idx;
                  return (
                    <button
                      key={spec.name}
                      type="button"
                      onClick={() => setActiveWeaveIndex(idx)}
                      className={`p-3 text-left border transition-all cursor-pointer outline-none ${
                        isSelected
                          ? "border-accent bg-accent/15 text-accent ring-1 ring-accent/30 shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          : "border-border-subtle/50 bg-bg-surface/50 text-chrome hover:border-accent/60 hover:text-text-primary"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      <span className={`text-[9px] font-mono font-bold uppercase block ${isSelected ? "text-accent" : "text-text-primary"}`}>
                        {spec.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Weave Breakdown Table */}
              <div className="p-5 bg-bg-surface/60 border border-border-subtle/50 space-y-3">
                <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-widest block">
                  TECHNICAL WEAVE PARAMETERS // {weaveSpecs[activeWeaveIndex].name}
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-chrome border-t border-border-subtle/30 pt-3">
                  <span>Yarn Count Specification:</span>
                  <span className="text-right text-text-primary font-bold">{weaveSpecs[activeWeaveIndex].yarnCount}</span>

                  <span>Thread Warp/Weft Density:</span>
                  <span className="text-right text-text-primary font-bold">{weaveSpecs[activeWeaveIndex].threadDensity}</span>

                  <span>Tensile Fracture Resistance:</span>
                  <span className="text-right text-accent font-bold">{weaveSpecs[activeWeaveIndex].tensileStrength}</span>

                  <span>Post-Wash Shrinkage Rate:</span>
                  <span className="text-right text-text-primary font-bold">{weaveSpecs[activeWeaveIndex].shrinkageRate}</span>

                  <span>Gauge Machine Architecture:</span>
                  <span className="text-right text-text-primary font-bold">{weaveSpecs[activeWeaveIndex].gaugeType}</span>
                </div>
              </div>
            </div>

            {/* Right: Care Longevity Simulator */}
            <div className="lg:col-span-5 p-6 bg-bg-surface border border-border-subtle space-y-5">
              <div>
                <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-widest block">
                  LIFESPAN SIMULATOR
                </span>
                <h4 className="font-display text-base font-bold uppercase tracking-wider text-text-primary mt-0.5">
                  GARMENT ROTATION PRESERVATION
                </h4>
              </div>

              {/* Wash Temp */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-chrome block uppercase">
                  WASH TEMPERATURE SETTING
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "COLD" as const, label: "20°C COLD" },
                    { id: "WARM" as const, label: "30°C WARM" },
                    { id: "HOT" as const, label: "40°C HOT" },
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => setWashTemp(temp.id)}
                      className={`p-1.5 text-[8px] font-mono font-bold uppercase border transition-all cursor-pointer text-center outline-none ${
                        washTemp === temp.id
                          ? "bg-accent text-bg-primary border-accent"
                          : "bg-bg-primary text-chrome border-border-subtle hover:border-accent hover:text-accent"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      {temp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drying Protocol */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-chrome block uppercase">
                  DRYING METHOD
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "LINE" as const, label: "SHADE LINE DRY" },
                    { id: "TUMBLE" as const, label: "TUMBLE DRY LOW" },
                  ].map((dry) => (
                    <button
                      key={dry.id}
                      type="button"
                      onClick={() => setDryingMethod(dry.id)}
                      className={`p-1.5 text-[8px] font-mono font-bold uppercase border transition-all cursor-pointer text-center outline-none ${
                        dryingMethod === dry.id
                          ? "bg-accent text-bg-primary border-accent"
                          : "bg-bg-primary text-chrome border-border-subtle hover:border-accent hover:text-accent"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      {dry.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Longevity Score Readout */}
              {(() => {
                const metrics = getLifespanMetrics();
                return (
                  <div className="p-4 bg-bg-primary/70 border border-border-subtle space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-chrome uppercase tracking-widest">
                        ESTIMATED ROTATION RETENTION:
                      </span>
                      <span className="text-xs font-mono font-bold text-accent">
                        {metrics.score}% INDEX
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-border-subtle/30 overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-500 ease-out"
                        style={{ width: `${metrics.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-bold text-text-primary block mt-1">
                      {metrics.wears}+ ACTIVE WEARS
                    </span>
                    <p className="text-[8px] font-mono text-chrome/60 uppercase">
                      {metrics.score > 85
                        ? "Retains complete boxy shoulder stiffness and carbon saturation indefinitely."
                        : "Slight fiber softening expected over extensive rotations."}
                    </p>
                  </div>
                );
              })()}
            </div>
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
          <div className="pt-2">
            <Link
              href="/shop/jogger"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent hover:text-text-primary transition-colors outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded"
            >
              <span>VIEW PREMIUM JOGGERS</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Brand Chronicle Timeline */}
      <section className="relative w-full py-32 bg-bg-primary border-t border-border-subtle/20">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block">
              CHRONOLOGY
            </span>
            <h2 className="font-display text-3xl sm:text-5xl tracking-widest font-semibold uppercase">
              DESIGN EXPERIMENT MILESTONES
            </h2>
          </div>

          <div className="relative border-l border-border-subtle/40 ml-4 md:ml-32 space-y-12 py-4">
            {[
              {
                year: "2024",
                title: "FOUNDING DOCTRINE",
                desc: "PRINCE established as an architectural streetwear experiment. Core principles defined: boxy silhouettes, heavy cotton drapes, and logo omission.",
              },
              {
                year: "2025",
                title: "TIER 01 PROTOTYPING",
                desc: "Development of custom double-twist knit combs yielding 280GSM and 450GSM fabric matrices. Private preview releases to selected archive collectors.",
              },
              {
                year: "2026",
                title: "PUBLIC ACCESS GATEWAY",
                desc: "Launch of online web interface to allow public orders globally. Introduction of persistent fit guidelines, search indices, and order history tracking.",
              },
            ].map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                tabIndex={0}
                className="relative pl-8 md:pl-12 text-left group outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-lg p-3 -ml-3 transition-all duration-300 hover:bg-bg-surface/30 cursor-default"
              >
                {/* Timeline Dot Indicator */}
                <span className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-accent border-4 border-bg-primary group-hover:scale-125 group-focus:scale-125 transition-transform duration-300" />
                
                <span className="font-mono text-xs font-bold text-accent tracking-widest">
                  {milestone.year}
                </span>
                <h4 className="font-display text-lg tracking-wider font-semibold uppercase text-text-primary mt-1 group-hover:text-accent transition-colors">
                  {milestone.title}
                </h4>
                <p className="text-chrome/70 text-xs sm:text-sm font-sans mt-2 max-w-xl leading-relaxed uppercase group-hover:text-chrome transition-colors">
                  {milestone.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Gateway Action CTAs */}
      <section className="relative w-full py-24 bg-bg-surface border-t border-border-subtle/20 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block">
            THE NEXT GATEWAY
          </span>
          <h2 className="font-display text-3xl sm:text-5xl tracking-widest font-semibold uppercase text-text-primary">
            DISCOVER THE ACTIVE RELEASES
          </h2>
          <p className="text-chrome text-xs sm:text-sm max-w-xl mx-auto uppercase tracking-wider font-mono">
            Explore architectural cuts in heavyweight cotton or access our direct concierge lines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-accent text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
            >
              EXPLORE COLLECTION
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto border border-border-subtle hover:border-accent text-chrome hover:text-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] bg-bg-primary"
            >
              CONNECT WITH CONCIERGE
            </Link>
            <Link
              href="/support"
              className="w-full sm:w-auto border border-border-subtle hover:border-accent text-chrome hover:text-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] bg-bg-primary"
            >
              CLIENT FAQS & SUPPORT
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
