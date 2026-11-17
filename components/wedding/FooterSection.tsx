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

      <div className="footer__contact" style={{ margin: '1.2rem auto', opacity: 0.95 }}>
        <p
          style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--gold-soft)',
            marginBottom: '0.35rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
          }}
        >
          For inquiries &amp; coordination
        </p>
        <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
            fontSize: '1.05rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            letterSpacing: '0.03em',
          }}
        >
          <a
            href="tel:+919331099998"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span aria-hidden="true">📞</span> +91 93310 99998
          </a>
          <span style={{ color: 'var(--gold-soft)', opacity: 0.5 }}>|</span>
          <a
            href="tel:+919903723712"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span aria-hidden="true">📞</span> +91 99037 23712
          </a>
        </p>
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
