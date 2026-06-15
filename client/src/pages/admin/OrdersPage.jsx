import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../services/api/orderApi.js';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import ErrorState from '../../components/admin/states/ErrorState.jsx';
import styles from './OrdersPage.module.css';

const STATUS_OPTIONS = [
  'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    try {
      const res = await updateOrderStatus(selectedOrder.id, { 
        orderStatus: statusUpdate,
        trackingNumber: trackingNumber || undefined,
        estimatedDeliveryDate: estimatedDeliveryDate || undefined
      });
      if (res.success) {
        setOrders(orders.map(o => o.id === selectedOrder.id ? res.data : o));
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return <LoadingState message="Loading orders..." />;
  if (error) return <ErrorState message={error} onRetry={fetchOrders} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
      </header>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>No orders yet.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.customerName}<br/>
                    <small className={styles.textMuted}>{order.customerPhone}</small>
                  </td>
                  <td>${parseFloat(order.total).toFixed(2)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[`badge-${order.orderStatus}`] || styles.badgeDefault}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => {
                        setSelectedOrder(order);
                        setStatusUpdate(order.orderStatus);
                      }}
                    >
                      View & Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Details & Status Update */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Order {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div>
                  <h4>Customer Info</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                  <p>{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <h4>Shipping Address</h4>
                  <p>{selectedOrder.addressLine1}</p>
                  {selectedOrder.addressLine2 && <p>{selectedOrder.addressLine2}</p>}
                  <p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p>
                </div>
              </div>

              <div className={styles.itemsSection}>
                <h4>Items</h4>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                      <span>{item.quantity}x {item.productName}</span>
                      <span>${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.totals}>
                  <p>Subtotal: ${parseFloat(selectedOrder.subtotal).toFixed(2)}</p>
                  <p>Shipping: ${parseFloat(selectedOrder.shipping).toFixed(2)}</p>
                  <p><strong>Total: ${parseFloat(selectedOrder.total).toFixed(2)}</strong></p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className={styles.notesSection}>
                  <h4>Customer Notes</h4>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              <div className={styles.statusSection}>
                <h4>Update Status & Tracking</h4>
                <div className={styles.trackingForm}>
                  <div className={styles.inputGroup}>
                    <label>Tracking Number</label>
                    <input 
                      type="text" 
                      value={trackingNumber} 
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className={styles.input}
                      placeholder="e.g. FEDEX-123456"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Estimated Delivery</label>
                    <input 
                      type="date" 
                      value={estimatedDeliveryDate} 
                      onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.statusForm}>
                  <select 
                    value={statusUpdate} 
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className={styles.select}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button 
                    className={styles.updateBtn}
                    onClick={handleStatusUpdate}
                  >
                    Save Updates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
