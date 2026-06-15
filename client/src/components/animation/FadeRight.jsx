/**
 * FadeRight.jsx
 * Reusable scroll-triggered fade-from-left animation wrapper (slides element in from the left).
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeRightVariant } from '../../motion/motionVariants.js';

export default function FadeRight({ children, delay = 0, className = '', once = true }) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeRightVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
