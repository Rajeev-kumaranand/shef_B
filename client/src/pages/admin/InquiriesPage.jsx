import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import EmptyState from '../../components/admin/states/EmptyState.jsx';
import styles from './AdminPages.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async (search = searchQuery) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await axios.get(`${API_URL}/admin/inquiries?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const openModal = (inquiry) => {
    setSelectedInquiry({ ...inquiry }); // Clone to edit locally
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/inquiries/${selectedInquiry.id}`, {
        status: selectedInquiry.status,
        notes: selectedInquiry.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Inquiry updated');
      setIsModalOpen(false);
      fetchInquiries(); // refresh list
    } catch (err) {
      toast.error('Failed to update inquiry');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/admin/inquiries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Inquiry deleted');
        fetchInquiries();
      } catch (err) {
        toast.error('Failed to delete inquiry');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return { bg: '#fee2e2', text: '#991b1b' }; // Red
      case 'IN_PROGRESS': return { bg: '#fef3c7', text: '#92400e' }; // Yellow
      case 'CLOSED': return { bg: '#dcfce7', text: '#166534' }; // Green
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customer Inquiries</h1>
      </div>

      <div className={styles.filters} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Search by name, email, or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '400px', padding: '8px 12px', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className={styles.secondaryBtn}>Search</button>
        </form>
      </div>

      {inquiries.length === 0 ? (
        <EmptyState title="No Inquiries Found" message="Try adjusting your filters or search." />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name / Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => {
                const statusStyle = getStatusColor(inq.status);
                return (
                  <tr key={inq.id}>
                    <td style={{ fontSize: '14px' }}>
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inq.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{inq.email}</div>
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inq.subject}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        background: statusStyle.bg, 
                        color: statusStyle.text,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {inq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openModal(inq)}>View</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(inq.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedInquiry && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <h2>Inquiry Details</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>From</label>
                  <div style={{ fontWeight: 600 }}>{selectedInquiry.name}</div>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--brand-black)', textDecoration: 'underline', fontSize: '14px' }}>{selectedInquiry.email}</a>
                  {selectedInquiry.phone && <div style={{ fontSize: '14px', marginTop: '4px' }}>{selectedInquiry.phone}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Subject</label>
                  <div style={{ fontWeight: 600 }}>{selectedInquiry.subject}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-secondary)', padding: '16px', marginBottom: '24px', borderLeft: '4px solid var(--brand-black)' }}>
                <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-secondary)', lineHeight: 1.6 }}>{selectedInquiry.message}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Update Status</label>
                  <select 
                    value={selectedInquiry.status}
                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value })}
                    style={{ padding: '8px', width: '100%', border: '1px solid var(--border-color)' }}
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Internal Notes</label>
                  <textarea 
                    rows={4}
                    value={selectedInquiry.notes || ''}
                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, notes: e.target.value })}
                    placeholder="Add notes for your team (customer will not see this)..."
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-secondary)' }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={handleSaveModal} disabled={modalLoading}>
                {modalLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
