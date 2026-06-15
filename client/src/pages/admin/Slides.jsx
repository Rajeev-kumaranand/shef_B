import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import EmptyState from '../../components/admin/states/EmptyState.jsx';
import MediaPickerModal from '../../components/admin/MediaPickerModal.jsx';
import { getSlides, createSlide, updateSlide, deleteSlide } from '../../services/api/slidesApi.js';
import styles from './AdminPages.module.css';

const VITE_API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export default function Slides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  
  // Media Picker state
  const [isMediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await getSlides();
      if (res.success && res.data) {
        setSlides(res.data);
      }
    } catch (err) {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${VITE_API_BASE}${path}`;
  };

  const columns = [
    { 
      header: 'Image', 
      field: 'image', 
      render: (row) => <img src={getImageUrl(row.image)} alt={row.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> 
    },
    { header: 'Title', field: 'title' },
    { header: 'Order', field: 'order' },
    { 
      header: 'Status', 
      field: 'active', 
      render: (row) => <span style={{ color: row.active ? 'var(--brand-green)' : 'var(--text-secondary)' }}>{row.active ? 'Active' : 'Hidden'}</span> 
    }
  ];

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    reset({ title: slide.title, order: slide.order, active: slide.active ? 'true' : 'false' });
    setSelectedImage(slide.image);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSlide(null);
    reset({ title: '', order: 0, active: 'true' });
    setSelectedImage('');
    setModalOpen(true);
  };

  const handleDelete = async (slide) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      await deleteSlide(slide.id);
      toast.success('Slide deleted');
      fetchSlides();
    } catch (err) {
      toast.error('Failed to delete slide');
    }
  };

  const handleMediaSelect = (url) => {
    setSelectedImage(url);
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedImage) {
        toast.error('Please select an image from the Media Library');
        return;
      }

      const payload = {
        title: data.title,
        order: data.order,
        active: data.active,
        image: selectedImage
      };

      if (editingSlide) {
        await updateSlide(editingSlide.id, payload);
        toast.success('Slide updated');
      } else {
        await createSlide(payload);
        toast.success('Slide created');
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <AdminCard 
        title="All Slides" 
        action={<button className={styles.primaryBtn} onClick={handleAdd}>Add Slide</button>}
      >
        {slides.length === 0 ? (
          <EmptyState message="No slides found" />
        ) : (
          <AdminTable 
            columns={columns} 
            data={slides} 
            keyField="id"
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </AdminCard>

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingSlide ? 'Edit Slide' : 'Add Slide'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AdminFormField label="Title" {...register('title', { required: true })} />
          <AdminFormField label="Order" type="number" {...register('order')} />
          <AdminFormField label="Status" type="select" options={[{label: 'Active', value: 'true'}, {label: 'Hidden', value: 'false'}]} {...register('active')} />
          
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Media Image</label>
            {selectedImage ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <img src={getImageUrl(selectedImage)} alt="Selected" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                <button type="button" onClick={() => setMediaPickerOpen(true)} className={styles.secondaryBtn} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Change Image</button>
              </div>
            ) : (
              <button type="button" onClick={() => setMediaPickerOpen(true)} className={styles.secondaryBtn} style={{ padding: '0.75rem 1.5rem', border: '1px dashed var(--border-color)', background: 'var(--surface-secondary)', cursor: 'pointer', width: '100%', marginBottom: '12px' }}>
                Select Image from Library
              </button>
            )}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ marginTop: 'var(--spacing-lg)' }}>
            Save Changes
          </button>
        </form>
      </AdminModal>

      <MediaPickerModal 
        isOpen={isMediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
