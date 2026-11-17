'use client';

import React, { useEffect, useState } from 'react';
import { Wedding } from '@/lib/types/wedding';
import { Translations } from '@/lib/i18n/translations';

interface CountdownProps {
  wedding: Wedding;
  t: Translations;
}

export default function Countdown({ wedding, t }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const target = new Date(wedding.wedding_date_time).getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [wedding.wedding_date_time]);

  const handleAddToCalendar = () => {
    const start = new Date(wedding.wedding_date_time);
    const end = new Date(start.getTime() + 4 * 3600000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//EN',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@wedding',
      'DTSTAMP:' + fmt(new Date()),
      'DTSTART:' + fmt(start),
      'DTEND:' + fmt(end),
      'SUMMARY:' + wedding.couple_name1 + ' & ' + wedding.couple_name2 + ' — Wedding',
      'LOCATION:' + (wedding.venue_name + ', ' + wedding.venue_address).replace(/,/g, '\\,'),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = wedding.couple_name1.toLowerCase() + '-' + wedding.couple_name2.toLowerCase() + '-wedding.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section countdown" id="countdown">
      <h2 className="display reveal is-visible">{t.countdownTitle}</h2>
      <div className="countdown__grid reveal is-visible">
        <div className="cd-unit">
          <span>{timeLeft.days}</span>
          <small>{t.countdownDays}</small>
        </div>
        <div className="cd-sep">:</div>
        <div className="cd-unit">
          <span>{timeLeft.hours}</span>
          <small>{t.countdownHours}</small>
        </div>
        <div className="cd-sep">:</div>
        <div className="cd-unit">
          <span>{timeLeft.minutes}</span>
          <small>{t.countdownMinutes}</small>
        </div>
        <div className="cd-sep">:</div>
        <div className="cd-unit">
          <span>{timeLeft.seconds}</span>
          <small>{t.countdownSeconds}</small>
        </div>
      </div>
      <button
        type="button"
        className="btn btn--ghost reveal is-visible"
        id="calBtn"
        onClick={handleAddToCalendar}
      >
        {t.calendarBtn}
      </button>
    </section>
  );
}
