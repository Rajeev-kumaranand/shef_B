import { forwardRef, useState, useEffect, useRef } from 'react';
import MediaPickerModal from './MediaPickerModal.jsx';
import styles from './AdminFormField.module.css';

const AdminFormField = forwardRef(({ label, type = 'text', placeholder, options, rows = 3, ...rest }, ref) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const inputRef = useRef(null);

  // Wrap the forwarded ref so we can access the DOM node locally
  const setRefs = (element) => {
    inputRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  // Sync preview with DOM input value (catches react-hook-form updates, typing, and pasting)
  useEffect(() => {
    if (type === 'media') {
      const interval = setInterval(() => {
        if (inputRef.current && inputRef.current.value !== previewUrl) {
          setPreviewUrl(inputRef.current.value);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [type, previewUrl]);

  const handleMediaSelect = (url) => {
    if (inputRef.current) {
      inputRef.current.value = url;
    }
    setPreviewUrl(url);
    // Trigger onChange for react-hook-form
    if (rest.onChange) {
      rest.onChange({
        target: { name: rest.name, value: url }
      });
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={styles.input}
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          {...rest}
        />
      ) : type === 'select' ? (
        <select className={styles.input} ref={ref} {...rest}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'media' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className={styles.input}
              ref={setRefs}
              placeholder={placeholder}
              {...rest}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button 
              type="button" 
              onClick={() => setIsMediaModalOpen(true)} 
              style={{ padding: '0.75rem 1rem', background: 'var(--brand-black)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', fontWeight: 600, height: '100%' }}
            >
              Gallery
            </button>
          </div>
          {previewUrl && (
            <div style={{ marginTop: '0.25rem' }}>
              <img 
                src={getImageUrl(previewUrl)} 
                alt="Preview" 
                style={{ height: '60px', width: 'auto', borderRadius: '4px', border: '1px solid var(--border-color)', objectFit: 'contain' }}
              />
            </div>
          )}
          <MediaPickerModal 
            isOpen={isMediaModalOpen} 
            onClose={() => setIsMediaModalOpen(false)} 
            onSelect={handleMediaSelect} 
          />
        </div>
      ) : (
        <input
          type={type}
          className={styles.input}
          ref={ref}
          placeholder={placeholder}
          {...rest}
        />
      )}
    </div>
  );
});

AdminFormField.displayName = 'AdminFormField';

export default AdminFormField;
