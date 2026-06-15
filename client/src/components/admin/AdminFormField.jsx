import { forwardRef } from 'react';
import styles from './AdminFormField.module.css';

const AdminFormField = forwardRef(({ label, type = 'text', placeholder, options, rows = 3, ...rest }, ref) => {
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
