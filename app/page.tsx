import { getWeddingBySlug } from '@/lib/data/wedding';
import WeddingPageClient from '@/components/wedding/WeddingPageClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWeddingBySlug('madhav-ritika', true);
  if (!data) return { title: 'Madhav & Ritika — Wedding Invitation' };

  const { wedding } = data;
  const title = `${wedding.couple_name1} & ${wedding.couple_name2} — Wedding Invitation`;
  const description = `With the blessings of Shri Ganesh Ji, you are cordially invited to celebrate the marriage of ${wedding.couple_name1} and ${wedding.couple_name2}.`;
  const previewImage = wedding.venue_image_url || '/assets/img/ganesha.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: previewImage }],
    },
  };
}

export default async function HomePage() {
  const data = await getWeddingBySlug('madhav-ritika', true);

  if (!data) {
    notFound();
  }

  return <WeddingPageClient data={data} />;
}
