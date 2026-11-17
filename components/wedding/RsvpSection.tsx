'use client';

import React, { useState } from 'react';
import { RsvpConfig, Wedding } from '@/lib/types/wedding';
import { triggerConfettiBurst } from '@/lib/utils/confetti';

interface RsvpSectionProps {
  wedding: Wedding;
  rsvpConfig: RsvpConfig;
}

export default function RsvpSection({ wedding, rsvpConfig }: RsvpSectionProps) {
  const [attending, setAttending] = useState<'Joyfully accepts' | 'Regretfully declines'>('Joyfully accepts');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [guests, setGuests] = useState(1);
  const [preference, setPreference] = useState(rsvpConfig.meal_options[0] || 'No preference');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (rsvpConfig.mode === 'disabled') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setSubmitting(true);

    if (rsvpConfig.mode === 'whatsapp') {
      const contactLine = contact ? `\nContact: ${contact}` : '';
      const msgLine = message ? `\nMessage: ${message}` : '';
      const summary = `RSVP — ${name.trim()}\nStatus: ${attending}\nGuests: ${guests}\nMeal: ${preference}${contactLine}${msgLine}`.trim();

      const phone = (rsvpConfig.whatsapp_number || '919999999999').replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(summary)}`;
      window.open(waUrl, '_blank');

      setSubmitted(true);
      triggerConfettiBurst(undefined, undefined, 140);
      setSubmitting(false);
      return;
    }

    // Database mode
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          guest_name: name.trim(),
          contact: contact.trim(),
          attending_status: attending,
          guest_count: Number(guests),
          meal_preference: preference,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit RSVP');
      }

      setSubmitted(true);
      triggerConfettiBurst(undefined, undefined, 140);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section rsvp" id="rsvp">
      {!submitted ? (
        <div className="rsvp__form-wrap" id="rsvpFormWrap">
          <h2 className="display reveal is-visible">RSVP</h2>
          <p className="section__sub reveal is-visible">
            {rsvpConfig.deadline_date
              ? `Kindly respond by ${rsvpConfig.deadline_date}`
              : 'Kindly let us know if you can attend'}
          </p>

          <form className="rsvp__form reveal is-visible" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="rName">Your Name</label>
              <input
                id="rName"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Full Name"
              />
            </div>

            <div className="field">
              <label htmlFor="rContact">Phone / Email</label>
              <input
                id="rContact"
                name="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="tel"
                placeholder="Contact info"
              />
            </div>

            <div className="field">
              <label>Will you join us?</label>
              <div className="attend">
                <button
                  type="button"
                  className={`attend__btn ${attending === 'Joyfully accepts' ? 'is-active' : ''}`}
                  onClick={() => setAttending('Joyfully accepts')}
                >
                  Joyfully Accept ✓
                </button>
                <button
                  type="button"
                  className={`attend__btn ${attending === 'Regretfully declines' ? 'is-active' : ''}`}
                  onClick={() => setAttending('Regretfully declines')}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="rGuests">Number of Guests</label>
              <input
                id="rGuests"
                name="guests"
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="field">
              <label htmlFor="rPref">Meal Preference</label>
              <select
                id="rPref"
                name="preference"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              >
                {rsvpConfig.meal_options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="rMsg">A message / advice for us</label>
              <textarea
                id="rMsg"
                name="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="something sweet, funny, or wise…"
              />
            </div>

            <button className="btn btn--full" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send RSVP'}
            </button>

            {errorMessage && (
              <p className="rsvp__status err" role="alert" style={{ marginTop: '0.8rem' }}>
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      ) : (
        <div className="thankyou" id="thankyou">
          <div className="thankyou__check">✓</div>
          <h2 className="display">Thank You!</h2>
          <p className="thankyou__msg">
            Your response has been received. We can’t wait to celebrate with you. 💌
          </p>
        </div>
      )}
    </section>
  );
}
