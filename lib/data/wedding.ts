import fs from 'fs/promises';
import path from 'path';
import { WeddingFullData } from '@/lib/types/wedding';

const DATA_FILE = path.join(process.cwd(), 'data', 'wedding.json');

export async function getWeddingBySlug(slug: string, previewMode: boolean = false): Promise<WeddingFullData | null> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data: WeddingFullData = JSON.parse(raw);

    // Accept both madhav-ritika and ritika-madhav or current configured slug
    if (
      slug === data.wedding.slug ||
      slug === 'madhav-ritika' ||
      slug === 'ritika-madhav'
    ) {
      if (!previewMode && data.wedding.status === 'draft') {
        return null;
      }
      return data;
    }

    return data;
  } catch (err) {
    console.error('Error reading wedding data:', err);
    return null;
  }
}
