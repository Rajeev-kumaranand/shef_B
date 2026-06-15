import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../hooks/useApi.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import Skeleton from '../common/Skeleton.jsx';
import styles from './Footer.module.css';
import Logo from "../../assets/logo.png"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: navData, loading: navLoading } = useNavigation();
  const { settings, loading: settingsLoading } = useSettings();

  // Extract link columns from navigationData dynamically
  const navColumns = navData ? navData.filter(nav => nav.items && nav.items.length > 0) : [];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Large Brand Logo Section */}
        <motion.div 
          className={styles.brandSection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {settingsLoading ? (
            <Skeleton width="200px" height="64px" />
          ) : (
            <>
              {settings?.logoImage ? (
                <img src={Logo} alt={settings.siteName} className={styles.logo} />
              ) : (
                <img src={Logo} alt="shef&B" className={styles.fallbackLogo} />
              )}
              {settings?.siteTagline && (
                <p className={styles.tagline}>{settings.siteTagline}</p>
              )}
            </>
          )}
        </motion.div>

        <div className={styles.mainContent}>
          {/* Navigation Links */}
          <div className={styles.navGrid}>
            {navLoading ? (
              <Skeleton width="100%" height="200px" />
            ) : (
              navColumns.map((col, idx) => (
                <motion.div 
                  key={col.id} 
                  className={styles.navColumn}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                >
                  <h3 className={styles.columnTitle}>{col.label}</h3>
                  <ul className={styles.linkList}>
                    {col.items.flatMap(item => item.links || []).map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <motion.div 
                          whileHover={{ x: 8 }} 
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <Link to={link.path} className={styles.navLink}>
                            {link.label}
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))
            )}
          </div>

          {/* Contact Information */}
          <motion.div 
            className={styles.contactSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <h3 className={styles.columnTitle}>Contact</h3>
            <div className={styles.contactInfo}>
              {settingsLoading ? (
                <Skeleton width="150px" height="80px" />
              ) : (
                <>
                  {settings?.contactEmail && (
                    <motion.a 
                      href={`mailto:${settings.contactEmail}`} 
                      className={styles.contactLink}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {settings.contactEmail}
                    </motion.a>
                  )}
                  {settings?.contactPhone && (
                    <motion.a 
                      href={`tel:${settings.contactPhone}`} 
                      className={styles.contactLink}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {settings.contactPhone}
                    </motion.a>
                  )}
                  {settings?.contactAddress && (
                    <address className={styles.address}>
                      {settings.contactAddress}
                    </address>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Socials and Copyright */}
        <motion.div 
          className={styles.bottomSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className={styles.socials}>
            {!settingsLoading && ['Instagram', 'Pinterest', 'Youtube', 'Linkedin', 'Facebook', 'Twitter'].map((platform) => {
              const key = `social${platform}`;
              const url = settings?.[key];
              if (!url) return null;
              return (
                <motion.a 
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ textTransform: 'capitalize' }}
                >
                  {platform}
                </motion.a>
              );
            })}
          </div>
          
          <div className={styles.copyright}>
            {settingsLoading ? (
              <Skeleton width="200px" height="16px" />
            ) : (
              settings?.footerCopyrightText || `© ${currentYear} ${settings?.siteName || 'shef&B'}. All rights reserved.`
            )}
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
