import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api/productApi.js';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import MediaPickerModal from '../../components/admin/MediaPickerModal.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import styles from './AdminPages.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Media picker states
  const [mediaPickerState, setMediaPickerState] = useState({ isOpen: false, fieldName: null });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting, errors } } = useForm();
  
  const currentImage = watch('image');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        ...product,
        price: parseFloat(product.price).toString() // Format decimal for input
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        slug: '',
        shortDesc: '',
        description: '',
        price: '',
        stock: 0,
        sku: '',
        lowStockThreshold: 5,
        trackInventory: true,
        category: '',
        featured: false,
        active: true,
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleMediaSelect = (url) => {
    if (mediaPickerState.fieldName) {
      setValue(mediaPickerState.fieldName, url, { shouldDirty: true });
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${base}${path}`;
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products Management</h1>
        <button className={styles.primaryBtn} onClick={() => handleOpenModal()}>Add Product</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>{product.category || '-'}</td>
                  <td>{product.sku || '-'}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    {product.trackInventory ? (
                      <span style={{ 
                        color: product.stock === 0 ? '#ef4444' : (product.stock <= product.lowStockThreshold ? '#eab308' : 'green'),
                        fontWeight: product.stock <= product.lowStockThreshold ? 600 : 400
                      }}>
                        {product.stock} {product.stock === 0 && '(Out)'}
                        {product.stock > 0 && product.stock <= product.lowStockThreshold && '(Low)'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Not Tracked</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: product.active ? 'var(--brand-green)' : 'var(--text-secondary)' }}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                    {product.featured && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'var(--surface-secondary)', padding: '2px 6px', borderRadius: '10px' }}>Featured</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className={styles.actionBtn} onClick={() => handleOpenModal(product)}>Edit</button>
                      <button className={`${styles.actionBtn} ${styles.dangerText}`} onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <AdminFormField label="Product Name *" {...register('name', { required: true })} />
                  {errors.name && <span className={styles.errorText}>Name is required</span>}
                  
                  <AdminFormField label="Slug (Auto-generated if empty)" {...register('slug')} />
                  
                  <AdminFormField label="Price *" type="number" step="0.01" {...register('price', { required: true })} />
                  {errors.price && <span className={styles.errorText}>Price is required</span>}
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{ flex: 1 }}>
                      <AdminFormField label="Stock" type="number" {...register('stock')} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <AdminFormField label="Low Stock Threshold" type="number" {...register('lowStockThreshold')} />
                    </div>
                  </div>

                  <AdminFormField label="SKU (Optional)" {...register('sku')} />

                  <AdminFormField label="Category" {...register('category')} />
                  
                  <div className={styles.checkbox} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <input type="checkbox" {...register('active')} /> Active
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <input type="checkbox" {...register('featured')} /> Featured
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <input type="checkbox" {...register('trackInventory')} /> Track Inventory
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Primary Image
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {currentImage ? (
                        <img src={getImageUrl(currentImage)} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                      ) : (
                        <div style={{ width: '80px', height: '80px', background: 'var(--surface-secondary)', border: '1px dashed var(--border-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Image</div>
                      )}
                      <button type="button" className={styles.secondaryBtn} onClick={() => setMediaPickerState({ isOpen: true, fieldName: 'image' })}>Select Image</button>
                    </div>
                  </div>

                  <AdminFormField label="Short Description" type="textarea" {...register('shortDesc')} />
                  <AdminFormField label="Full Description" type="textarea" {...register('description')} style={{ minHeight: '120px' }} />

                  {/* SEO Section inside Product Modal */}
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '12px', fontFamily: 'var(--font-secondary)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>SEO Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      <AdminFormField label="SEO Title" {...register('seoTitle')} />
                      <AdminFormField label="SEO Description" type="textarea" {...register('seoDescription')} />
                      <AdminFormField label="SEO Keywords" {...register('seoKeywords')} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>{editingProduct ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal 
        isOpen={mediaPickerState.isOpen}
        onClose={() => setMediaPickerState({ isOpen: false, fieldName: null })}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
