const fs = require('fs');
const path = require('path');

const models = [
  { name: 'discover', cap: 'Discover', fields: ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage', 'philosophyHeading', 'philosophyParagraphs', 'craftsmanshipTitle', 'craftsmanshipItems', 'craftsmanshipImage', 'valuesTitle', 'valuesCards', 'galleryTitle', 'galleryImages', 'ctaTitle', 'ctaButtonText', 'ctaLink'] },
  { name: 'shop', cap: 'Shop', fields: ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage', 'featuredTitle', 'featuredItems', 'products', 'storyTitle', 'storyParagraphs', 'ctaTitle', 'ctaDescription', 'ctaButtonText', 'ctaLink'] },
  { name: 'latest', cap: 'Latest', fields: ['heroTitle', 'heroSubtitle', 'heroDescription', 'featuredArticle', 'articles', 'highlightsTitle', 'highlightsTopics', 'newsletterTitle', 'newsletterDescription', 'newsletterCta'] },
  { name: 'community', cap: 'Community', fields: ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage', 'storiesTitle', 'stories', 'testimonialsTitle', 'testimonials', 'experiencesTitle', 'experiences', 'galleryTitle', 'galleryImages', 'ctaTitle', 'ctaDescription', 'ctaButtonText'] },
  { name: 'note', cap: 'Note', fields: ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage', 'letterTitle', 'letterSalutation', 'letterParagraphs', 'letterImage', 'editorialTitle', 'editorialContent', 'signatureName', 'signatureRole', 'signatureBio', 'signatureImage'] },
];

models.forEach(model => {
  const fileContent = `import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { get${model.cap}Content, update${model.cap}Content } from '../../services/api/${model.name}Api.js';
import styles from './AdminPages.module.css';

export default function ${model.cap}Content() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await get${model.cap}Content();
      if (res.success && res.data) {
        reset(res.data);
      }
    } catch (err) {
      toast.error('Failed to load ${model.name} content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await update${model.cap}Content(data);
      toast.success('${model.cap} content updated');
    } catch (err) {
      toast.error('Failed to update ${model.name} content');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
          <AdminCard title="${model.cap} Content Editor">
            ${model.fields.map(field => {
              if (field.includes('Paragraphs') || field.includes('Description') || field.includes('Items') || field.includes('Cards') || field.includes('Images') || field.includes('products') || field.includes('articles') || field.includes('stories') || field.includes('testimonials') || field.includes('experiences') || field.includes('Content')) {
                return `<AdminFormField label="${field} (JSON/Text)" type="textarea" {...register('${field}')} />`;
              }
              return `<AdminFormField label="${field}" {...register('${field}')} />`;
            }).join('\n            ')}
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(__dirname, `src/pages/admin/${model.cap}Content.jsx`), fileContent);
});

console.log('Frontend CMS Pages created.');
