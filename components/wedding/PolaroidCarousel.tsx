'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GalleryPhoto } from '@/lib/types/wedding';

interface PolaroidCarouselProps {
  gallery: GalleryPhoto[];
}

export default function PolaroidCarousel({ gallery }: PolaroidCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const userActiveRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const total = gallery.length;

  const goTo = (idx: number, smooth = true) => {
    if (!trackRef.current || total === 0) return;
    const target = (idx + total) % total;
    setCurrentIndex(target);
    const slide = trackRef.current.children[target] as HTMLElement;
    if (slide) {
      trackRef.current.scrollTo({
        top: slide.offsetTop,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    if (total <= 1) return;
    let autoInterval: NodeJS.Timeout | null = null;

    const startAuto = () => {
      stopAuto();
      autoInterval = setInterval(() => {
        if (!userActiveRef.current) {
          setCurrentIndex((prev) => {
            const next = (prev + 1) % total;
            goTo(next);
            return next;
          });
        }
      }, 3200);
    };

    const stopAuto = () => {
      if (autoInterval) clearInterval(autoInterval);
    };

    startAuto();

    const track = trackRef.current;
    if (!track) return;

    const handleUserInteraction = () => {
      userActiveRef.current = true;
      stopAuto();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        userActiveRef.current = false;
        startAuto();
      }, 6000);
    };

    track.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    track.addEventListener('touchstart', handleUserInteraction, { passive: true });
    track.addEventListener('wheel', handleUserInteraction, { passive: true });

    return () => {
      stopAuto();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      track.removeEventListener('pointerdown', handleUserInteraction);
      track.removeEventListener('touchstart', handleUserInteraction);
      track.removeEventListener('wheel', handleUserInteraction);
    };
  }, [total]);

  // Handle scroll synchronization for active dot
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || total === 0) return;
    let nearest = 0;
    let best = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetTop - track.scrollTop);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setCurrentIndex(nearest);
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % total);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, total]);

  if (total === 0) return null;

  return (
    <section className="section forever" id="forever">
      <h2 className="display script-display reveal is-visible">Forever Us</h2>
      <p className="section__sub reveal is-visible">A few of our favourite moments</p>

      <div className="vcarousel reveal is-visible" id="galleryCarousel">
        <div
          className="vcarousel__track"
          id="galleryTrack"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {gallery.map((item, idx) => (
            <div key={item.id || idx} className="vslide">
              <figure
                className={`polaroid ${item.is_bw ? 'bw' : ''}`}
                onClick={() => openLightbox(idx)}
              >
                <img src={item.image_url} alt={item.caption || 'Photo'} loading="lazy" />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            </div>
          ))}
        </div>

        <div className="vcarousel__dots" id="galleryDots">
          {gallery.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={idx === currentIndex ? 'is-active' : ''}
              aria-label={`Photo ${idx + 1}`}
              onClick={() => {
                userActiveRef.current = true;
                goTo(idx);
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <div
        className={`lightbox ${lightboxOpen ? 'is-open' : ''}`}
        id="lightbox"
        aria-hidden={!lightboxOpen}
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'lightbox') closeLightbox();
        }}
        onTouchStart={(e) => {
          touchStartRef.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartRef.current === null) return;
          const diff = e.changedTouches[0].clientX - touchStartRef.current;
          if (Math.abs(diff) > 40) {
            if (diff < 0) nextLightbox();
            else prevLightbox();
          }
          touchStartRef.current = null;
        }}
      >
        <button
          type="button"
          className="lightbox__close"
          aria-label="Close"
          onClick={closeLightbox}
        >
          ×
        </button>
        <button
          type="button"
          className="lightbox__nav lightbox__prev"
          aria-label="Previous"
          onClick={prevLightbox}
        >
          ‹
        </button>
        {gallery[lightboxIndex] && (
          <img
            className="lightbox__img"
            src={gallery[lightboxIndex].image_url}
            alt={gallery[lightboxIndex].caption || 'Enlarged photo'}
          />
        )}
        <button
          type="button"
          className="lightbox__nav lightbox__next"
          aria-label="Next"
          onClick={nextLightbox}
        >
          ›
        </button>
      </div>
    </section>
  );
}
