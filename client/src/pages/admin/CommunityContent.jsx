import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getCommunityContent, updateCommunityContent } from '../../services/api/communityApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function CommunityContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCommunityContent();
      if (res.success && res.data) {
        const formattedData = {
          ...res.data,
          heroDescription: deserializeField(res.data.heroDescription),
          stories: deserializeField(res.data.stories),
          testimonials: deserializeField(res.data.testimonials),
          experiences: deserializeField(res.data.experiences),
          galleryImages: deserializeField(res.data.galleryImages)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load community content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        heroDescription: serializeField(data.heroDescription),
        stories: serializeField(data.stories),
        testimonials: serializeField(data.testimonials),
        experiences: serializeField(data.experiences),
        galleryImages: serializeField(data.galleryImages)
      };
      await updateCommunityContent(payload);
      toast.success('Community content updated');
    } catch (err) {
      toast.error('Failed to update community content');
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

          <AdminCard title="Community Stories">
            <AdminFormField label="Heading" {...register('storiesTitle')} />
            <DynamicListField
              name="stories"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Stories" itemLabel="Story"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'excerpt', type: 'textarea', label: 'Excerpt' },
                { name: 'author', type: 'text', label: 'Author' },
                { name: 'image', type: 'media', label: 'Image' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Testimonials">
            <AdminFormField label="Heading" {...register('testimonialsTitle')} />
            <DynamicListField
              name="testimonials"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Testimonials" itemLabel="Testimonial"
              schema={[
                { name: 'quote', type: 'textarea', label: 'Quote' },
                { name: 'author', type: 'text', label: 'Author Name' },
                { name: 'role', type: 'text', label: 'Author Role' },
                { name: 'avatar', type: 'media', label: 'Avatar Image' }
              ]}
            />
          </AdminCard>

          <AdminCard title="Experiences">
            <AdminFormField label="Heading" {...register('experiencesTitle')} />
            <DynamicListField
              name="experiences"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Experiences" itemLabel="Experience"
              schema={[
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'image', type: 'media', label: 'Image' }
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
            <AdminFormField label="Description" type="textarea" {...register('ctaDescription')} />
            <AdminFormField label="Button Text" {...register('ctaButtonText')} />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
