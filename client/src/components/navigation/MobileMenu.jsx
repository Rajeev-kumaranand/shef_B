/**
 * MobileMenu.jsx
 * Full-screen overlay menu for mobile devices.
 */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileMenuVariant, staggerContainerVariant, mobileMenuItemVariant } from '../../motion/motionVariants.js';
import NavLinkItem from './NavLinkItem.jsx';
import styles from './MobileMenu.module.css';

export default function MobileMenu({ isOpen, onClose, navigationData }) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={mobileMenuVariant}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <motion.div
            className={styles.navContainer}
            variants={staggerContainerVariant}
            initial="hidden"
            animate="visible"
          >
            <nav className={styles.nav}>
              {navigationData.map((item) => (
                <motion.div key={item.id} variants={mobileMenuItemVariant}>
                  <NavLinkItem item={item} onClick={onClose} className={styles.linkItem} />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
