/**
 * motionVariants.js
 * Centralized Framer Motion animation variant presets for shef&B.
 * All durations and easings are calibrated for premium editorial luxury feeling.
 */

const LUXURY_EASE = [0.25, 1, 0.5, 1];
const EDITORIAL_EASE = [0.76, 0, 0.24, 1];

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: LUXURY_EASE } },
};

export const fadeDownVariant = {
  hidden: { opacity: 0, y: -32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: LUXURY_EASE } },
};

export const fadeLeftVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: LUXURY_EASE } },
};

export const fadeRightVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: LUXURY_EASE } },
};

export const scaleRevealVariant = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: LUXURY_EASE } },
};

export const imageRevealVariant = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.2, ease: EDITORIAL_EASE } },
};

export const staggerContainerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const pageVariant = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: LUXURY_EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: EDITORIAL_EASE } },
};

export const navbarVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: LUXURY_EASE, delay: 0.1 } },
};

export const mobileMenuVariant = {
  closed: { opacity: 0, x: '-100%' },
  open: { opacity: 1, x: 0, transition: { duration: 0.5, ease: LUXURY_EASE } },
};

export const mobileMenuItemVariant = {
  closed: { opacity: 0, x: 24 },
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: LUXURY_EASE } },
};
