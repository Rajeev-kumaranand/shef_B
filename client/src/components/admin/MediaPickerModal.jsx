import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMediaFiles } from '../../services/api/mediaApi.js';
import AdminModal from './AdminModal.jsx';
import styles from './MediaPickerModal.module.css';

const VITE_API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await getMediaFiles();
      if (res.success) {
        setMedia(res.data);
      }
    } catch (err) {
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item.url);
    onClose();
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Select Media">
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading media...</div>
        ) : media.length === 0 ? (
          <div className={styles.empty}>No media found in library. Upload in Media Library first.</div>
        ) : (
          <div className={styles.grid}>
            {media.map((item) => (
              <div key={item.id} className={styles.mediaCard} onClick={() => handleSelect(item)}>
                <div className={styles.mediaPreview}>
                  {item.mimeType.startsWith('video') ? (
                    <video src={VITE_API_BASE + item.url} muted />
                  ) : (
                    <img src={VITE_API_BASE + item.url} alt={item.originalName} />
                  )}
                </div>
                <div className={styles.filename} title={item.originalName}>{item.originalName}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminModal>
  );
}
