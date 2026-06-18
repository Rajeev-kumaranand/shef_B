import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { getMyOrders, updateCustomerProfile, addCustomerAddress, deleteCustomerAddress, updateCustomerAddress } from '../../services/api/customerApi.js';
import Container from '../../components/common/Container.jsx';
import Section from '../../components/common/Section.jsx';
import SectionTitle from '../../components/common/SectionTitle.jsx';
import Modal from '../../components/common/Modal.jsx';
import toast from 'react-hot-toast';
import styles from './Dashboard.module.css';

export default function AccountDashboard() {
  const { customer, logout, updateCustomerData } = useCustomerAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isManageAddressOpen, setIsManageAddressOpen] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Address Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [addressLoading, setAddressLoading] = useState(false);

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

  // Open Edit Profile Modal
  const handleOpenEditProfile = () => {
    setProfileForm({ name: customer.name || '', phone: customer.phone || '' });
    setIsEditProfileOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await updateCustomerProfile(profileForm);
      if (res.success) {
        updateCustomerData(res.data);
        toast.success('Profile updated successfully');
        setIsEditProfileOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      const res = await addCustomerAddress(addressForm);
      if (res.success) {
        // Assume API returns updated customer or address
        // The customer object needs its addresses array updated. A full refetch of profile or updating context data is needed.
        // If API returns new address, we append it. Let's just update the local customer.addresses list:
        const updatedAddresses = [...(customer.addresses || []), res.data];
        updateCustomerData({ addresses: updatedAddresses });
        toast.success('Address added successfully');
        setShowAddressForm(false);
        setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await deleteCustomerAddress(id);
      if (res.success) {
        const updatedAddresses = customer.addresses.filter(a => a.id !== id);
        updateCustomerData({ addresses: updatedAddresses });
        toast.success('Address deleted');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    }
  };

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
                <button className={styles.editBtn} onClick={handleOpenEditProfile}>Edit Profile</button>
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
                <button className={styles.editBtn} onClick={() => setIsManageAddressOpen(true)}>Manage Addresses</button>
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

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profile">
        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
            <input 
              type="text" 
              value={profileForm.name} 
              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
            <input 
              type="tel" 
              value={profileForm.phone} 
              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={profileLoading}
            style={{ padding: '0.75rem', background: 'var(--brand-black)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Manage Addresses Modal */}
      <Modal isOpen={isManageAddressOpen} onClose={() => setIsManageAddressOpen(false)} title="Manage Addresses">
        {!showAddressForm ? (
          <div>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {customer.addresses.map(addr => (
                  <div key={addr.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '4px', position: 'relative' }}>
                    {addr.isDefault && <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--brand-green)', color: 'white', padding: '2px 8px', fontSize: '12px', borderRadius: '12px' }}>Default</span>}
                    <p style={{ color: 'var(--text-secondary)' }}>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p style={{ color: 'var(--text-secondary)' }}>{addr.addressLine2}</p>}
                    <p style={{ color: 'var(--text-secondary)' }}>{addr.city}, {addr.state} {addr.pincode}</p>
                    <button 
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{ marginTop: '0.5rem', background: 'transparent', color: 'var(--brand-red)', border: 'none', cursor: 'pointer', padding: '0' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No addresses found.</p>
            )}
            <button 
              onClick={() => setShowAddressForm(true)}
              style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--brand-black)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              Add New Address
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Address Line 1</label>
              <input type="text" required value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Address Line 2 (Optional)</label>
              <input type="text" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>City</label>
                <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>State</label>
                <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Pincode</label>
              <input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} />
              Set as default address
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowAddressForm(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--brand-black)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={addressLoading} style={{ flex: 1, padding: '0.75rem', background: 'var(--brand-black)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {addressLoading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
