"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

// Zod validation schema (Section 7.3.2)
const contactSchema = z.object({
  name: z.string().min(2, { message: "NAME REQUIRED (MIN 2 CHARS)." }),
  email: z.string().email({ message: "VALID EMAIL REQUIRED." }),
  subject: z.string().min(3, { message: "SUBJECT REQUIRED." }),
  message: z.string().min(10, { message: "MESSAGE REQUIRED (MIN 10 CHARS)." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const faqs = [
  {
    question: "WHAT IS THE DISPATCH TIMELINE FOR EXCLUSIVE ARCHIVES?",
    answer: "Orders are processed within 24-48 business hours. Delivery takes 3-5 business days for domestic shipments and 5-10 business days for international orders, complete with end-to-end tracking."
  },
  {
    question: "WHAT IS YOUR RETURN AND REFUND POLICY?",
    answer: "We support a 14-day return window from the delivery date for all unworn, unwashed items in original packaging. Return shipping is managed securely through our portal."
  },
  {
    question: "CAN I CANCEL OR MODIFY AN ACTIVE ORDER?",
    answer: "Given our rapid fulfillment sequence, order modifications are only available within 60 minutes of checkout. Contact support immediately for urgent queue holds."
  }
];

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitStatus("loading");
    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitStatus("success");
    reset();
    setTimeout(() => setSubmitStatus("idle"), 5000);
  };

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12 text-left flex flex-col justify-center">
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Information and FAQs */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
              SUPPORT SECTOR
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-wider text-text-primary uppercase leading-tight">
              CONNECT WITH THE KINGDOM
            </h1>
            <p className="text-chrome text-sm mt-4 leading-relaxed font-sans">
              Have questions regarding garment metrics, fit sizing, or dispatch delivery? Access our communication queues.
            </p>
          </div>

          {/* Social Links (monoline chrome-style, Section 7.3.2) */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase">
              DIRECT LINES
            </h4>
            <div className="flex gap-4">
              {["INSTAGRAM", "X-TWITTER", "DISCORD"].map((s) => (
                <motion.a
                  key={s}
                  href="#"
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="text-xs font-bold tracking-widest text-chrome hover:text-accent border border-border-subtle hover:border-accent px-4 py-2.5 bg-bg-surface transition-all cursor-pointer"
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {/* FAQs Accordion Pattern (Section 7.3.2) */}
          <div className="space-y-4 pt-6 border-t border-border-subtle/30">
            <h4 className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase mb-4">
              COMMON INQUIRIES
            </h4>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-border-subtle/20 pb-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-xs font-bold uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="text-base">{isOpen ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-chrome leading-relaxed font-sans mt-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Glassmorphism Form panel (Section 7.3.2) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl space-y-8 relative overflow-hidden">
            
            <div className="text-left border-b border-border-subtle/50 pb-4">
              <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase">
                SECURE CONCIERGE QUEUE
              </h3>
              <p className="text-[10px] text-chrome/50 uppercase tracking-widest mt-1">
                Submissions routed immediately to staff.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-chrome tracking-wider uppercase block">
                  NAME
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="ENTER NAME"
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase"
                />
                {errors.name && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-chrome tracking-wider uppercase block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="ENTER EMAIL ADDRESS"
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase"
                />
                {errors.email && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-chrome tracking-wider uppercase block">
                  SUBJECT
                </label>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="ENTER SUBJECT"
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase"
                />
                {errors.subject && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-chrome tracking-wider uppercase block">
                  MESSAGE BODY
                </label>
                <textarea
                  rows={4}
                  {...register("message")}
                  placeholder="ENTER INQUIRY DESCRIPTION..."
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase resize-none"
                />
                {errors.message && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button with loader morph and checkmark animations (Section 7.3.2) */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full bg-accent text-white hover:bg-accent-hover py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative flex items-center justify-center min-h-[52px] cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {submitStatus === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        SUBMIT INQUIRY
                      </motion.span>
                    )}
                    {submitStatus === "loading" && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-1.5"
                      >
                        {/* Subtle pulsing dots replacing generic spinners */}
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow" />
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow delay-75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow delay-150" />
                      </motion.div>
                    )}
                    {submitStatus === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-accent font-bold"
                      >
                        {/* Framer Motion path-draw SVG checkmark */}
                        <svg
                          className="w-5 h-5 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        SUBMISSION COMPLETE
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
