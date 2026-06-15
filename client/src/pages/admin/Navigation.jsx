import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import EmptyState from '../../components/admin/states/EmptyState.jsx';
import { getNavigations, createNavigation, updateNavigation, deleteNavigation } from '../../services/api/navigationApi.js';
import styles from './AdminPages.module.css';

export default function Navigation() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const res = await getNavigations();
      if (res.success && res.data) {
        setNavItems(res.data);
      }
    } catch (err) {
      toast.error('Failed to load navigation items');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Label', field: 'label' },
    { header: 'Path', field: 'path' },
    { header: 'Order', field: 'order' }
  ];

  const handleEdit = (item) => {
    setEditingItem(item);
    reset({ label: item.label, path: item.path, order: item.order });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    reset({ label: '', path: '', order: 0 });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteNavigation(item.id);
      toast.success('Link deleted');
      fetchNavItems();
    } catch (err) {
      toast.error('Failed to delete link');
    }
  };

  const onSubmit = async (data) => {
    try {
      data.order = parseInt(data.order);
      if (editingItem) {
        await updateNavigation(editingItem.id, data);
        toast.success('Link updated');
      } else {
        await createNavigation(data);
        toast.success('Link created');
      }
      setModalOpen(false);
      fetchNavItems();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <AdminCard 
        title="Main Navigation" 
        action={<button className={styles.primaryBtn} onClick={handleAdd}>Add Link</button>}
      >
        {navItems.length === 0 ? (
          <EmptyState message="No navigation links found" />
        ) : (
          <AdminTable 
            columns={columns} 
            data={navItems} 
            keyField="id"
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </AdminCard>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingItem ? 'Edit Link' : 'Add Link'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AdminFormField label="Label" {...register('label', { required: true })} />
          <AdminFormField label="Path" {...register('path', { required: true })} />
          <AdminFormField label="Order" type="number" {...register('order')} />
          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ marginTop: 'var(--spacing-md)' }}>
            Save Changes
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
