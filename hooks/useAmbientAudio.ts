"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/lib/store/uiStore";

export function useAmbientAudio() {
  const { isAudioPlaying } = useUIStore();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isAudioPlaying) {
      // Initialize Audio Context on user interaction (Section 5.1.2)
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create a master gain node for smooth fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      // Fade in master volume to 0.15 over 2 seconds
      masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2.0);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Lowpass filter for warm, dark analog synth tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      // Slow LFO filter frequency sweep over 8 seconds
      filter.frequency.linearRampToValueAtTime(600, ctx.currentTime + 4.0);
      filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 8.0);
      filter.connect(masterGain);

      // Warm ambient pads (chord components)
      // A1 (55Hz), A2 (110Hz), E3 (164.81Hz), C#4 (277.18Hz) -> A major soundscape
      const frequencies = [55, 110, 164.81, 277.18];
      const oscillators = frequencies.map((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Individual volume balance per voice
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(idx === 0 ? 0.4 : 0.2, ctx.currentTime);
        
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(0);
        return osc;
      });

      oscillatorsRef.current = oscillators;
    } else {
      // Smooth fade-out (1.5 seconds) to avoid pops (Section 7.3.2 discipline)
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const gain = gainNodeRef.current.gain;
        
        gain.setValueAtTime(gain.value, ctx.currentTime);
        gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

        // Suspend context and stop oscillators after fade completes
        setTimeout(() => {
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
            } catch (e) {}
          });
          oscillatorsRef.current = [];
          
          if (audioCtxRef.current && audioCtxRef.current.state === "running") {
            audioCtxRef.current.suspend();
          }
        }, 1300);
      }
    }

    return () => {
      // Cleanup on unmount
      if (gainNodeRef.current && audioCtxRef.current) {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
          } catch (e) {}
        });
      }
    };
  }, [isAudioPlaying]);
}
