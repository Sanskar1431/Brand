import { EASE, DURATION } from "@/lib/motion-tokens";

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.luxury },
  },
};

export const cardLift = {
  rest: { y: 0, scale: 1, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
  hover: {
    y: -12,
    scale: 1.02,
    boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
    transition: { duration: DURATION.fast, ease: EASE.luxury },
  },
};

export const drawerSlide = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE.inOut },
  },
  exit: {
    x: "100%",
    transition: { duration: DURATION.base, ease: EASE.inOut },
  },
};
