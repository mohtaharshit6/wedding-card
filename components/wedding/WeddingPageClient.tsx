'use client';

import React, { useState, useEffect } from 'react';
import { WeddingFullData } from '@/lib/types/wedding';
import IntroSeal from './IntroSeal';
import HeroSection from './HeroSection';
import ScratchCard from './ScratchCard';
import Countdown from './Countdown';
import PolaroidCarousel from './PolaroidCarousel';
import EventsSection from './EventsSection';
import FooterSection from './FooterSection';
import '@/app/[slug]/wedding.css';

interface WeddingPageClientProps {
  data: WeddingFullData;
}

export default function WeddingPageClient({ data }: WeddingPageClientProps) {
  const { wedding, theme, events, gallery, rsvpConfig } = data;
  const [introDone, setIntroDone] = useState(false);

  // Dynamic Theme Palette CSS Variables
  const themeStyles = `
    :root {
      --maroon: ${theme.color_primary || '#6E1414'};
      --red: ${theme.color_secondary || '#8E1B1B'};
      --gold: ${theme.color_accent || '#C9A24B'};
      --gold-soft: ${theme.color_accent_soft || '#E3C77E'};
      --cream: ${theme.color_background || '#F6EEE0'};
      --cream-2: ${theme.color_background_alt || '#EFE3CF'};
      --rose: ${theme.color_rose || '#B6566B'};
      --ink: ${theme.color_ink || '#3A2A22'};
    }
  `;

  // Scroll reveal IntersectionObserver (faithful to original main.js)
  useEffect(() => {
    const revealAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible');
      });
    };

    if (!('IntersectionObserver' in window)) {
      revealAll();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

      requestAnimationFrame(() => {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
            el.classList.add('is-visible');
          }
        });
      });

      const safetyTimer = setTimeout(revealAll, 3500);
      return () => {
        clearTimeout(safetyTimer);
        io.disconnect();
      };
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />

      {/* Cinematic Wax Seal Intro */}
      <IntroSeal
        emblemType={wedding.emblem_type}
        emblemUrl={wedding.emblem_url}
        monogram={wedding.monogram}
        onDone={() => setIntroDone(true)}
      />

      <main className="page" id="page">
        <HeroSection wedding={wedding} />
        <ScratchCard weddingDateTime={wedding.wedding_date_time} />
        <Countdown wedding={wedding} />
        <PolaroidCarousel gallery={gallery} />
        <EventsSection events={events} />
        <FooterSection wedding={wedding} />
      </main>
    </>
  );
}
