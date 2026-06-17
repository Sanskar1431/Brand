"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "mid" | "low";

interface DeviceCapability {
  isHydrated: boolean;
  isReducedMode: boolean;
  tier: DeviceTier;
  particleCount: number;
  hasWebGL: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    isHydrated: false,
    isReducedMode: true, // Default to true for SSR/No-JS crawler compatibility
    tier: "low",
    particleCount: 150,
    hasWebGL: false,
  });

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = reducedMotionQuery.matches;

    // 2. Check WebGL availability
    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      hasWebGL = false;
    }

    // 3. Check Hardware Concurrency
    const cores = navigator.hardwareConcurrency || 4;

    // 4. Check Device Memory (RAM) in GB (Chrome/Edge/Opera only)
    const memory = (navigator as any).deviceMemory || 4;

    // 5. Check network connection speed
    let isSlowConnection = false;
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
        isSlowConnection = true;
      }
    }

    // Determine Tier based on Section 6.3
    let tier: DeviceTier = "low";
    let particleCount = 150;
    let isReducedMode = false;

    if (prefersReducedMotion || !hasWebGL || isSlowConnection || memory < 4 || cores < 4) {
      // Low Tier or Reduced Motion (Fallback to static Mode)
      tier = "low";
      particleCount = 150;
      isReducedMode = true;
    } else if (memory >= 8 && cores >= 8) {
      // High Tier
      tier = "high";
      particleCount = 800;
      isReducedMode = false;
    } else {
      // Mid Tier
      tier = "mid";
      particleCount = 400;
      isReducedMode = false;
    }

    setCapability({
      isHydrated: true,
      isReducedMode,
      tier,
      particleCount,
      hasWebGL,
    });
  }, []);

  return capability;
}
