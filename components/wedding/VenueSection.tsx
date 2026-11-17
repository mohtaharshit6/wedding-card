import React from 'react';
import { Wedding } from '@/lib/types/wedding';

interface VenueSectionProps {
  wedding: Wedding;
}

export default function VenueSection({ wedding }: VenueSectionProps) {
  if (!wedding.venue_name) return null;

  return (
    <section className="section venue" id="venue">
      <h2 className="display reveal is-visible">The Venue</h2>
      <div className="venue__card reveal is-visible">
        {wedding.venue_image_url && (
          <img
            className="venue__img"
            id="venueImg"
            src={wedding.venue_image_url}
            alt={wedding.venue_name}
            loading="lazy"
          />
        )}
        <div className="venue__body">
          <h3 className="venue__name">{wedding.venue_name}</h3>
          <p className="venue__addr">{wedding.venue_address}</p>
          {wedding.venue_maps_link && (
            <a
              className="btn"
              id="venueMaps"
              href={wedding.venue_maps_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View on Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
