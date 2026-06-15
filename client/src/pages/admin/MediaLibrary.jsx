import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getMediaFiles, uploadMediaFile, deleteMediaFile } from '../../services/api/mediaApi.js';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import styles from './MediaLibrary.module.css';

const VITE_API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
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

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        await uploadMediaFile(e.target.files[0]);
        toast.success('Media uploaded successfully');
        fetchMedia();
      } catch (err) {
        toast.error('Failed to upload media');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await deleteMediaFile(id);
      toast.success('Media deleted');
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      toast.error('Failed to delete media');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Media Library</h1>
        <button 
          className={styles.primaryBtn} 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Media'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
          accept="image/*,video/*"
        />
      </div>

      <div className={styles.uploadZone} onClick={() => fileInputRef.current?.click()}>
        <p>Drag and drop files here or click to upload</p>
      </div>

      <div className={styles.grid}>
        {media.map((item) => (
          <div key={item.id} className={styles.mediaCard}>
            <div className={styles.mediaPreview}>
              {item.mimeType.startsWith('video') ? (
                <video src={VITE_API_BASE + item.url} muted />
              ) : (
                <img src={VITE_API_BASE + item.url} alt={item.originalName} />
              )}
            </div>
            <div className={styles.mediaInfo}>
              <span className={styles.filename} title={item.originalName}>{item.originalName}</span>
              <span className={styles.filesize}>{formatSize(item.size)}</span>
              <div className={styles.actions}>
                <button type="button" className={`${styles.actionBtn} ${styles.copyBtn}`} onClick={() => copyToClipboard(item.url)}>Copy URL</button>
                <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No media found. Upload something to get started.
          </div>
        )}
      </div>
    </div>
  );
}
