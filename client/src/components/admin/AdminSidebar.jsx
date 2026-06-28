import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Home Content', path: '/admin/home' },
  { label: 'Discover Content', path: '/admin/discover' },
  { label: 'Shop Content', path: '/admin/shop' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Inquiries', path: '/admin/inquiries' },
  { label: 'Coupons', path: '/admin/coupons' },
  { label: 'Reviews', path: '/admin/reviews' },
  { label: 'Latest Content', path: '/admin/latest' },
  { label: 'Community Content', path: '/admin/community' },
  { label: 'Community Reviews', path: '/admin/community-reviews' },
  { label: 'Note Content', path: '/admin/note' },
  { label: 'Media Library', path: '/admin/media' },
  { label: 'Slides', path: '/admin/slides' },
  { label: 'Navigation', path: '/admin/navigation' },
  { label: 'Company', path: '/admin/company' },
  { label: 'Contact', path: '/admin/contact' },
  { label: 'SEO Config', path: '/admin/seo' },
  { label: 'Website Settings', path: '/admin/settings' },
];

const MAGAZINE_MENU_ITEMS = [
  { label: 'Articles', path: '/admin/magazine/articles' },
  { label: 'Authors', path: '/admin/magazine/authors' },
];



export default function AdminSidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
          <span className={styles.badge}>Workspace</span>
        </div>
        <div className={styles.navScrollArea} data-lenis-prevent>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <h3 className={styles.sectionTitle}>Magazine</h3>
          </nav>
          <nav className={styles.nav}>
            {MAGAZINE_MENU_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={styles.footer}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>A</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin User</span>
              <span className={styles.userRole}>Editor</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
