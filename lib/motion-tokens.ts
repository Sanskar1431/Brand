// Shared by Framer Motion variants AND gsap.to() calls
export const EASE = {
  // Custom cubic-bezier — slow start, confident finish.
  // This single curve is THE PRINCE signature motion feel.
  luxury: [0.16, 1, 0.3, 1] as [number, number, number, number], // Framer Motion array format
  luxuryCss: "cubic-bezier(0.16, 1, 0.3, 1)", // for GSAP / CSS
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number], // symmetric — used for toggles (cart, menu)
  sharp: [0.4, 0, 0.2, 1] as [number, number, number, number], // quick UI feedback (button press)
};

export const DURATION = {
  instant: 0.15, // button press feedback
  fast: 0.3, // hover states, small UI
  base: 0.6, // standard reveal, card lift
  slow: 1.0, // section transitions, large reveals
  cinematic: 1.8, // logo emergence, hero load sequence
};

export const STAGGER = {
  tight: 0.04, // text character/word reveals
  normal: 0.08, // card grids, list items
  wide: 0.15, // large hero element sequences
};
