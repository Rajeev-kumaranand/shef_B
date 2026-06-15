import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariant } from '../../motion/motionVariants.js';
import styles from './AdminModal.module.css';

export default function AdminModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{title}</h3>
              <button className={styles.closeBtn} onClick={onClose}>&times;</button>
            </div>
            <div className={styles.body}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
