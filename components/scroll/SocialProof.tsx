"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const testimonials = [
  {
    quote: "“The heavy drape and raw edges of the signature tee are architecturally unmatched. True presence.”",
    author: "LEONARD V., BRUSSELS"
  },
  {
    quote: "“No labels, no branding, just pure structural dominance. It speaks without saying a single word.”",
    author: "MARCUS K., TOKYO"
  },
  {
    quote: "“The fleece joggers hold their architectural shape even after months of wear. Essential luxury.”",
    author: "SARAH L., NEW YORK"
  }
];

function CountUp({ to }: { to: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, to, {
      duration: 1.5,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
}

export default function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto rotate testimonials every 6s (Section 5.6)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleArrowClick = (dir: "prev" | "next") => {
    if (dir === "next") {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    } else {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <section className="bg-bg-primary py-32 px-6 md:px-12 border-t border-border-subtle/20">
      <div className="max-w-[1600px] mx-auto">
        {/* Editorial Layout Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
        >
          {/* Column 1: Animated Counters (left 3 cols) */}
          <div className="lg:col-span-3 space-y-12 text-left">
            <div>
              <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase block mb-1">
                METRICS
              </span>
              <h3 className="font-display text-4xl sm:text-5xl font-semibold tracking-wider text-text-primary">
                <CountUp to={12400} />+
              </h3>
              <p className="text-chrome text-xs uppercase tracking-widest mt-2">
                KINGDOM MEMBERS REGISTERED
              </p>
            </div>
            <div>
              <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase block mb-1">
                CRAFTSMANSHIP
              </span>
              <h3 className="font-display text-4xl sm:text-5xl font-semibold tracking-wider text-text-primary">
                100%
              </h3>
              <p className="text-chrome text-xs uppercase tracking-widest mt-2">
                PRE-SHRUNK COMBED COTTON
              </p>
            </div>
            <div>
              <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase block mb-1">
                ORIGIN
              </span>
              <h3 className="font-display text-4xl sm:text-5xl font-semibold tracking-wider text-text-primary">
                0.0
              </h3>
              <p className="text-chrome text-xs uppercase tracking-widest mt-2">
                EXCESS LOGOS PRINTED
              </p>
            </div>
          </div>

          {/* Column 2: Testimonials with crossfade (center 5 cols) */}
          <div className="lg:col-span-5 h-[350px] flex flex-col justify-between border-l border-border-subtle/30 pl-8 lg:pl-12 text-left">
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative min-h-[150px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 absolute w-full"
                  >
                    <p className="font-display text-lg sm:text-2xl tracking-wide text-text-primary italic leading-relaxed">
                      {testimonials[activeTestimonial].quote}
                    </p>
                    <p className="text-xs tracking-[0.2em] font-bold text-accent uppercase">
                      {testimonials[activeTestimonial].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Testimonial navigation buttons */}
            <div className="flex gap-4 items-center">
              <button
                onClick={() => handleArrowClick("prev")}
                className="p-3 border border-chrome/20 hover:border-accent text-chrome hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <button
                onClick={() => handleArrowClick("next")}
                className="p-3 border border-chrome/20 hover:border-accent text-chrome hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                →
              </button>
              <span className="text-xs tracking-widest text-chrome font-mono">
                0{activeTestimonial + 1} / 0{testimonials.length}
              </span>
            </div>
          </div>

          {/* Column 3: Community UGC Showcase Grid (right 4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[3/4] bg-bg-surface border border-border-subtle/40 p-3 flex flex-col justify-between hover:border-accent/40 transition-colors cursor-pointer"
              >
                <div className="flex-1 bg-bg-elevated flex items-center justify-center relative overflow-hidden">
                  <span className="text-[10px] text-chrome/30 uppercase tracking-widest font-mono">
                    #PRINCE_0{i}
                  </span>
                </div>
                <div className="mt-2 text-left">
                  <span className="text-[9px] text-chrome/50 font-sans uppercase">
                    MEMBER IN THE KINGDOM
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
