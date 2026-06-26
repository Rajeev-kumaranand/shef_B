import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api/orderApi.js';
import Container from '../components/common/Container.jsx';
import Section from '../components/common/Section.jsx';
import LoadingState from '../components/admin/states/LoadingState.jsx';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrder(orderNumber);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [orderNumber]);

  if (loading) return <LoadingState />;

  if (!order) {
    return (
      <div className={styles.page}>
        <Section spacing="large">
          <Container alignment="center">
            <h2>Order Not Found</h2>
            <Link to="/shop" className={styles.btn}>Return to Shop</Link>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Section spacing="large">
        <Container width="narrow" className={styles.container}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Thank You, {order.customerName}</h1>
          <p className={styles.subtitle}>Your order has been received.</p>

          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span>Order Number</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Date</span>
              <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Total Amount</span>
              <strong>${parseFloat(order.total).toFixed(2)}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Status</span>
              <strong className={styles.statusBadge}>{order.orderStatus}</strong>
            </div>
          </div>

          <p className={styles.message}>
            We will send a confirmation email to {order.customerEmail || 'your email'} shortly with shipping updates.
          </p>

          <Link to="/shop" className={styles.btn}>Continue Shopping</Link>
        </Container>
      </Section>
    </div>
  );
}
