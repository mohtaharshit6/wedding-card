'use client';

import React, { useState, useEffect } from 'react';

interface Submission {
  id: string;
  guest_name: string;
  contact: string;
  attending_status: string;
  guest_count: number;
  meal_preference: string;
  message: string;
  submitted_at: string;
}

export default function AdminRsvpPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');

  const fetchRsvps = async () => {
    try {
      const res = await fetch('/api/rsvp');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch RSVPs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  const filtered = submissions.filter((s) => {
    if (filter === 'attending') return s.attending_status === 'Joyfully accepts';
    if (filter === 'declined') return s.attending_status === 'Regretfully declines';
    return true;
  });

  const totalAttendees = submissions
    .filter((s) => s.attending_status === 'Joyfully accepts')
    .reduce((acc, s) => acc + (s.guest_count || 1), 0);

  const exportCSV = () => {
    if (submissions.length === 0) {
      alert('No RSVP submissions to export yet.');
      return;
    }

    const headers = ['Name', 'Contact', 'Status', 'Guests', 'Meal Preference', 'Message', 'Date'];
    const rows = submissions.map((s) => [
      `"${s.guest_name.replace(/"/g, '""')}"`,
      `"${(s.contact || '').replace(/"/g, '""')}"`,
      `"${s.attending_status}"`,
      s.guest_count,
      `"${s.meal_preference || ''}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
      `"${new Date(s.submitted_at).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'madhav-ritika-wedding-rsvp.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">RSVP Responses &amp; Guest Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real guest responses submitted directly from the wedding website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchRsvps}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2"
          >
            <span>⬇</span> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-zinc-400 uppercase font-medium">Total Responses</p>
          <p className="text-2xl font-bold text-white mt-1">{submissions.length}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-emerald-400 uppercase font-medium">Joyfully Attending</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {submissions.filter((s) => s.attending_status === 'Joyfully accepts').length}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{totalAttendees} confirmed guests</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-rose-400 uppercase font-medium">Regretfully Declined</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">
            {submissions.filter((s) => s.attending_status === 'Regretfully declines').length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('attending')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'attending' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Attending ({submissions.filter((s) => s.attending_status === 'Joyfully accepts').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('declined')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'declined' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Declined ({submissions.filter((s) => s.attending_status === 'Regretfully declines').length})
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Guest</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Guests</th>
                <th className="py-3.5 px-6">Meal</th>
                <th className="py-3.5 px-6">Message</th>
                <th className="py-3.5 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    Loading responses…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    No RSVP submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">
                      {s.guest_name}
                      {s.contact && (
                        <span className="block text-xs font-normal text-zinc-400">{s.contact}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          s.attending_status === 'Joyfully accepts'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {s.attending_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-mono text-xs">{s.guest_count}</td>
                    <td className="py-4 px-6 text-zinc-400 text-xs">{s.meal_preference || '—'}</td>
                    <td className="py-4 px-6 text-zinc-300 text-xs max-w-xs truncate" title={s.message}>
                      {s.message || '—'}
                    </td>
                    <td className="py-4 px-6 text-zinc-500 text-xs text-right whitespace-nowrap">
                      {new Date(s.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
