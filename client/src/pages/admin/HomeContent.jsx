import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getHomeContent, updateHomeContent } from '../../services/api/homeApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const res = await getHomeContent();
      if (res.success && res.data) {
        // Deserialize JSON strings to arrays for the dynamic lists
        const formattedData = {
          ...res.data,
          storyDescription: deserializeField(res.data.storyDescription),
          founderDescription: deserializeField(res.data.founderDescription),
          experienceDescription: deserializeField(res.data.experienceDescription)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load home content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Serialize arrays back to JSON strings for DB
      const payload = {
        ...data,
        storyDescription: serializeField(data.storyDescription),
        founderDescription: serializeField(data.founderDescription),
        experienceDescription: serializeField(data.experienceDescription)
      };
      
      await updateHomeContent(payload);
      toast.success('Home content updated');
    } catch (err) {
      toast.error('Failed to update home content');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          <AdminCard title="Hero Section">
            <AdminFormField label="Hero Title" {...register('heroTitle')} />
            <AdminFormField label="Hero Subtitle" {...register('heroTagline')} />
          </AdminCard>
          
          <AdminCard title="Story Section">
            <AdminFormField label="Story Heading" {...register('storyTitle')} />
            <DynamicListField
              name="storyDescription"
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              title="Story Paragraphs"
              itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <AdminCard title="Founder Section">
            <AdminFormField label="Founder Heading" {...register('founderTitle')} />
            <DynamicListField
              name="founderDescription"
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              title="Founder Bio Paragraphs"
              itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <AdminCard title="Experience Section">
            <AdminFormField label="Experience Heading" {...register('experienceTitle')} />
            <DynamicListField
              name="experienceDescription"
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              title="Experience Paragraphs"
              itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
