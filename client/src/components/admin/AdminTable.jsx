import styles from './AdminTable.module.css';

export default function AdminTable({ columns, data, keyField = 'id', onEdit, onDelete }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th className={styles.actionsHeader}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col, idx) => (
                <td key={idx}>
                  {col.render ? col.render(row) : row[col.field]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={styles.actionsCell}>
                  {onEdit && <button className={styles.editBtn} onClick={() => onEdit(row)}>Edit</button>}
                  {onDelete && <button className={styles.deleteBtn} onClick={() => onDelete(row)}>Delete</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
