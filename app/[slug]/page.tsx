import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getWeddingBySlug } from '@/lib/data/wedding';
import WeddingPageClient from '@/components/wedding/WeddingPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getWeddingBySlug(slug, true);

  if (!data) {
    return {
      title: 'Wedding Not Found',
    };
  }

  const { wedding, gallery } = data;
  const title = `${wedding.couple_name1} & ${wedding.couple_name2} — Wedding Invitation`;
  const description = `With the blessings of Shri Ganesh Ji, you are cordially invited to celebrate the marriage of ${wedding.couple_name1} and ${wedding.couple_name2}.`;
  const previewImage = wedding.venue_image_url || gallery[0]?.image_url || '/assets/img/ganesha.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `${wedding.couple_name1} & ${wedding.couple_name2}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [previewImage],
    },
  };
}

export default async function WeddingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const data = await getWeddingBySlug(slug, isPreview);

  if (!data) {
    notFound();
  }

  return <WeddingPageClient data={data} />;
}
