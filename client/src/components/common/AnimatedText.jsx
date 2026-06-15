/**
 * AnimatedText.jsx
 * Staggers the reveal of text line by line or word by word.
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function AnimatedText({
  text,
  className = '',
  as: Tag = 'p',
  once = true,
  delay = 0,
}) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.2 });

  // Split text into words for staggered animation
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
