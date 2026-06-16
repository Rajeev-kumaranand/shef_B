import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { createOrder } from '../services/api/orderApi.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer } = useCustomerAuth();
  const { settings } = useSettings();
  
  const [loading, setLoading] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  useEffect(() => {
    if (customer) {
      const defaultAddress = customer.addresses?.find(a => a.isDefault) || customer.addresses?.[0];
      setFormData(prev => ({
        ...prev,
        customerName: customer.name || '',
        customerEmail: customer.email || '',
        customerPhone: customer.phone || '',
        addressLine1: defaultAddress?.addressLine1 || '',
        addressLine2: defaultAddress?.addressLine2 || '',
        city: defaultAddress?.city || '',
        state: defaultAddress?.state || '',
        pincode: defaultAddress?.pincode || '',
      }));
    }
  }, [customer]);

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    navigate('/shop');
    return null;
  }

  const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
  
  // Calculate dynamic shipping
  let shipping = 0;
  if (settings && subtotalAfterDiscount > 0) {
    if (settings.freeShippingThreshold > 0 && subtotalAfterDiscount >= settings.freeShippingThreshold) {
      shipping = 0;
    } else {
      shipping = parseFloat(settings.flatShippingCost) || 0;
    }
  }

  // Calculate tax
  const taxPercentage = settings?.taxPercentage || 0;
  const taxAmount = (subtotalAfterDiscount * taxPercentage) / 100;

  const total = subtotalAfterDiscount + shipping + taxAmount;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/coupons/validate`, {
        code: couponCodeInput.toUpperCase(),
        subtotal: cartTotal
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.data.code);
        setDiscountAmount(res.data.data.discount);
        toast.success('Coupon applied!');
        setCouponCodeInput('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      ...formData,
      customerId: customer?.id || undefined,
      subtotal: cartTotal,
      discount: discountAmount,
      couponCode: appliedCoupon || undefined,
      shipping: shipping,
      tax: taxAmount,
      total: total,
      items: cartItems
    };

    try {
      const res = await createOrder(orderData);
      if (res.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${res.data.orderNumber}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

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
          <SectionTitle title="Checkout" alignment="left" />
          
          <div className={styles.grid}>
            {/* Form Column */}
            <div className={styles.formColumn}>
              <form onSubmit={handleSubmit} className={styles.form}>
                
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Contact Information</h3>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email (Optional)</label>
                      <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Shipping Address</h3>
                  <div className={styles.formGroup}>
                    <label>Address Line 1</label>
                    <input type="text" name="addressLine1" required value={formData.addressLine1} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Address Line 2 (Optional)</label>
                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>State</label>
                      <input type="text" name="state" required value={formData.state} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Pincode</label>
                      <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Additional Notes</h3>
                  <div className={styles.formGroup}>
                    <label>Order Notes (Optional)</label>
                    <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Payment Method</h3>
                  {settings?.codEnabled && (
                    <div className={styles.paymentMethod}>
                      <label className={styles.radioLabel}>
                        <input type="radio" name="payment" checked readOnly />
                        <span>Cash on Delivery (COD)</span>
                      </label>
                    </div>
                  )}
                  {settings?.onlinePaymentEnabled && (
                    <div className={`${styles.paymentMethod} ${styles.disabled}`}>
                      <label className={styles.radioLabel}>
                        <input type="radio" name="payment" disabled />
                        <span>Online Payment (Razorpay Integration Coming Soon)</span>
                      </label>
                    </div>
                  )}
                  {!settings?.codEnabled && !settings?.onlinePaymentEnabled && (
                    <div style={{ color: 'var(--brand-red)', fontSize: '14px', fontFamily: 'var(--font-secondary)' }}>
                      No payment methods available. Please contact support.
                    </div>
                  )}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Summary Column */}
            <div className={styles.summaryColumn}>
              <div className={styles.summaryBox}>
                <h3 className={styles.sectionTitle}>Order Summary</h3>
                
                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <div key={item.productId} className={styles.summaryItem}>
                      <div className={styles.itemImageWrapper}>
                        <img src={getImageUrl(item.image)} alt={item.name} />
                        <span className={styles.itemBadge}>{item.quantity}</span>
                      </div>
                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.totalsList}>
                  <div className={styles.couponSection}>
                    {!appliedCoupon ? (
                      <div className={styles.couponForm}>
                        <input 
                          type="text" 
                          value={couponCodeInput} 
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          placeholder="Coupon Code"
                          className={styles.couponInput}
                        />
                        <button type="button" onClick={handleApplyCoupon} className={styles.couponBtn}>Apply</button>
                      </div>
                    ) : (
                      <div className={styles.appliedCoupon}>
                        <span>Coupon <strong>{appliedCoupon}</strong> applied</span>
                        <button type="button" onClick={handleRemoveCoupon} className={styles.removeCouponBtn}>Remove</button>
                      </div>
                    )}
                  </div>

                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className={`${styles.totalRow} ${styles.discountRow}`}>
                      <span>Discount ({appliedCoupon})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {taxAmount > 0 && (
                    <div className={styles.totalRow}>
                      <span>Tax ({taxPercentage}%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={styles.totalRow}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
