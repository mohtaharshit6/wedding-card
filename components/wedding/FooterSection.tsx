'use client';

import React, { useState } from 'react';
import { Wedding } from '@/lib/types/wedding';
import { Translations } from '@/lib/i18n/translations';

interface FooterSectionProps {
  wedding: Wedding;
  t: Translations;
}

export default function FooterSection({ wedding, t }: FooterSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const data = {
      title: `${wedding.couple_name1} & ${wedding.couple_name2}`,
      text: `You're invited! ${wedding.hashtag || ''}`.trim(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (_) {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {
        prompt('Copy link:', window.location.href);
      }
    }
  };

  return (
    <footer className="footer">
      {t.footerLine1 && <p className="footer__line1">{t.footerLine1}</p>}
      {t.footerLine2 && <p className="footer__line2">{t.footerLine2}</p>}

      <div className="footer__contact" style={{ margin: '1.4rem auto 1rem', opacity: 0.95 }}>
        <p
          style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--gold-soft)',
            marginBottom: '0.6rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
          }}
        >
          {t.getInTouch}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '1rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
          }}
        >
          {/* Contact 1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'nowrap',
            }}
          >
            <span style={{ letterSpacing: '0.04em', color: '#ffffff', fontWeight: 500, whiteSpace: 'nowrap' }}>
              +91 93310 99998
            </span>
            <span style={{ opacity: 0.4, color: 'var(--gold-soft)', margin: '0 0.1rem' }}>•</span>
            <a
              href="tel:+919331099998"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.82rem',
                padding: '0.22rem 0.55rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.12)',
                whiteSpace: 'nowrap',
              }}
              title="Call"
            >
              <span aria-hidden="true">📞</span> {t.callLabel}
            </a>
            <a
              href="https://wa.me/919331099998"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#25D366',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.82rem',
                padding: '0.22rem 0.6rem',
                borderRadius: '14px',
                background: 'rgba(37, 211, 102, 0.16)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
              title="WhatsApp"
            >
              <span aria-hidden="true">💬</span> {t.whatsappLabel}
            </a>
          </div>

          {/* Contact 2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'nowrap',
            }}
          >
            <span style={{ letterSpacing: '0.04em', color: '#ffffff', fontWeight: 500, whiteSpace: 'nowrap' }}>
              +91 99037 23712
            </span>
            <span style={{ opacity: 0.4, color: 'var(--gold-soft)', margin: '0 0.1rem' }}>•</span>
            <a
              href="tel:+919903723712"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.82rem',
                padding: '0.22rem 0.55rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.12)',
                whiteSpace: 'nowrap',
              }}
              title="Call"
            >
              <span aria-hidden="true">📞</span> {t.callLabel}
            </a>
            <a
              href="https://wa.me/919903723712"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#25D366',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.82rem',
                padding: '0.22rem 0.6rem',
                borderRadius: '14px',
                background: 'rgba(37, 211, 102, 0.16)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
              title="WhatsApp"
            >
              <span aria-hidden="true">💬</span> {t.whatsappLabel}
            </a>
          </div>
        </div>
      </div>

      {wedding.hashtag && (
        <p
          className="footer__hash"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.2rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--gold-soft)',
            margin: '0.8rem auto 1.4rem',
          }}
        >
          {wedding.hashtag}
        </p>
      )}

      <button type="button" className="btn btn--gold" id="shareBtn" onClick={handleShare}>
        {copied ? t.copiedNotice : t.shareBtn}
      </button>

      <p className="footer__couple">
        <span className="script">{wedding.couple_name1}</span> &amp;{' '}
        <span className="script">{wedding.couple_name2}</span>
      </p>
    </footer>
  );
}
