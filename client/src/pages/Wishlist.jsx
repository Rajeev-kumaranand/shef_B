import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  return (
    <div className={styles.page}>
      <Section spacing="large">
        <Container width="wide">
          <SectionTitle title="Your Wishlist" alignment="center" />
          
          {wishlistItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.emptyState}
            >
              <h3 className={styles.emptyTitle}>Nothing saved yet</h3>
              <p className={styles.emptyText}>Curate your personal collection of objects.</p>
              <Link to="/shop" className={styles.shopBtn}>Explore the Collection</Link>
            </motion.div>
          ) : (
            <div className={styles.grid}>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={styles.card}
                >
                  <Link to={`/shop/${item.slug}`} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      <img src={getImageUrl(item.image)} alt={item.name} className={styles.image} />
                    </div>
                  </Link>
                  <div className={styles.info}>
                    <h4 className={styles.name}>{item.name}</h4>
                    <p className={styles.price}>${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.addToCartBtn} onClick={() => addToCart(item)}>Add to Cart</button>
                    <button className={styles.removeBtn} onClick={() => removeFromWishlist(item.id)}>Remove</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
