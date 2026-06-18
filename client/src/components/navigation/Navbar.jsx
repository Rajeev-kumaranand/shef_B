/**
 * Navbar.jsx
 * Global navigation bar upgraded with transparency over Hero, blur on scroll,
 * animated underline, premium typography, and mobile fullscreen menu.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navbarVariant } from '../../motion/motionVariants.js';
import { useCompany, useNavigation } from '../../hooks/useApi.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import NavLinkItem from './NavLinkItem.jsx';
import MobileMenu from './MobileMenu.jsx';
import Container from '../common/Container.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './Navbar.module.css';
import { cn } from '../../utils/cn.js';
import Logo from '../../assets/logo.png'

import { FiShoppingBag, FiHeart, FiUser, FiPlus, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const { data: company, loading: companyLoading } = useCompany();
  const { data: navigationData, loading: navLoading } = useNavigation();
  const { settings, loading: settingsLoading } = useSettings();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
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
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <img src={Logo} alt="shef&B" className={styles.logoImg} />
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navGroup}>
            <nav className={styles.desktopNav}>
              {navLoading ? (
                <div style={{ display: 'flex', gap: '2rem' }}>
                  {[1,2,3,4].map(i => <Skeleton key={i} width="60px" height="16px" />)}
                </div>
              ) : (
                navigationData?.map((item) => (
                  <NavLinkItem
                    key={item.id}
                    item={item}
                    className={showTransparent ? styles.transparentLink : ''}
                  />
                ))
              )}
            </nav>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <span className={cn(styles.hamburgerLine, showTransparent && styles.transparentLine)} />
            <span className={cn(styles.hamburgerLine, showTransparent && styles.transparentLine)} />
            <span className={cn(styles.hamburgerLine, showTransparent && styles.transparentLine)} />
          </button>
        </Container>
      </motion.header>

      {/* Floating Actions */}
      <div 
        className={styles.floatingContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.floatingMenu}>
          {customer && (
            <motion.div 
              className={styles.floatingItem}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={isHovered ? { opacity: 1, scale: 1, x: 53, y: -53 } : { opacity: 0, scale: 0, x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <button onClick={logout} className={styles.floatingActionIconBtn} aria-label="Logout">
                <FiLogOut size={20} />
              </button>
            </motion.div>
          )}

          {/* Account */}
          <motion.div 
            className={styles.floatingItem}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: 0, y: -75 } : { opacity: 0, scale: 0, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link to={customer ? "/account" : "/account/login"} className={styles.floatingActionIconBtn} aria-label="Account">
              <FiUser size={20} />
            </Link>
          </motion.div>

          {/* Wishlist */}
          <motion.div 
            className={styles.floatingItem}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: -53, y: -53 } : { opacity: 0, scale: 0, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
          >
            <Link to={customer ? "/wishlist" : `/account/login?redirect=${encodeURIComponent('/wishlist')}`} className={styles.floatingActionIconBtn} aria-label="Wishlist">
              <FiHeart size={20} />
              {wishlistCount > 0 && <span className={styles.iconBadge}>{wishlistCount}</span>}
            </Link>
          </motion.div>

          {/* Cart */}
          <motion.div 
            className={styles.floatingItem}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: -75, y: 0 } : { opacity: 0, scale: 0, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            {customer ? (
              <button 
                className={styles.floatingActionIconBtn}
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && <span className={styles.iconBadge}>{cartCount}</span>}
              </button>
            ) : (
              <Link 
                to={`/account/login?redirect=${encodeURIComponent(location.pathname)}`} 
                className={styles.floatingActionIconBtn}
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
              </Link>
            )}
          </motion.div>
        </div>
        
        <motion.button 
          className={styles.floatingMainBtn}
          animate={{ rotate: isHovered ? 135 : 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Actions"
        >
          <FiPlus size={24} />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
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
