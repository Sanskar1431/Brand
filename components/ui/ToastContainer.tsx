"use client";

import { useToastStore } from "@/lib/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-4 p-4 border bg-bg-surface backdrop-blur-md shadow-xl select-none ${
              toast.type === "success"
                ? "border-accent/40 text-text-primary"
                : toast.type === "error"
                ? "border-error/45 text-text-primary"
                : "border-border-subtle text-text-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Type indicator bar */}
              <span
                className={`w-[3px] h-4 rounded-full ${
                  toast.type === "success"
                    ? "bg-accent"
                    : toast.type === "error"
                    ? "bg-error"
                    : "bg-chrome"
                }`}
              />
              <p className="text-[11px] uppercase tracking-widest font-mono font-semibold">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-chrome hover:text-text-primary transition-colors cursor-pointer p-1"
              aria-label="Dismiss notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
