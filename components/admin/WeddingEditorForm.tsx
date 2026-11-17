'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WeddingFullData, EmblemType, WeddingStatus, RsvpMode, WeddingEvent, GalleryPhoto } from '@/lib/types/wedding';

interface WeddingEditorFormProps {
  initialData: WeddingFullData;
}

export default function WeddingEditorForm({ initialData }: WeddingEditorFormProps) {
  const router = useRouter();

  // Wedding details
  const [slug, setSlug] = useState(initialData.wedding.slug || 'madhav-ritika');
  const [status, setStatus] = useState<WeddingStatus>(initialData.wedding.status || 'published');
  const [name1, setName1] = useState(initialData.wedding.couple_name1 || 'Madhav');
  const [name2, setName2] = useState(initialData.wedding.couple_name2 || 'Ritika');
  const [monogram, setMonogram] = useState(initialData.wedding.monogram || 'M&R');
  const [parents1, setParents1] = useState(initialData.wedding.parents1 || 'Son of Mr. & Mrs. Daga');
  const [parents2, setParents2] = useState(initialData.wedding.parents2 || 'Daughter of Mr. & Mrs. Mohta');
  const [hashtag, setHashtag] = useState(initialData.wedding.hashtag || '#MADefoRIT');

  // Iconography
  const [emblemType, setEmblemType] = useState<EmblemType>(initialData.wedding.emblem_type || 'ganesha');
  const [emblemUrl, setEmblemUrl] = useState(initialData.wedding.emblem_url || '/assets/img/ganesha.png');
  const [hasShloka, setHasShloka] = useState(initialData.wedding.has_shloka ?? true);
  const [shloka1, setShloka1] = useState(initialData.wedding.shloka_line1 || '॥ श्री गणेशाय नमः ॥');
  const [shloka2, setShloka2] = useState(initialData.wedding.shloka_line2 || 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।');
  const [shloka3, setShloka3] = useState(initialData.wedding.shloka_line3 || 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥');
  const [blessing, setBlessing] = useState(
    initialData.wedding.blessing_text ||
    'With the blessings of Shri Ganesh Ji and our beloved families, we joyfully invite you to celebrate the marriage of'
  );

  // Date & Venue
  const [dateTime, setDateTime] = useState(initialData.wedding.wedding_date_time || '2026-07-01T17:00:00');
  const [venueName, setVenueName] = useState(initialData.wedding.venue_name || 'Rajalakshmi Kalyana Mandapam');
  const [venueAddress, setVenueAddress] = useState(initialData.wedding.venue_address || 'No. 1, Temple Road, Chennai, Tamil Nadu 600001');
  const [venueImageUrl, setVenueImageUrl] = useState(initialData.wedding.venue_image_url || '');
  const [venueMapsLink, setVenueMapsLink] = useState(initialData.wedding.venue_maps_link || '');
  const [musicUrl, setMusicUrl] = useState(initialData.wedding.music_url || '');
  const [footer1, setFooter1] = useState(initialData.wedding.footer_line1 || 'Come laugh, dance, and celebrate with us in true Bollywood style!');
  const [footer2, setFooter2] = useState(initialData.wedding.footer_line2 || 'Together, we’ll turn this real-life romance into a blockbuster we’ll never forget.');

  // Theme
  const [colorPrimary, setColorPrimary] = useState(initialData.theme.color_primary || '#6E1414');
  const [colorSecondary, setColorSecondary] = useState(initialData.theme.color_secondary || '#8E1B1B');
  const [colorAccent, setColorAccent] = useState(initialData.theme.color_accent || '#C9A24B');
  const [colorBg, setColorBg] = useState(initialData.theme.color_background || '#F6EEE0');

  // Events & Rituals
  const [events, setEvents] = useState<WeddingEvent[]>(initialData.events || []);

  // Gallery Photos
  const [gallery, setGallery] = useState<GalleryPhoto[]>(initialData.gallery || []);

  // RSVP
  const [rsvpMode, setRsvpMode] = useState<RsvpMode>(initialData.rsvpConfig.mode || 'database');
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.rsvpConfig.whatsapp_number || '919999999999');

  const [saving, setSaving] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreviewIframe, setShowPreviewIframe] = useState(false);

  // Event handlers
  const addEvent = () => {
    const newEv: WeddingEvent = {
      id: 'e_' + Date.now(),
      wedding_id: initialData.wedding.id,
      sort_order: events.length + 1,
      name: 'New Event',
      day: 'Day',
      date: 'Date',
      time: 'Time',
      image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
      description: 'Event description here.',
      dress_code_label: 'Ethnic',
      dress_code_colors: ['#F2C94C', '#E07A5F'],
      venue: venueName,
      maps_link: venueMapsLink,
    };
    setEvents([...events, newEv]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof WeddingEvent, val: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: val };
    setEvents(updated);
  };

  const addPhoto = () => {
    const newPh: GalleryPhoto = {
      id: 'g_' + Date.now(),
      wedding_id: initialData.wedding.id,
      sort_order: gallery.length + 1,
      image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      caption: 'New Memory',
      is_bw: false,
    };
    setGallery([...gallery, newPh]);
  };

  const removePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const updatePhoto = (index: number, field: keyof GalleryPhoto, val: any) => {
    const updated = [...gallery];
    updated[index] = { ...updated[index], [field]: val };
    setGallery(updated);
  };

  // Submit Handler -> SAVES DIRECTLY TO SERVER FILE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedTime(null);
    setErrorMessage('');

    const payload: WeddingFullData = {
      wedding: {
        ...initialData.wedding,
        slug: slug.trim(),
        status,
        couple_name1: name1.trim(),
        couple_name2: name2.trim(),
        monogram: monogram.trim(),
        parents1: parents1.trim(),
        parents2: parents2.trim(),
        hashtag: hashtag.trim(),
        emblem_type: emblemType,
        emblem_url: emblemUrl.trim(),
        has_shloka: hasShloka,
        shloka_line1: shloka1.trim(),
        shloka_line2: shloka2.trim(),
        shloka_line3: shloka3.trim(),
        blessing_text: blessing.trim(),
        wedding_date_time: dateTime,
        venue_name: venueName.trim(),
        venue_address: venueAddress.trim(),
        venue_image_url: venueImageUrl.trim(),
        venue_maps_link: venueMapsLink.trim(),
        music_url: musicUrl.trim(),
        footer_line1: footer1.trim(),
        footer_line2: footer2.trim(),
      },
      theme: {
        ...initialData.theme,
        color_primary: colorPrimary,
        color_secondary: colorSecondary,
        color_accent: colorAccent,
        color_background: colorBg,
      },
      events,
      gallery,
      rsvpConfig: {
        ...initialData.rsvpConfig,
        mode: rsvpMode,
        whatsapp_number: whatsappNumber.trim(),
      },
    };

    try {
      const res = await fetch('/api/wedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save changes');
      }

      const json = await res.json();
      setSavedTime(json.savedAt || new Date().toLocaleTimeString());
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Sticky Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 sticky top-16 bg-zinc-950/95 backdrop-blur z-40 py-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>💍</span>
            <span>{name1} &amp; {name2} — Wedding Card Portal</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Jo bhi edit karenge, <strong>&quot;💾 Save Changes&quot;</strong> dabate hi turant website par live update hoga!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPreviewIframe(!showPreviewIframe)}
            className="text-xs px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            {showPreviewIframe ? '✕ Close Preview' : '📱 Live Preview Frame'}
          </button>

          <Link
            href="/"
            target="_blank"
            className="text-xs px-3.5 py-2 rounded-lg border border-amber-500/50 hover:bg-amber-500/10 text-amber-400 font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Live Card</span>
            <span>↗</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="text-xs sm:text-sm px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wide transition-all shadow-md hover:-translate-y-0.5"
          >
            {saving ? 'Saving to Card…' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Instant Success Alert */}
      {savedTime && (
        <div className="p-4 bg-emerald-500/15 border-2 border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✓</span>
            <div>
              <p className="font-semibold text-white">Changes Saved Successfully at {savedTime}!</p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Aapke changes server par save ho chuke hain aur live card par update ho gaye hain.
              </p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors ml-4 shrink-0"
          >
            Check Live Card &rarr;
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Embedded Live Preview Drawer */}
      {showPreviewIframe && (
        <div className="bg-zinc-900 border-2 border-amber-500/40 rounded-2xl p-4 shadow-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-[420px] mb-2 px-1">
            <span className="text-xs font-semibold text-amber-400">Mobile Card Live Preview</span>
            <span className="text-[11px] text-zinc-500">Auto-updates after saving</span>
          </div>
          <iframe
            src="/"
            title="Live Preview"
            className="w-full max-w-[420px] h-[640px] rounded-xl border border-zinc-800 shadow-inner bg-black"
          />
        </div>
      )}

      {/* 1. Couple & Family Details */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2">
          <span>💑</span> 1. Couple &amp; Family Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Groom Name</label>
            <input
              type="text"
              required
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Bride Name</label>
            <input
              type="text"
              required
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Monogram</label>
            <input
              type="text"
              value={monogram}
              onChange={(e) => setMonogram(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Wedding Hashtag</label>
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Groom Family Line</label>
            <input
              type="text"
              value={parents1}
              onChange={(e) => setParents1(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Bride Family Line</label>
            <input
              type="text"
              value={parents2}
              onChange={(e) => setParents2(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* 2. Spiritual Blessings & Iconography */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2">
          <span>🕉️</span> 2. Emblem &amp; Blessings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Emblem Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['ganesha', 'custom', 'monogram', 'none'] as EmblemType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEmblemType(type)}
                  className={`p-3 rounded-lg border text-xs capitalize font-medium text-center transition-colors ${
                    emblemType === type
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  {type === 'ganesha' && '🕉️ Ganesha'}
                  {type === 'custom' && '🖼️ Custom Image'}
                  {type === 'monogram' && '✍️ Monogram'}
                  {type === 'none' && '🚫 None'}
                </button>
              ))}
            </div>
          </div>

          {emblemType === 'custom' && (
            <div>
              <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Custom Emblem URL</label>
              <input
                type="text"
                value={emblemUrl}
                onChange={(e) => setEmblemUrl(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
              />
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="hasShloka"
                checked={hasShloka}
                onChange={(e) => setHasShloka(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-amber-500"
              />
              <label htmlFor="hasShloka" className="text-xs uppercase font-medium text-zinc-300 cursor-pointer">
                Include Traditional Sanskrit Shloka
              </label>
            </div>

            {hasShloka && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={shloka1}
                  onChange={(e) => setShloka1(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
                />
                <input
                  type="text"
                  value={shloka2}
                  onChange={(e) => setShloka2(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
                />
                <input
                  type="text"
                  value={shloka3}
                  onChange={(e) => setShloka3(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Invitation Blessing Line</label>
            <textarea
              rows={2}
              value={blessing}
              onChange={(e) => setBlessing(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Date & Venue Details */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2">
          <span>📍</span> 3. Wedding Date &amp; Main Venue
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">
              Wedding Date &amp; Time (Drives Countdown &amp; Scratch Card)
            </label>
            <input
              type="datetime-local"
              value={dateTime.substring(0, 16)}
              onChange={(e) => setDateTime(e.target.value + ':00')}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Background Music MP3 URL</label>
            <input
              type="text"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Venue Name</label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Venue Image URL</label>
            <input
              type="text"
              value={venueImageUrl}
              onChange={(e) => setVenueImageUrl(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Venue Address</label>
            <input
              type="text"
              required
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Google Maps URL</label>
            <input
              type="text"
              value={venueMapsLink}
              onChange={(e) => setVenueMapsLink(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 4. Events & Rituals Manager */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>🎉</span> 4. Events &amp; Rituals Schedule ({events.length})
          </h2>
          <button
            type="button"
            onClick={addEvent}
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-medium transition-colors"
          >
            + Add Ritual
          </button>
        </div>

        <div className="space-y-4">
          {events.map((ev, idx) => (
            <div key={ev.id || idx} className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">Ritual #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeEvent(idx)}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors"
                >
                  ✕ Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Ritual Name</label>
                  <input
                    type="text"
                    value={ev.name}
                    onChange={(e) => updateEvent(idx, 'name', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Day &amp; Date</label>
                  <input
                    type="text"
                    value={ev.date}
                    onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={ev.time}
                    onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Venue</label>
                  <input
                    type="text"
                    value={ev.venue || ''}
                    onChange={(e) => updateEvent(idx, 'venue', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Dress Code Label</label>
                  <input
                    type="text"
                    value={ev.dress_code_label || ''}
                    onChange={(e) => updateEvent(idx, 'dress_code_label', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={ev.image_url || ''}
                    onChange={(e) => updateEvent(idx, 'image_url', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-zinc-400 mb-1">Description / Tagline</label>
                  <input
                    type="text"
                    value={ev.description || ''}
                    onChange={(e) => updateEvent(idx, 'description', e.target.value)}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Polaroid Gallery Photos */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>📷</span> 5. Forever Us Polaroid Gallery ({gallery.length})
          </h2>
          <button
            type="button"
            onClick={addPhoto}
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-medium transition-colors"
          >
            + Add Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((ph, idx) => (
            <div key={ph.id || idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">Photo #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors"
                >
                  ✕ Remove
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={ph.image_url}
                  onChange={(e) => updatePhoto(idx, 'image_url', e.target.value)}
                  className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Caption</label>
                <input
                  type="text"
                  value={ph.caption || ''}
                  onChange={(e) => updatePhoto(idx, 'caption', e.target.value)}
                  className="w-full rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id={`bw_${idx}`}
                  checked={ph.is_bw}
                  onChange={(e) => updatePhoto(idx, 'is_bw', e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-amber-500"
                />
                <label htmlFor={`bw_${idx}`} className="text-xs text-zinc-300 cursor-pointer">
                  Black &amp; White Style
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RSVP Configuration */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2">
          <span>💌</span> 6. RSVP Settings
        </h2>

        <div>
          <label className="block text-xs uppercase font-medium text-zinc-400 mb-2">RSVP Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'database', label: '1. Database', desc: 'Saves guest responses in admin panel' },
              { id: 'whatsapp', label: '2. WhatsApp', desc: 'Opens WhatsApp with guest details' },
              { id: 'disabled', label: '3. Disabled', desc: 'Hides RSVP section completely' },
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setRsvpMode(m.id as RsvpMode)}
                className={`p-3.5 rounded-lg border text-left transition-colors ${
                  rsvpMode === m.id
                    ? 'border-amber-400 bg-amber-400/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <p className="text-xs font-semibold">{m.label}</p>
                <p className="text-[11px] text-zinc-400 mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {rsvpMode === 'whatsapp' && (
          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">
              WhatsApp Number (e.g. 919999999999)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none font-mono"
            />
          </div>
        )}
      </section>

      {/* 7. Theme Color Customizer */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2">
          <span>🎨</span> 7. Theme Colors
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Primary (Maroon)</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2">
              <input
                type="color"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-zinc-300">{colorPrimary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Secondary (Red)</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2">
              <input
                type="color"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-zinc-300">{colorSecondary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Accent (Gold)</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2">
              <input
                type="color"
                value={colorAccent}
                onChange={(e) => setColorAccent(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-zinc-300">{colorAccent}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-zinc-400 mb-1.5">Background (Cream)</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2">
              <input
                type="color"
                value={colorBg}
                onChange={(e) => setColorBg(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-zinc-300">{colorBg}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="text-sm px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wide transition-all shadow-xl hover:-translate-y-0.5"
        >
          {saving ? 'Saving Changes…' : '💾 Save All Changes'}
        </button>
      </div>
    </form>
  );
}
