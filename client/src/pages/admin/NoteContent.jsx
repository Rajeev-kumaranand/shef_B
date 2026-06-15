import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';
import DynamicListField from '../../components/admin/DynamicListField.jsx';
import LoadingState from '../../components/admin/states/LoadingState.jsx';
import { getNoteContent, updateNoteContent } from '../../services/api/noteApi.js';
import { serializeField, deserializeField } from '../../utils/jsonFields.js';
import styles from './AdminPages.module.css';

export default function NoteContent() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getNoteContent();
      if (res.success && res.data) {
        const formattedData = {
          ...res.data,
          heroDescription: deserializeField(res.data.heroDescription),
          letterParagraphs: deserializeField(res.data.letterParagraphs),
          editorialContent: deserializeField(res.data.editorialContent)
        };
        reset(formattedData);
      }
    } catch (err) {
      toast.error('Failed to load note content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        heroDescription: serializeField(data.heroDescription),
        letterParagraphs: serializeField(data.letterParagraphs),
        editorialContent: serializeField(data.editorialContent)
      };
      await updateNoteContent(payload);
      toast.success('Note content updated');
    } catch (err) {
      toast.error('Failed to update note content');
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

          <AdminCard title="The Letter">
            <AdminFormField label="Heading" {...register('letterTitle')} />
            <AdminFormField label="Salutation" {...register('letterSalutation')} />
            <DynamicListField
              name="letterParagraphs"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Letter Paragraphs" itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
            <AdminFormField label="Letter Image URL" {...register('letterImage')} />
          </AdminCard>

          <AdminCard title="Editorial Content">
            <AdminFormField label="Heading" {...register('editorialTitle')} />
            <DynamicListField
              name="editorialContent"
              control={control} register={register} setValue={setValue} watch={watch}
              title="Editorial Paragraphs" itemLabel="Paragraph"
              schema={[{ name: 'value', type: 'textarea', label: 'Text' }]}
            />
          </AdminCard>

          <AdminCard title="Signature">
            <AdminFormField label="Name" {...register('signatureName')} />
            <AdminFormField label="Role" {...register('signatureRole')} />
            <AdminFormField label="Bio" type="textarea" {...register('signatureBio')} />
            <AdminFormField label="Signature Image URL" {...register('signatureImage')} />
          </AdminCard>

          <button type="submit" className={styles.primaryBtn} disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>Save All Changes</button>
        </div>
      </form>
    </div>
  );
}
