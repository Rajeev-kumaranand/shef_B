import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import MediaPickerModal from './MediaPickerModal.jsx';
import styles from './DynamicListField.module.css';

/**
 * A dynamic array builder for CMS forms.
 * 
 * @param {string} name - Field name in react-hook-form (e.g. 'featuredItems')
 * @param {object} control - Control object from useForm
 * @param {function} register - Register function from useForm
 * @param {function} setValue - setValue function from useForm to update media
 * @param {function} watch - watch function from useForm
 * @param {string} title - Title of the list (e.g. 'Featured Products')
 * @param {string} itemLabel - Label for individual items (e.g. 'Product')
 * @param {Array} schema - Array of field definitions: [{ name: 'title', type: 'text', label: 'Title' }]
 */
export default function DynamicListField({ name, control, register, setValue, watch, title, itemLabel, schema }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name
  });

  const [mediaPickerState, setMediaPickerState] = useState({ isOpen: false, index: null, fieldName: null });

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  const handleMediaSelect = (url) => {
    if (mediaPickerState.index !== null && mediaPickerState.fieldName) {
      setValue(`${name}.${mediaPickerState.index}.${mediaPickerState.fieldName}`, url, { shouldDirty: true });
    }
  };

  const handleAdd = () => {
    const emptyItem = schema.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {});
    append(emptyItem);
  };

  // Watch the entire array so we can preview media correctly without waiting for submit
  const formValues = watch(name) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.list}>
        {fields.length === 0 ? (
          <div className={styles.empty}>No {itemLabel.toLowerCase()}s added yet.</div>
        ) : (
          fields.map((item, index) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <span className={styles.itemLabel}>{itemLabel} #{index + 1}</span>
                <div className={styles.itemActions}>
                  <button type="button" className={styles.actionBtn} onClick={() => move(index, index - 1)} disabled={index === 0}>Up</button>
                  <button type="button" className={styles.actionBtn} onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>Down</button>
                  <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => remove(index)}>Remove</button>
                </div>
              </div>

              <div className={styles.fields}>
                {schema.map((schemaField) => {
                  const fieldName = `${name}.${index}.${schemaField.name}`;
                  const currentValue = formValues[index]?.[schemaField.name] || '';

                  return (
                    <div key={schemaField.name} className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>{schemaField.label || schemaField.name}</label>
                      
                      {schemaField.type === 'textarea' ? (
                        <textarea className={styles.textarea} {...register(fieldName)} />
                      ) : schemaField.type === 'media' ? (
                        <div className={styles.mediaSelect}>
                          {currentValue ? (
                            <img src={getImageUrl(currentValue)} alt="Preview" className={styles.mediaPreview} />
                          ) : (
                            <div className={styles.mediaPreview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>No Image</div>
                          )} 
                          <button 
                            type="button" 
                            className={styles.mediaBtn} 
                            onClick={() => setMediaPickerState({ isOpen: true, index, fieldName: schemaField.name })}
                          >
                            {currentValue ? 'Change Image' : 'Select Image'}
                          </button>
                          {currentValue && (
                            <button type="button" className={styles.actionBtn} onClick={() => setValue(fieldName, '', { shouldDirty: true })}>Clear</button>
                          )}
                        </div>
                      ) : (
                        <input type="text" className={styles.input} {...register(fieldName)} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <button type="button" className={styles.addBtn} onClick={handleAdd}>
          + Add {itemLabel}
        </button>
      </div>

      <MediaPickerModal 
        isOpen={mediaPickerState.isOpen}
        onClose={() => setMediaPickerState({ isOpen: false, index: null, fieldName: null })}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
