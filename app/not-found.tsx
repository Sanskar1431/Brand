"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary flex flex-col justify-center items-center px-6 relative overflow-hidden select-none">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-8 z-10"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <span className="text-xs text-accent tracking-[0.4em] font-bold uppercase block">
            ERROR 404
          </span>
          <h1 className="font-display text-7xl sm:text-8xl tracking-widest font-semibold uppercase text-text-primary">
            LOST
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="w-12 h-[1px] bg-border-subtle mx-auto" />

        <motion.p
          variants={itemVariants}
          className="text-chrome/75 text-sm sm:text-base leading-relaxed tracking-wide font-sans max-w-sm mx-auto"
        >
          The page you are looking for has been archived, renamed, or does not exist in our collections.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3 bg-accent text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors duration-300 shadow-lg shadow-accent/15 border border-transparent"
          >
            VIEW COLLECTIONS
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-transparent text-text-primary text-xs font-bold uppercase tracking-[0.2em] border border-border-subtle hover:border-text-primary transition-colors duration-300"
          >
            RETURN HOME
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
