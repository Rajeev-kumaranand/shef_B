/**
 * RevealText.jsx
 * Staggered split text reveal component utilizing Framer Motion.
 */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function RevealText({
  text,
  className = '',
  once = true,
  delay = 0,
  stagger = 0.03
}) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.1 });
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: '50%',
    },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1], // ease-luxury
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        whiteSpace: 'normal',
      }}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          style={{
            overflow: 'hidden',
            display: 'inline-block',
            marginRight: '0.25em',
            paddingBottom: '0.05em'
          }}
        >
          <motion.span
            variants={wordVariants}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
