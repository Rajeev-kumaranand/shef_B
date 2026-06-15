/**
 * ScaleReveal.jsx
 * Reusable scroll-triggered centered scale reveal animation wrapper.
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { scaleRevealVariant } from '../../motion/motionVariants.js';

export default function ScaleReveal({ children, delay = 0, className = '', once = true }) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.12 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={scaleRevealVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
