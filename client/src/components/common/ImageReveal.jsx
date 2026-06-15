/**
 * ImageReveal.jsx
 * Cinematic image reveal component.
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { imageRevealVariant } from '../../motion/motionVariants.js';
import styles from './ImageReveal.module.css';
import { cn } from '../../utils/cn.js';

export default function ImageReveal({
  src,
  alt,
  aspectRatio = 'square',
  className = '',
  imageClassName = '',
  once = true,
}) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.1 });

  const aspectClass = {
    square: styles.aspectSquare,
    portrait: styles.aspectPortrait,
    landscape: styles.aspectLandscape,
    cinematic: styles.aspectCinematic,
  }[aspectRatio] || styles.aspectSquare;

  return (
    <div ref={ref} className={cn(styles.wrapper, aspectClass, className)}>
      <motion.div
        className={styles.revealContainer}
        variants={imageRevealVariant}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <img
          src={src}
          alt={alt}
          className={cn(styles.image, imageClassName)}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}
