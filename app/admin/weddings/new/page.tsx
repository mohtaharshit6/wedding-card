import WeddingEditorForm from '@/components/admin/WeddingEditorForm';
import { getWeddingBySlug } from '@/lib/data/wedding';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewWeddingPage() {
  const data = await getWeddingBySlug('madhav-ritika', true);

  if (!data) {
    notFound();
  }

  return <WeddingEditorForm initialData={data} />;
}
