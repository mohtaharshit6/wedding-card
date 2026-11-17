'use client';

import React, { useState, useEffect } from 'react';
import { WeddingFullData } from '@/lib/types/wedding';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';
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
  const [lang, setLang] = useState<Language>('en');

  const t = TRANSLATIONS[lang];

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
        onDone={(chosenLang) => {
          if (chosenLang) setLang(chosenLang);
          setIntroDone(true);
        }}
      />

      {/* Floating Language Switcher */}
      <div
        className="floating-lang-toggle"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 50,
          background: 'rgba(110, 20, 20, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1.2px solid var(--gold)',
          borderRadius: '999px',
          padding: '3px 5px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        }}
      >
        <button
          type="button"
          onClick={() => setLang('en')}
          style={{
            background: lang === 'en' ? 'var(--gold)' : 'transparent',
            color: lang === 'en' ? '#3A2A22' : 'var(--gold-soft)',
            border: 'none',
            borderRadius: '999px',
            padding: '3px 9px',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          EN
        </button>
        <span style={{ color: 'var(--gold-soft)', opacity: 0.4, fontSize: '0.72rem' }}>|</span>
        <button
          type="button"
          onClick={() => setLang('hi')}
          style={{
            background: lang === 'hi' ? 'var(--gold)' : 'transparent',
            color: lang === 'hi' ? '#3A2A22' : 'var(--gold-soft)',
            border: 'none',
            borderRadius: '999px',
            padding: '3px 9px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          हिंदी
        </button>
      </div>

      <main className="page" id="page">
        <HeroSection wedding={wedding} t={t} />
        <ScratchCard weddingDateTime={wedding.wedding_date_time} t={t} lang={lang} />
        <Countdown wedding={wedding} t={t} />
        <PolaroidCarousel gallery={gallery} t={t} />
        <EventsSection events={events} t={t} />
        <FooterSection wedding={wedding} t={t} />
      </main>
    </>
  );
}
