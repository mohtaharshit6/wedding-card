import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { WeddingFullData } from '@/lib/types/wedding';

const DATA_FILE = path.join(process.cwd(), 'data', 'wedding.json');
const CONFIG_JS_FILE = path.join(process.cwd(), 'assets', 'js', 'config.js');

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data: WeddingFullData = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read wedding data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: WeddingFullData = await req.json();

    if (!body || !body.wedding || !body.wedding.couple_name1 || !body.wedding.couple_name2) {
      return NextResponse.json({ error: 'Invalid wedding data' }, { status: 400 });
    }

    body.wedding.updated_at = new Date().toISOString();

    // 1. Save to data/wedding.json
    await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');

    // 2. Also sync to assets/js/config.js for legacy/static template compatibility
    try {
      const dateObj = new Date(body.wedding.wedding_date_time);
      const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
      ];
      const monthStr = monthNames[dateObj.getMonth()] || 'JAN';
      const dayStr = String(dateObj.getDate()).padStart(2, '0');
      const yearStr = String(dateObj.getFullYear());

      const configJsContent = `/* Auto-generated from Wedding Admin Portal */
const WEDDING = {
  couple: {
    name1: ${JSON.stringify(body.wedding.couple_name1)},
    name2: ${JSON.stringify(body.wedding.couple_name2)},
    monogram: ${JSON.stringify(body.wedding.monogram || 'M&R')},
    parents1: ${JSON.stringify(body.wedding.parents1 || '')},
    parents2: ${JSON.stringify(body.wedding.parents2 || '')},
    hashtag: ${JSON.stringify(body.wedding.hashtag || '')},
  },
  shloka: {
    line1: ${JSON.stringify(body.wedding.shloka_line1 || '')},
    line2: ${JSON.stringify(body.wedding.shloka_line2 || '')},
    line3: ${JSON.stringify(body.wedding.shloka_line3 || '')},
    blessing: ${JSON.stringify(body.wedding.blessing_text || '')},
  },
  weddingDateTime: ${JSON.stringify(body.wedding.wedding_date_time)},
  saveTheDate: { month: ${JSON.stringify(monthStr)}, day: ${JSON.stringify(dayStr)}, year: ${JSON.stringify(yearStr)} },
  gallery: ${JSON.stringify(body.gallery.map(g => ({ src: g.image_url, caption: g.caption || '', bw: Boolean(g.is_bw) })), null, 4)},
  events: ${JSON.stringify(body.events.map(e => ({
    name: e.name,
    day: e.day || '',
    date: e.date,
    time: e.time,
    image: e.image_url || '',
    description: e.description || '',
    dressCode: { label: e.dress_code_label || '', colors: e.dress_code_colors || [] },
    venue: e.venue || '',
    mapsLink: e.maps_link || '',
  })), null, 4)},
  venue: {
    name: ${JSON.stringify(body.wedding.venue_name)},
    address: ${JSON.stringify(body.wedding.venue_address)},
    image: ${JSON.stringify(body.wedding.venue_image_url || '')},
    mapsLink: ${JSON.stringify(body.wedding.venue_maps_link || '')},
  },
  rsvp: {
    provider: ${JSON.stringify(body.rsvpConfig.mode === 'whatsapp' ? 'whatsapp' : 'database')},
    whatsappNumber: ${JSON.stringify(body.rsvpConfig.whatsapp_number || '')},
    email: ${JSON.stringify(body.rsvpConfig.email || '')},
    formspreeId: "",
    googleForm: { action: "", nameField: "", attendingField: "", guestsField: "", messageField: "" },
    preferences: ${JSON.stringify(body.rsvpConfig.meal_options || [])},
  },
  footer: {
    line1: ${JSON.stringify(body.wedding.footer_line1 || '')},
    line2: ${JSON.stringify(body.wedding.footer_line2 || '')},
  },
  music: {
    src: ${JSON.stringify(body.wedding.music_url || '')},
  },
};

window.WEDDING = WEDDING;
`;
      await fs.writeFile(CONFIG_JS_FILE, configJsContent, 'utf8');
    } catch (configErr) {
      console.warn('Could not update assets/js/config.js:', configErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Wedding data saved successfully',
      savedAt: new Date().toLocaleTimeString(),
      data: body,
    });
  } catch (err: any) {
    console.error('Save wedding error:', err);
    return NextResponse.json({ error: err.message || 'Failed to save wedding data' }, { status: 500 });
  }
}
