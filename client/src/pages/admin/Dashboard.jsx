import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCard from '../../components/admin/AdminCard.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getSlides } from '../../services/api/slidesApi.js';
import { getNavigations } from '../../services/api/navigationApi.js';
import { getOrderStats } from '../../services/api/orderApi.js';
import { getProducts } from '../../services/api/productApi.js';
import styles from './AdminPages.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [slidesRes, navRes, orderRes, productsRes, inquiriesRes] = await Promise.all([
          getSlides().catch(() => null),
          getNavigations().catch(() => null),
          getOrderStats().catch(() => null),
          getProducts().catch(() => null),
          axios.get(`${API_URL}/admin/inquiries/stats`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
        ]);
        
        const metrics = [];
        if (orderRes?.success) {
          metrics.push(
            { label: 'Total Revenue', value: `$${parseFloat(orderRes.data.revenue || 0).toFixed(2)}` },
            { label: 'Total Orders', value: orderRes.data.totalOrders || 0 },
            { label: 'Pending Orders', value: orderRes.data.pendingOrders || 0 },
            { label: 'Delivered Orders', value: orderRes.data.deliveredOrders || 0 },
          );
        }

        if (productsRes?.success) {
          const products = productsRes.data;
          const outOfStock = products.filter(p => p.trackInventory && p.stock === 0).length;
          const lowStock = products.filter(p => p.trackInventory && p.stock > 0 && p.stock <= p.lowStockThreshold).length;
          metrics.push(
            { label: 'Out of Stock', value: outOfStock, highlight: outOfStock > 0 ? '#ef4444' : undefined },
            { label: 'Low Stock', value: lowStock, highlight: lowStock > 0 ? '#eab308' : undefined }
          );
        }
        
        metrics.push(
          { label: 'Total Slides', value: slidesRes?.data?.length || 0 },
          { label: 'Navigation Items', value: navRes?.data?.length || 0 }
        );

        if (inquiriesRes?.data?.success) {
          const inqData = inquiriesRes.data.data;
          metrics.push(
            { label: 'Total Inquiries', value: inqData.total },
            { label: 'New Inquiries', value: inqData.new, highlight: inqData.new > 0 ? '#ef4444' : undefined },
            { label: 'Open Inquiries', value: inqData.inProgress, highlight: inqData.inProgress > 0 ? '#eab308' : undefined },
            { label: 'Closed Inquiries', value: inqData.closed }
          );
        }

        setStats(metrics);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <AdminCard key={idx}>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue} style={stat.highlight ? { color: stat.highlight } : {}}>
                {stat.value !== undefined && stat.value !== null && stat.value !== '' ? stat.value : 0}
              </span>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
