import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminTopbar from '../components/admin/AdminTopbar.jsx';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);
  
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);
  
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <div className={styles.layout}>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={styles.mainWrapper}>
        <AdminTopbar title={getPageTitle()} onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.mainContent} ref={mainRef} data-lenis-prevent>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
