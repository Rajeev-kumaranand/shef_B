/**
 * FadeUp.jsx
 * Reusable scroll-triggered fade-up animation wrapper using Framer Motion + IntersectionObserver.
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUpVariant } from '../../motion/motionVariants.js';

export default function FadeUp({ children, delay = 0, className = '', once = true }) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUpVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
