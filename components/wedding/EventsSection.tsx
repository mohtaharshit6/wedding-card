import React from 'react';
import { WeddingEvent } from '@/lib/types/wedding';

interface EventsSectionProps {
  events: WeddingEvent[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="section events" id="events">
      <h2 className="display reveal is-visible">Events &amp; Rituals</h2>
      <p className="section__sub reveal is-visible">Join us across these celebrations</p>

      <div className="events__list" id="eventsList">
        {events.map((event) => (
          <article key={event.id} className="event reveal is-visible">
            {event.image_url && (
              <img
                className="event__img"
                src={event.image_url}
                alt={event.name}
                loading="lazy"
              />
            )}
            <div className="event__body">
              <h3 className="event__name">{event.name}</h3>
              <p className="event__when">
                {event.day ? event.day + ' · ' : ''}
                {event.date} · {event.time}
              </p>
              {event.description && (
                <p className="event__desc">“{event.description}”</p>
              )}
              {event.venue && <p className="event__venue">{event.venue}</p>}

              {event.maps_link && (
                <p style={{ marginTop: '1rem' }}>
                  <a
                    className="btn event__dir"
                    href={event.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍 Get Directions
                  </a>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
