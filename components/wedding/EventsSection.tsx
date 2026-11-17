import React from 'react';
import { WeddingEvent } from '@/lib/types/wedding';
import { Translations } from '@/lib/i18n/translations';

interface EventsSectionProps {
  events: WeddingEvent[];
  t: Translations;
}

export default function EventsSection({ events, t }: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="section events" id="events">
      <h2 className="display reveal is-visible">{t.eventsTitle}</h2>
      <p className="section__sub reveal is-visible">{t.eventsSub}</p>

      <div className="events__list" id="eventsList">
        {events.map((event, idx) => {
          const te = t.events[idx];
          const name = te?.name || event.name;
          const day = te?.day || event.day;
          const date = te?.date || event.date;
          const time = te?.time || event.time;
          const desc = te?.description || event.description;
          const venue = te?.venue || event.venue;
          const dir = te?.getDirections || '📍 Get Directions';

          return (
            <article key={event.id || idx} className="event reveal is-visible">
              {event.image_url && (
                <img
                  className="event__img"
                  src={event.image_url}
                  alt={name}
                  loading="lazy"
                />
              )}
              <div className="event__body">
                <h3 className="event__name">{name}</h3>
                <p className="event__when">
                  {day ? day + ' · ' : ''}
                  {date} · {time}
                </p>
                {desc && (
                  <p className="event__desc">“{desc}”</p>
                )}
                {venue && <p className="event__venue">{venue}</p>}

                {event.maps_link && (
                  <p style={{ marginTop: '1rem' }}>
                    <a
                      className="btn event__dir"
                      href={event.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dir}
                    </a>
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
