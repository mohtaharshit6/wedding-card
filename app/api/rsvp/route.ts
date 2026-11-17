import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const RSVPS_FILE = path.join(process.cwd(), 'data', 'rsvps.json');

export async function GET() {
  try {
    const raw = await fs.readFile(RSVPS_FILE, 'utf8');
    const submissions = JSON.parse(raw);
    return NextResponse.json(submissions);
  } catch (err: any) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wedding_id,
      guest_name,
      contact,
      attending_status,
      guest_count,
      meal_preference,
      message,
    } = body;

    if (!guest_name || !attending_status) {
      return NextResponse.json(
        { error: 'Missing required fields (guest name and attendance status)' },
        { status: 400 }
      );
    }

    let list = [];
    try {
      const raw = await fs.readFile(RSVPS_FILE, 'utf8');
      list = JSON.parse(raw);
    } catch {
      list = [];
    }

    const newSubmission = {
      id: 'rsvp_' + Date.now(),
      wedding_id: wedding_id || 'madhav-ritika-wedding',
      guest_name: guest_name.trim(),
      contact: contact ? contact.trim() : '',
      attending_status,
      guest_count: Number(guest_count) || 1,
      meal_preference: meal_preference || 'No preference',
      message: message ? message.trim() : '',
      submitted_at: new Date().toISOString(),
    };

    list.unshift(newSubmission);

    await fs.writeFile(RSVPS_FILE, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json({ success: true, data: newSubmission });
  } catch (err: any) {
    console.error('RSVP submission error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
