/**
 * MainLayout.jsx
 * Wrapper for the public-facing application, including global Nav and Footer.
 */
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/footer/Footer.jsx';
import PageTransition from '../components/common/PageTransition.jsx';
import CartDrawer from '../components/common/CartDrawer.jsx';
import AnnouncementBar from '../components/common/AnnouncementBar.jsx';
import ScrollToTop from '../components/common/ScrollToTop.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { WishlistProvider } from '../context/WishlistContext.jsx';
import { CustomerAuthProvider } from '../context/CustomerAuthContext.jsx';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <CustomerAuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className={styles.layout}>
            <ScrollToTop />
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <main className={styles.main}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </CustomerAuthProvider>
  );
}
