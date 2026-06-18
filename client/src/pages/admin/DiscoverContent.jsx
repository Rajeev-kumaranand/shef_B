import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getDiscoverContent, updateDiscoverContent } from '../../services/api/discoverApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function DiscoverContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDiscoverContent();
      if (res.success && res.data) {
        const formattedData = {
          ...res.data,
          heroDescription: deserializeField(res.data.heroDescription),
          philosophyParagraphs: deserializeField(res.data.philosophyParagraphs),
          craftsmanshipItems: deserializeField(res.data.craftsmanshipItems),
          valuesCards: deserializeField(res.data.valuesCards),
          galleryImages: deserializeField(res.data.galleryImages)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load discover content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        heroDescription: serializeField(data.heroDescription),
        philosophyParagraphs: serializeField(data.philosophyParagraphs),
        craftsmanshipItems: serializeField(data.craftsmanshipItems),
        valuesCards: serializeField(data.valuesCards),
        galleryImages: serializeField(data.galleryImages)
      };
      await updateDiscoverContent(payload);
      toast.success('Discover content updated');
    } catch (err) {
      toast.error('Failed to update discover content');
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
            <AdminFormField type="media" label="Hero Image URL" {...register('heroImage')} />
          </AdminCard>

          <AdminCard title="Philosophy Section">
            <AdminFormField label="Heading" {...register('philosophyHeading')} />
            <DynamicListField
              name="philosophyParagraphs"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Philosophy Paragraphs" itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <AdminCard title="Craftsmanship Section">
            <AdminFormField label="Heading" {...register('craftsmanshipTitle')} />
            <AdminFormField type="media" label="Image URL" {...register('craftsmanshipImage')} />
            <DynamicListField
              name="craftsmanshipItems"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Craftsmanship Items" itemLabel="Item"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'description', type: 'textarea', label: 'Description' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Values Section">
            <AdminFormField label="Heading" {...register('valuesTitle')} />
            <DynamicListField
              name="valuesCards"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Values Cards" itemLabel="Card"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'icon', type: 'media', label: 'Icon / Image' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Gallery Section">
            <AdminFormField label="Heading" {...register('galleryTitle')} />
            <DynamicListField
              name="galleryImages"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Gallery Images" itemLabel="Image"
              schema={[
                { name: 'url', type: 'media', label: 'Image' },
                { name: 'caption', type: 'text', label: 'Caption' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Call to Action (CTA)">
            <AdminFormField label="Title" {...register('ctaTitle')} />
            <AdminFormField label="Button Text" {...register('ctaButtonText')} />
            <AdminFormField label="Link Path" {...register('ctaLink')} />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
