/**
 * PageTransition.jsx
 * Wrapper for page routes to provide enter/exit animations using Framer Motion's AnimatePresence.
 */
import { motion } from 'framer-motion';
import { pageVariant } from '../../motion/motionVariants.js';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={pageVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
