import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.drawerOverlay}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className={styles.drawer}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Your Cart</h2>
              <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>&times;</button>
            </div>

            {cartItems.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Your cart is empty</h3>
                <p>Discover our collection of elemental forms.</p>
                <button className={styles.continueBtn} onClick={() => setIsCartOpen(false)} style={{ marginTop: '2rem' }}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cartItems.map((item) => (
                    <div key={item.productId} className={styles.cartItem}>
                      <img src={getImageUrl(item.image)} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <div>
                          <h4 className={styles.itemName}>{item.name}</h4>
                          <p className={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <div className={styles.controls}>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.productId, -1)}>-</button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.productId, 1)}>+</button>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.productId)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.footer}>
                  <div className={styles.totals}>
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    className={styles.checkoutBtn} 
                    onClick={() => {
                      setIsCartOpen(false);
                      window.location.href = '/checkout';
                    }}
                    style={{ opacity: 1, cursor: 'pointer' }}
                  >
                    Proceed to Checkout
                  </button>
                  <button className={styles.continueBtn} onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
