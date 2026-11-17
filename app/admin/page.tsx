import { getWeddingBySlug } from '@/lib/data/wedding';
import WeddingEditorForm from '@/components/admin/WeddingEditorForm';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const data = await getWeddingBySlug('madhav-ritika', true);

  let rsvps = [];
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'rsvps.json'), 'utf8');
    rsvps = JSON.parse(raw);
  } catch {
    rsvps = [];
  }

  const attendingCount = rsvps.filter((r: any) => r.attending_status === 'Joyfully accepts').length;
  const guestCount = rsvps.reduce((acc: number, r: any) => acc + (r.guest_count || 1), 0);

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Wedding data not found. Please verify data/wedding.json exists.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Couple Site</p>
            <p className="text-xl font-bold text-white mt-1">
              {data.wedding.couple_name1} &amp; {data.wedding.couple_name2}
            </p>
            <Link
              href={`/${data.wedding.slug}`}
              target="_blank"
              className="text-xs text-amber-400 hover:underline mt-1 inline-block"
            >
              View Live Website ↗
            </Link>
          </div>
          <span className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-serif text-lg">
            ✦
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-400 font-medium">Joyfully Attending</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{attendingCount}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{guestCount} total guests confirmed</p>
          </div>
          <span className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
            ✓
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Guest Management</p>
            <p className="text-2xl font-bold text-white mt-1">{rsvps.length} Submissions</p>
            <Link
              href="/admin/rsvp"
              className="text-xs text-amber-400 hover:underline mt-0.5 inline-block"
            >
              Manage &amp; Export CSV &rarr;
            </Link>
          </div>
          <span className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg">
            📋
          </span>
        </div>
      </div>

      {/* Main Single-Couple Editor Form */}
      <WeddingEditorForm initialData={data} />
    </div>
  );
}
