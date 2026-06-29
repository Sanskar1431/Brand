"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const mockOrders = [
    {
      id: "PRNC-940182",
      date: "2026-06-15",
      item: "SIGNATURE RAW OVERSIZED TEE",
      color: "CARBON BLACK",
      size: "M",
      price: 450000,
      status: "DELIVERED",
    },
    {
      id: "PRNC-930571",
      date: "2026-06-20",
      item: "HEAVYWEIGHT FRENCH TERRY JOGGER",
      color: "PUMICE GREY",
      size: "L",
      price: 780000,
      status: "IN TRANSIT",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-32 pb-24 px-6 md:px-12 select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto space-y-12 z-10 relative text-left"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="border-b border-border-subtle/30 pb-6">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest uppercase font-semibold">
            MY ACCOUNT
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Client Details Card (4 cols) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 bg-bg-surface border border-border-subtle p-6 space-y-6"
          >
            <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-accent border-b border-border-subtle/30 pb-2">
              CLIENT PROFILE
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Client Name</span>
                <p className="text-sm font-semibold uppercase">Sanskar verma</p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Linked Email</span>
                <p className="text-sm font-mono text-chrome select-all">
                  Sanskar1431@users.noreply.github.com
                </p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Client Tier</span>
                <p className="text-xs font-mono uppercase text-accent font-bold tracking-wider">
                  PRINCE ARCHIVE MEMBER // TIER 01
                </p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Shipping Region</span>
                <p className="text-sm uppercase">IN / ASIA PACIFIC</p>
              </div>
            </div>
          </motion.div>

          {/* Order History Table (8 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
            <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-accent border-b border-border-subtle/30 pb-2">
              ORDER ARCHIVE
            </h3>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-bg-surface border border-border-subtle/50 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-chrome/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-accent select-all">{order.id}</span>
                      <span className="text-[10px] text-chrome uppercase tracking-wider">{order.date}</span>
                    </div>
                    <h4 className="text-sm uppercase tracking-wider font-semibold text-text-primary">
                      {order.item}
                    </h4>
                    <p className="text-xs text-chrome uppercase tracking-widest">
                      COLOR: {order.color} | SIZE: {order.size}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-4">
                    <span className="text-sm font-sans font-bold tabular-nums">
                      ₹{(order.price / 100).toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[9px] font-bold tracking-widest px-3 py-1 border uppercase font-mono ${
                        order.status === "DELIVERED"
                          ? "bg-bg-primary text-text-primary border-border-subtle"
                          : "bg-accent/15 text-accent border-accent/20 animate-pulse"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
