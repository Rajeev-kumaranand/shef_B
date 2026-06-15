import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getLatestContent, updateLatestContent } from '../../services/api/latestApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function LatestContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getLatestContent();
      if (res.success && res.data) {
        const formattedData = {
          ...res.data,
          heroDescription: deserializeField(res.data.heroDescription),
          featuredArticle: deserializeField(res.data.featuredArticle),
          articles: deserializeField(res.data.articles),
          highlightsTopics: deserializeField(res.data.highlightsTopics)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load latest content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        heroDescription: serializeField(data.heroDescription),
        featuredArticle: serializeField(data.featuredArticle),
        articles: serializeField(data.articles),
        highlightsTopics: serializeField(data.highlightsTopics)
      };
      await updateLatestContent(payload);
      toast.success('Latest content updated');
    } catch (err) {
      toast.error('Failed to update latest content');
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
          </AdminCard>

          <AdminCard title="Featured Article">
            <DynamicListField
              name="featuredArticle"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Featured Article (Max 1 usually)" itemLabel="Article"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
                { name: 'date', type: 'text', label: 'Date' },
                { name: 'image', type: 'media', label: 'Image' },
                { name: 'link', type: 'text', label: 'Link' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Articles Grid">
            <DynamicListField
              name="articles"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Articles" itemLabel="Article"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
                { name: 'date', type: 'text', label: 'Date' },
                { name: 'image', type: 'media', label: 'Image' },
                { name: 'link', type: 'text', label: 'Link' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Highlights Section">
            <AdminFormField label="Heading" {...register('highlightsTitle')} />
            <DynamicListField
              name="highlightsTopics"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Topics" itemLabel="Topic"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'description', type: 'textarea', label: 'Description' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Newsletter CTA">
            <AdminFormField label="Title" {...register('newsletterTitle')} />
            <AdminFormField label="Description" type="textarea" {...register('newsletterDescription')} />
            <AdminFormField label="Button Text" {...register('newsletterCta')} />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
