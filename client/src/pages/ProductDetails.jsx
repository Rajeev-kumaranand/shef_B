import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getProductBySlug, getProducts } from '../services/api/productApi.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import SEOManager from '../components/common/SEOManager.jsx';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsAvg, setReviewsAvg] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!loading && product) {
      // Force scroll to top when content actually paints
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 10);
    }
  }, [loading, product, slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductBySlug(slug);
      if (res.success) {
        const prod = res.data;
        setProduct(prod);
        setActiveImage(prod.image);

        // Fetch Reviews
        fetchReviews(prod.id);

        // Fetch related products (same category)
        const allRes = await getProducts();
        if (allRes.success) {
          const related = allRes.data
            .filter(p => p.id !== prod.id && p.active)
            .filter(p => p.category === prod.category)
            .slice(0, 4);

          // If we don't have enough in the same category, fill with random active products
          if (related.length < 4) {
            const others = allRes.data
              .filter(p => p.id !== prod.id && p.active && p.category !== prod.category)
              .slice(0, 4 - related.length);
            setRelatedProducts([...related, ...others]);
          } else {
            setRelatedProducts(related);
          }
        }
      } else {
        // Product not found
        navigate('/shop');
      }
    } catch (err) {
      console.error(err);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${API_URL}/reviews/product/${productId}`);
      if (res.data.success) {
        setReviews(res.data.data.reviews);
        setReviewsAvg(res.data.data.average);
        setReviewsCount(res.data.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('shefb_customer_token');
      if (!token) {
        toast.error('You must be logged in to leave a review');
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/reviews`, {
        productId: product.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Review submitted successfully and is pending approval.');
        setReviewFormOpen(false);
        setReviewForm({ rating: 5, title: '', comment: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '/logo.png';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  if (loading || !product) return <LoadingState />;

  let galleryImages = [product.image];
  if (product.gallery && Array.isArray(product.gallery)) {
    galleryImages = [product.image, ...product.gallery];
  } else if (typeof product.gallery === 'string') {
    try {
      const parsed = JSON.parse(product.gallery);
      if (Array.isArray(parsed)) galleryImages = [product.image, ...parsed];
    } catch (e) { }
  }

  const isWished = isInWishlist(product.id);

  let stockStatus = null;
  if (product.trackInventory) {
    if (product.stock === 0) stockStatus = 'out';
    else if (product.stock <= product.lowStockThreshold) stockStatus = 'low';
  }

  return (
    <div className={styles.page}>
      <SEOManager productSeo={product} />
      <Section spacing="large" className={styles.mainSection}>
        <Container width="wide">
          <div className={styles.grid}>
            {/* Gallery Column */}
            <div className={styles.galleryCol}>
              <div className={styles.mainImageWrapper}>
                <img
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  className={styles.mainImage}
                  style={stockStatus === 'out' ? { opacity: 0.5, filter: 'grayscale(1)' } : {}}
                />
                {stockStatus === 'out' && <div className={styles.outOfStockBadge}>Out of Stock</div>}
              </div>
              {galleryImages.length > 1 && (
                <div className={styles.thumbnailStrip}>
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`${styles.thumbnailBtn} ${activeImage === img ? styles.activeThumb : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className={styles.thumbnail} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className={styles.infoCol}>
              <div className={styles.category}>{product.category}</div>
              <h1 className={styles.title}>{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className={styles.price}>${parseFloat(product.price).toFixed(2)}</div>
                {reviewsCount > 0 && (
                  <div style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>★</span>
                    <span style={{ color: 'black', fontWeight: 600 }}>{reviewsAvg}</span>
                    <span style={{ color: 'black', fontSize: '13px' }}>({reviewsCount})</span>
                  </div>
                )}
              </div>

              <div className={styles.shortDesc}>{product.shortDesc}</div>

              <div className={styles.stock}>
                {stockStatus === 'out' ? (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
                ) : stockStatus === 'low' ? (
                  <span style={{ color: '#eab308', fontWeight: 600 }}>Low Stock - Only {product.stock} left!</span>
                ) : product.trackInventory ? (
                  <span style={{ color: 'black' }}>In Stock</span>
                ) : (
                  <span style={{ color: 'black' }}>Made to Order</span>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.addToCartBtn}
                  onClick={() => addToCart(product)}
                  disabled={stockStatus === 'out'}
                  style={stockStatus === 'out' ? { background: '#ccc', cursor: 'not-allowed' } : {}}
                >
                  {stockStatus === 'out' ? 'Unavailable' : 'Add to Cart'}
                </button>
                <button
                  className={`${styles.wishlistBtn} ${isWished ? styles.wished : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                >
                  {isWished ? '♥' : '♡'}
                </button>
              </div>

              <div className={styles.description}>
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Reviews Section */}
      <Section spacing="large" background="white" className={styles.reviewContainer}>
        <Container width="narrow">
          <div className={styles.reviewsTitleContainer}>
            <h2 className={styles.reviewsTitleCursive}>Customer Reviews</h2>
          </div>

          <div className={styles.reviewsSummaryLayout}>
            {/* Left Col: Average summary */}
            <div className={styles.reviewSummaryLeft}>
              <div className={styles.reviewSummaryStars}>
                 {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} style={{ color: star <= Math.round(reviewsAvg) ? 'red' : '#d1d5db', fontSize: '18px' }}>★</span>
                 ))}
              </div>
              <p className={styles.reviewSummaryAvgText}>{Number(reviewsAvg).toFixed(2)} Out Of 5</p>
              <p className={styles.reviewSummaryBasedText}>Based On {reviewsCount} Review{reviewsCount !== 1 ? 's' : ''}</p>
            </div>

            {/* Middle Col: Distribution */}
            <div className={styles.reviewSummaryMiddle}>
              {[5, 4, 3, 2, 1].map(ratingValue => {
                const count = reviews.filter(r => r.rating === ratingValue).length;
                const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
                return (
                  <div key={ratingValue} className={styles.distributionRow}>
                    <div className={styles.distributionStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ color: star <= ratingValue ? 'red' : '#d1d5db', fontSize: '12px' }}>★</span>
                      ))}
                    </div>
                    <div className={styles.distributionBarContainer}>
                      <div className={styles.distributionBarFill} style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className={styles.distributionCount}>{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Write Review Button */}
            <div className={styles.reviewSummaryRight}>
              <button className={styles.writeReviewBlackBtn} onClick={() => setReviewFormOpen(!reviewFormOpen)}>
                {reviewFormOpen ? 'Cancel Review' : 'Write A Review'}
              </button>
            </div>
          </div>

          {reviewFormOpen && (
            <form onSubmit={submitReview} className={styles.reviewForm}>
              <div className={styles.formGroup}>
                <label>Rating</label>
                <select value={reviewForm.rating} onChange={e => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Title (Optional)</label>
                <input type="text" value={reviewForm.title} onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Summarize your experience" />
              </div>
              <div className={styles.formGroup}>
                <label>Comment</label>
                <textarea required rows="4" value={reviewForm.comment} onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} placeholder="Tell us what you thought about this product"></textarea>
              </div>
              <button type="submit" className={styles.submitReviewBtn}>Submit Review</button>
            </form>
          )}

          <div className={styles.reviewsToolbar}>
            <select className={styles.reviewsSortSelect}>
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>
          
          <hr className={styles.reviewsDivider} />

          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <p className={styles.noReviews}>No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className={styles.zaraReviewItem}>
                  <div className={styles.zaraReviewHeader}>
                    <div className={styles.zaraReviewStars}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ color: star <= review.rating ? 'red' : '#d1d5db', fontSize: '14px' }}>★</span>
                      ))}
                    </div>
                    <span className={styles.zaraReviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className={styles.zaraReviewAuthorBlock}>
                    <div className={styles.authorIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className={styles.zaraReviewAuthor}>{review.customer?.name}</span>
                    <span className={styles.verifiedBadge}>Verified</span>
                  </div>
                  
                  {review.title && <h4 className={styles.zaraReviewTitle}>{review.title}</h4>}
                  <p className={styles.zaraReviewComment}>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section spacing="large" background="lightGray">
          <Container width="wide">
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map(rel => (
                <div key={rel.id} className={styles.relatedCard} onClick={() => navigate(`/shop/${rel.slug}`)}>
                  <div className={styles.relatedImageWrapper}>
                    <img src={getImageUrl(rel.image)} alt={rel.name} />
                  </div>
                  <h4 className={styles.relatedName}>{rel.name}</h4>
                  <p className={styles.relatedPrice}>${parseFloat(rel.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
