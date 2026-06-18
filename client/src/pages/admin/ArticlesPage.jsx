import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import EmptyState from '../../components/admin/states/EmptyState.jsx';
import styles from './AdminPages.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const quillModules = {
  toolbar: [
    [{ 'header': [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, catRes, authRes, tagRes] = await Promise.all([
        axios.get(`${API_URL}/magazine/articles`),
        axios.get(`${API_URL}/magazine/categories`),
        axios.get(`${API_URL}/magazine/authors`),
        axios.get(`${API_URL}/magazine/tags`)
      ]);
      setArticles(articlesRes.data.data);
      setCategories(catRes.data.data);
      setAuthors(authRes.data.data);
      setTags(tagRes.data.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    reset({ title: '', excerpt: '', content: '', status: 'DRAFT', categoryId: '', authorId: '', tagIds: [] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article) => {
    reset({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featuredImage: article.featuredImage || '',
      status: article.status,
      categoryId: article.categoryId || '',
      authorId: article.authorId || '',
      tagIds: article.tags.map(t => t.tag.id),
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      keywords: article.keywords || ''
    });
    setEditingId(article.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Make sure tags are sent
      if (data.tagIds && !Array.isArray(data.tagIds)) {
        data.tagIds = [data.tagIds];
      }

      if (editingId) {
        await axios.put(`${API_URL}/magazine/articles/${editingId}`, data, { headers });
        toast.success('Article updated');
      } else {
        await axios.post(`${API_URL}/magazine/articles`, data, { headers });
        toast.success('Article created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/magazine/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Article deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Magazine Articles</h1>
        <button className={styles.primaryBtn} onClick={openCreateModal}>New Article</button>
      </div>

      {articles.length === 0 ? (
        <EmptyState title="No Articles" message="Start publishing editorial content." onAction={openCreateModal} actionLabel="Write Article" />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td style={{ fontWeight: 500 }}>{article.title}</td>
                  <td>{article.author?.name || 'Unknown'}</td>
                  <td>{article.category?.name || 'Uncategorized'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: article.status === 'PUBLISHED' ? '#dcfce7' : '#f3f4f6', 
                      color: article.status === 'PUBLISHED' ? '#166534' : '#374151',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {article.status}
                    </span>
                  </td>
                  <td>{article.views}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEditModal(article)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(article.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px', width: '90%' }}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  <AdminFormField label="Title" {...register('title', { required: true })} />
                  <AdminFormField label="Slug (optional)" {...register('slug')} />
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-secondary)' }}>Status</label>
                      <select {...register('status')} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)' }}>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-secondary)' }}>Category</label>
                      <select {...register('categoryId')} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)' }}>
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-secondary)' }}>Author</label>
                      <select {...register('authorId')} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)' }}>
                        <option value="">Select Author...</option>
                        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <AdminFormField type="media" label="Featured Image URL" {...register('featuredImage')} />
                  <AdminFormField label="Excerpt" type="textarea" {...register('excerpt')} />
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-secondary)' }}>Content (Rich Text)</label>
                    <div style={{ background: 'white' }}>
                      <Controller
                        name="content"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" modules={quillModules} value={field.value} onChange={field.onChange} />}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '12px', fontFamily: 'var(--font-secondary)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>SEO & Meta</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      <AdminFormField label="SEO Title" {...register('metaTitle')} />
                      <AdminFormField label="SEO Description" type="textarea" {...register('metaDescription')} />
                      <AdminFormField label="Keywords" {...register('keywords')} />
                    </div>
                  </div>

                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
