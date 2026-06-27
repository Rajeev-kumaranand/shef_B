import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navbarVariant } from '../../motion/motionVariants.js';
import { useCompany, useNavigation } from '../../hooks/useApi.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import MobileMenu from './MobileMenu.jsx';
import Container from '../common/Container.jsx';
import styles from './Navbar.module.css';
import { cn } from '../../utils/cn.js';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: navigationData, loading: navLoading } = useNavigation();
  const { cartCount, setIsCartOpen } = useCart();
  const { customer, logout } = useCustomerAuth();

  // Check if we are on the Home page to support transparent layout
  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Persistent Right Floating Actions (Zara Style) */}
      <div className={cn(styles.zaraSidebar, showTransparent && styles.transparentSidebar)}>
        <button className={styles.zaraSidebarLink} onClick={() => setIsCartOpen(true)}>
          BAG <span className={styles.bagCount}>[ {cartCount} ]</span>
        </button>
        {customer ? (
          <button className={styles.zaraSidebarLink} onClick={logout}>LOG OUT</button>
        ) : (
          <Link to={`/account/login?redirect=${encodeURIComponent(location.pathname)}`} className={styles.zaraSidebarLink}>
            LOG IN
          </Link>
        )}
        <Link to="/contact" className={styles.zaraSidebarLink}>HELP</Link>
      </div>

      <motion.header
        className={cn(
          styles.header,
          isScrolled && styles.scrolled,
          showTransparent && styles.transparent
        )}
        variants={navbarVariant}
        initial="hidden"
        animate="visible"
      >
        <Container width="wide" className={styles.container}>
          
          {/* Menu Toggle (Left) - Always visible like Zara */}
          <button
            className={styles.menuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <motion.span 
              className={cn(styles.hamburgerLine, showTransparent && !mobileMenuOpen && styles.transparentLine)}
              animate={mobileMenuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className={cn(styles.hamburgerLine, showTransparent && !mobileMenuOpen && styles.transparentLine)}
              animate={mobileMenuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* Search Button (Right) */}
          <div className={styles.navRight}>
            <button className={cn(styles.searchBtn, showTransparent && styles.transparentSearch)}>
              SEARCH
            </button>
          </div>

        </Container>
      </motion.header>

      {/* Full-Screen Zara-Style Menu Overlay */}
      {!navLoading && navigationData && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigationData={navigationData}
        />
      )}
    </>
  );
}
