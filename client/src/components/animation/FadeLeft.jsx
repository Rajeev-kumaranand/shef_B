/**
 * FadeLeft.jsx
 * Reusable scroll-triggered fade-from-right animation wrapper (slides element in from the right).
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeLeftVariant } from '../../motion/motionVariants.js';

export default function FadeLeft({ children, delay = 0, className = '', once = true }) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeLeftVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
