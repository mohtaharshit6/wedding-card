'use client';

import React, { useState } from 'react';
import { Wedding } from '@/lib/types/wedding';

interface FooterSectionProps {
  wedding: Wedding;
}

export default function FooterSection({ wedding }: FooterSectionProps) {
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
      {wedding.footer_line1 && <p className="footer__line1">{wedding.footer_line1}</p>}
      {wedding.footer_line2 && <p className="footer__line2">{wedding.footer_line2}</p>}

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
          Get in Touch
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(0, 0, 0, 0.18)',
              padding: '0.35rem 0.75rem',
              borderRadius: '24px',
              border: '1px solid rgba(227, 199, 126, 0.25)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span style={{ letterSpacing: '0.04em', color: '#ffffff', fontWeight: 500 }}>
              +91 93310 99998
            </span>
            <span style={{ opacity: 0.4, color: 'var(--gold-soft)' }}>•</span>
            <a
              href="tel:+919331099998"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.45rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.12)',
              }}
              title="Call"
            >
              <span aria-hidden="true">📞</span> Call
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
                gap: '0.2rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                background: 'rgba(37, 211, 102, 0.16)',
                fontWeight: 500,
              }}
              title="WhatsApp"
            >
              <span aria-hidden="true">💬</span> WhatsApp
            </a>
          </div>

          {/* Contact 2 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(0, 0, 0, 0.18)',
              padding: '0.35rem 0.75rem',
              borderRadius: '24px',
              border: '1px solid rgba(227, 199, 126, 0.25)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span style={{ letterSpacing: '0.04em', color: '#ffffff', fontWeight: 500 }}>
              +91 99037 23712
            </span>
            <span style={{ opacity: 0.4, color: 'var(--gold-soft)' }}>•</span>
            <a
              href="tel:+919903723712"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.45rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.12)',
              }}
              title="Call"
            >
              <span aria-hidden="true">📞</span> Call
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
                gap: '0.2rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                background: 'rgba(37, 211, 102, 0.16)',
                fontWeight: 500,
              }}
              title="WhatsApp"
            >
              <span aria-hidden="true">💬</span> WhatsApp
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
        {copied ? 'Link copied! ✓' : 'Share this invite'}
      </button>

      <p className="footer__couple">
        <span className="script">{wedding.couple_name1}</span> &amp;{' '}
        <span className="script">{wedding.couple_name2}</span>
      </p>
    </footer>
  );
}
