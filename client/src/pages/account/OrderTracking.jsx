import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyOrders } from '../../services/api/customerApi.js';
import Container from '../../components/common/Container.jsx';
import Section from '../../components/common/Section.jsx';
import styles from './OrderTracking.module.css';

const TIMELINE_STAGES = [
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) {
          const found = res.data.find(o => o.id === id);
          setOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (!order) return <div className={styles.page}>Order not found.</div>;

  const currentStageIndex = TIMELINE_STAGES.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  return (
    <div className={styles.page}>
      <Section spacing="large">
        <Container width="wide">
          <div className={styles.header}>
            <Link to="/account" className={styles.backBtn}>← Back to Account</Link>
            <h2>Order {order.orderNumber}</h2>
          </div>

          <div className={styles.trackingContainer}>
            {/* Timeline UI */}
            {isCancelled ? (
              <div className={styles.cancelledState}>
                <div className={styles.cancelledIcon}>×</div>
                <h3>Order Cancelled</h3>
                <p>This order has been cancelled and cannot be fulfilled.</p>
              </div>
            ) : (
              <div className={styles.timelineWrapper}>
                <div className={styles.timeline}>
                  <div 
                    className={styles.timelineProgress} 
                    style={{ width: `${(Math.max(0, currentStageIndex) / (TIMELINE_STAGES.length - 1)) * 100}%` }}
                  />
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage} className={`${styles.timelineStep} ${isCompleted ? styles.completed : ''}`}>
                        <div className={`${styles.stepIcon} ${isCurrent ? styles.current : ''}`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className={styles.stepLabel}>{stage.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Details */}
            <div className={styles.detailsGrid}>
              <div className={styles.card}>
                <h3>Tracking Information</h3>
                {order.trackingNumber ? (
                  <div className={styles.trackingInfoBox}>
                    <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                    <p><strong>Courier:</strong> Standard Shipping</p>
                    <p><strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Pending calculation'}</p>
                  </div>
                ) : (
                  <p className={styles.textMuted}>Tracking details will be updated once your order is shipped.</p>
                )}
              </div>

              <div className={styles.card}>
                <h3>Shipping Address</h3>
                <p>{order.customerName}</p>
                <p>{order.addressLine1}</p>
                {order.addressLine2 && <p>{order.addressLine2}</p>}
                <p>{order.city}, {order.state} {order.pincode}</p>
                <p>{order.customerPhone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className={styles.card}>
              <h3>Items Included</h3>
              <div className={styles.itemsList}>
                {order.items.map(item => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemQty}>{item.quantity}x</span>
                      <span className={styles.itemName}>{item.productName}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>${parseFloat(order.shipping).toFixed(2)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </div>
  );
}
