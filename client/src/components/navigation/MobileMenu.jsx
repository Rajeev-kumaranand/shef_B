import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileMenuVariant, staggerContainerVariant, mobileMenuItemVariant } from '../../motion/motionVariants.js';
import NavLinkItem from './NavLinkItem.jsx';
import styles from './MobileMenu.module.css';
import Logo from '../../assets/logo.png';

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
          <div className={styles.logoContainer}>
            <img src={Logo} alt="SHEF & B." className={styles.logo} />
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
                  {/* We map items to large Zara-style text */}
                  <NavLinkItem item={item} onClick={onClose} className={styles.linkItem} />
                </motion.div>
              ))}
            </nav>

            <div className={styles.zaraMenuLinks}>
               <div className={styles.secondaryLinks}>
                 <p className={styles.secondaryTitle}>NEW COLLECTION</p>
                 <Link to="/shop" onClick={onClose}>NEW IN</Link>
                 <Link to="/shop" onClick={onClose}>COLLECTION</Link>
               </div>
               
               <div className={styles.tertiaryLinks}>
                 <Link to="/shop" onClick={onClose}>LINEN</Link>
                 <Link to="/shop" onClick={onClose}>DRESSES</Link>
                 <Link to="/shop" onClick={onClose}>TOPS | BODIES</Link>
                 <Link to="/shop" onClick={onClose}>T-SHIRTS</Link>
                 <Link to="/shop" onClick={onClose}>SHIRTS</Link>
                 <Link to="/shop" onClick={onClose}>KNITWEAR</Link>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
