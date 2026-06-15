import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { getMyOrders } from '../../services/api/customerApi.js';
import Container from '../../components/common/Container.jsx';
import Section from '../../components/common/Section.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import styles from './Dashboard.module.css';

export default function AccountDashboard() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      navigate('/account/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customer, navigate]);

  if (!customer) return null;

  return (
    <div className={styles.page}>
      <Section spacing="large">
        <Container width="wide">
          <div className={styles.header}>
            <SectionTitle title="My Account" alignment="left" />
            <button onClick={() => { logout(); navigate('/account/login'); }} className={styles.logoutBtn}>
              Sign Out
            </button>
          </div>

          <div className={styles.grid}>
            {/* Sidebar Profile Info */}
            <div className={styles.sidebar}>
              <div className={styles.card}>
                <h3>Profile</h3>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone:</strong> {customer.phone || 'Not provided'}</p>
                <button className={styles.editBtn}>Edit Profile</button>
              </div>

              <div className={styles.card}>
                <h3>Default Address</h3>
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.filter(a => a.isDefault).map(addr => (
                    <div key={addr.id}>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.textMuted}>No addresses saved yet.</p>
                )}
                <button className={styles.editBtn}>Manage Addresses</button>
              </div>
            </div>

            {/* Main Content: Orders */}
            <div className={styles.mainContent}>
              <div className={styles.card}>
                <h3>Order History</h3>
                
                {loading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className={styles.shopBtn}>Start Shopping</Link>
                  </div>
                ) : (
                  <div className={styles.ordersList}>
                    {orders.map(order => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <h4>Order {order.orderNumber}</h4>
                            <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className={styles.orderStatusInfo}>
                            <span className={`${styles.statusBadge} ${styles[order.orderStatus] || ''}`}>
                              {order.orderStatus}
                            </span>
                            <p className={styles.orderTotal}>${parseFloat(order.total).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className={styles.orderItems}>
                          {order.items.slice(0, 3).map(item => (
                            <span key={item.id} className={styles.itemPill}>
                              {item.quantity}x {item.productName}
                            </span>
                          ))}
                          {order.items.length > 3 && <span className={styles.textMuted}>+ {order.items.length - 3} more</span>}
                        </div>

                        <div className={styles.orderActions}>
                          <Link to={`/account/orders/${order.id}`} className={styles.trackBtn}>
                            Track Order Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
