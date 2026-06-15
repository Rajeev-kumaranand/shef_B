import { useSettings } from '../../context/SettingsContext.jsx';
import { Link } from 'react-router-dom';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const { settings, loading } = useSettings();

  if (loading || !settings || !settings.announcementEnabled || !settings.announcementText) return null;

  return (
    <div className={styles.announcementBar}>
      <span className={styles.text}>{settings.announcementText}</span>
      {settings.announcementCtaText && settings.announcementCtaLink && (
        <Link to={settings.announcementCtaLink} className={styles.cta}>
          {settings.announcementCtaText}
        </Link>
      )}
    </div>
  );
}
