"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create refs for the mouse position and the interpolated positions of the three blobs
  const mouse = useRef({ x: -1000, y: -1000 });
  const blob1 = useRef({ x: -1000, y: -1000 }); // Purple (Fastest)
  const blob2 = useRef({ x: -1000, y: -1000 }); // Cyan (Medium)
  const blob3 = useRef({ x: -1000, y: -1000 }); // Coral (Slowest)
  
  // Interactive states managed via refs for zero-react-render performance
  const isHovering = useRef(false);
  const currentScale = useRef(1.0);
  const currentOpacity = useRef(0.6);
  
  // Element refs for DOM styling updates
  const el1Ref = useRef<HTMLDivElement>(null);
  const el2Ref = useRef<HTMLDivElement>(null);
  const el3Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    
    // Check if it's a touch device (to avoid registering mousemove listeners on mobile/tablet)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers scale-up on any interactive element or button/link
      if (
        target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer, .group")
      ) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    let animationFrameId: number;
    
    const tick = () => {
      // Initialize position if first movement
      if (blob1.current.x === -1000) {
        blob1.current.x = mouse.current.x;
        blob1.current.y = mouse.current.y;
        blob2.current.x = mouse.current.x;
        blob2.current.y = mouse.current.y;
        blob3.current.x = mouse.current.x;
        blob3.current.y = mouse.current.y;
      } else {
        // Smoothly interpolate positions with different speeds for organic fluid trailing
        blob1.current.x += (mouse.current.x - blob1.current.x) * 0.12;
        blob1.current.y += (mouse.current.y - blob1.current.y) * 0.12;
        
        blob2.current.x += (mouse.current.x - blob2.current.x) * 0.08;
        blob2.current.y += (mouse.current.y - blob2.current.y) * 0.08;
        
        blob3.current.x += (mouse.current.x - blob3.current.x) * 0.04;
        blob3.current.y += (mouse.current.y - blob3.current.y) * 0.04;
      }
      
      // Interpolate scale & opacity for hover feedback
      const targetScale = isHovering.current ? 1.35 : 1.0;
      const targetOpacity = isHovering.current ? 0.85 : 0.6;
      
      currentScale.current += (targetScale - currentScale.current) * 0.15;
      currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.15;
      
      if (containerRef.current) {
        containerRef.current.style.opacity = `${currentOpacity.current}`;
      }
      
      // Update DOM styles directly
      if (el1Ref.current) {
        el1Ref.current.style.transform = `translate3d(${blob1.current.x - 250}px, ${blob1.current.y - 250}px, 0) scale(${currentScale.current})`;
      }
      if (el2Ref.current) {
        el2Ref.current.style.transform = `translate3d(${blob2.current.x - 200}px, ${blob2.current.y - 200}px, 0) scale(${currentScale.current * 0.95})`;
      }
      if (el3Ref.current) {
        el3Ref.current.style.transform = `translate3d(${blob3.current.x - 175}px, ${blob3.current.y - 175}px, 0) scale(${currentScale.current * 0.9})`;
      }
      
      animationFrameId = requestAnimationFrame(tick);
    };
    
    animationFrameId = requestAnimationFrame(tick);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-[25] select-none mix-blend-multiply dark:mix-blend-screen transition-opacity duration-300"
      style={{ opacity: 0.6 }}
    >
      {/* Blob 1: Purple (Large & Fast) */}
      <div
        ref={el1Ref}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0.06) 50%, transparent 80%)",
          willChange: "transform",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />
      {/* Blob 2: Cyan (Medium & Mid-lag) */}
      <div
        ref={el2Ref}
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full filter blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 80%)",
          willChange: "transform",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />
      {/* Blob 3: Coral (Small & Slow-lag) */}
      <div
        ref={el3Ref}
        className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full filter blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(255, 78, 80, 0.15) 0%, rgba(255, 78, 80, 0.04) 50%, transparent 80%)",
          willChange: "transform",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />
    </div>
  );
}
