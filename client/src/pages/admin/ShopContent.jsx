import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getShopContent, updateShopContent } from '../../services/api/shopApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function ShopContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getShopContent();
      if (res.success && res.data) {
        const formattedData = {
          ...res.data,
          heroDescription: deserializeField(res.data.heroDescription),
          featuredItems: deserializeField(res.data.featuredItems),
          products: deserializeField(res.data.products),
          storyParagraphs: deserializeField(res.data.storyParagraphs)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load shop content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        heroDescription: serializeField(data.heroDescription),
        featuredItems: serializeField(data.featuredItems),
        products: serializeField(data.products),
        storyParagraphs: serializeField(data.storyParagraphs)
      };
      await updateShopContent(payload);
      toast.success('Shop content updated');
    } catch (err) {
      toast.error('Failed to update shop content');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          
          <AdminCard title="Hero Section">
            <AdminFormField label="Title" {...register('heroTitle')} />
            <AdminFormField label="Subtitle" {...register('heroSubtitle')} />
            <DynamicListField
              name="heroDescription"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Hero Paragraphs" itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
            <AdminFormField label="Hero Image URL" {...register('heroImage')} />
          </AdminCard>

          <AdminCard title="Featured Items">
            <AdminFormField label="Heading" {...register('featuredTitle')} />
            <DynamicListField
              name="featuredItems"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Featured Items List" itemLabel="Item"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'image', type: 'media', label: 'Image' },
                { name: 'link', type: 'text', label: 'Link Path' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Products Grid">
            <DynamicListField
              name="products"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Products" itemLabel="Product"
              schema={[
                { name: 'name', type: 'text', label: 'Name' },
                { name: 'category', type: 'text', label: 'Category' },
                { name: 'price', type: 'text', label: 'Price' },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'image', type: 'media', label: 'Image' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Story Section">
            <AdminFormField label="Heading" {...register('storyTitle')} />
            <DynamicListField
              name="storyParagraphs"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Story Paragraphs" itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <AdminCard title="Call to Action (CTA)">
            <AdminFormField label="Title" {...register('ctaTitle')} />
            <AdminFormField label="Description" type="textarea" {...register('ctaDescription')} />
            <AdminFormField label="Button Text" {...register('ctaButtonText')} />
            <AdminFormField label="Link Path" {...register('ctaLink')} />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
