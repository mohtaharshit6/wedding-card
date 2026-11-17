import React from 'react';
import { Wedding } from '@/lib/types/wedding';
import { Translations } from '@/lib/i18n/translations';

interface HeroSectionProps {
  wedding: Wedding;
  t: Translations;
}

export default function HeroSection({ wedding, t }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="paper">
        <div className="corner corner--tl" />
        <div className="corner corner--tr" />
        <div className="corner corner--bl" />
        <div className="corner corner--br" />

        {/* Configurable Emblem */}
        {wedding.emblem_type !== 'none' && (
          <div className="ganesha" aria-hidden="true">
            {wedding.emblem_type === 'ganesha' && (
              <img
                src="/assets/img/ganesha.png"
                alt="Shri Ganesh Ji"
                width={92}
                height={92}
                style={{ height: 'auto' }}
              />
            )}
            {wedding.emblem_type === 'custom' && wedding.emblem_url && (
              <img
                src={wedding.emblem_url}
                alt="Emblem"
                width={92}
                height={92}
                style={{ height: 'auto', objectFit: 'contain' }}
              />
            )}
            {wedding.emblem_type === 'monogram' && (
              <div
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '3.2rem',
                  color: 'var(--maroon)',
                  margin: '0.4rem 0',
                }}
              >
                {wedding.monogram || `${wedding.couple_name1[0]}&${wedding.couple_name2[0]}`}
              </div>
            )}
          </div>
        )}

        {/* Toggleable Shloka */}
        {wedding.has_shloka && (
          <>
            {wedding.shloka_line1 && (
              <p className="shloka shloka--title reveal is-visible">{wedding.shloka_line1}</p>
            )}
            {wedding.shloka_line2 && (
              <p className="shloka reveal is-visible">{wedding.shloka_line2}</p>
            )}
            {wedding.shloka_line3 && (
              <p className="shloka reveal is-visible">{wedding.shloka_line3}</p>
            )}
          </>
        )}

        {t.blessingText && (
          <p className="hero__blessing reveal is-visible">{t.blessingText}</p>
        )}

        <h1 className="hero__names reveal is-visible">
          <span className="script">{wedding.couple_name1}</span>
          <span className="amp">&amp;</span>
          <span className="script">{wedding.couple_name2}</span>
        </h1>

        <div className="hero__family reveal is-visible">
          <div className="hero__family-side">
            {t.grandparents1 && (
              <p className="hero__grandparents">{t.grandparents1}</p>
            )}
            {t.parents1 && (
              <p className="hero__parents">{t.parents1}</p>
            )}
          </div>

          <div className="hero__family-divider">✦</div>

          <div className="hero__family-side">
            {t.grandparents2 && (
              <p className="hero__grandparents">{t.grandparents2}</p>
            )}
            {t.parents2 && (
              <p className="hero__parents">{t.parents2}</p>
            )}
          </div>
        </div>

        <a href="#savedate" className="scroll-cue reveal is-visible">
          {t.scrollCue}
        </a>
      </div>
    </section>
  );
}
