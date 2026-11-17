'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EmblemType } from '@/lib/types/wedding';

interface IntroSealProps {
  emblemType: EmblemType;
  emblemUrl?: string | null;
  monogram?: string | null;
  onDone: () => void;
}

export default function IntroSeal({
  emblemType,
  emblemUrl,
  monogram,
  onDone,
}: IntroSealProps) {
  const [visible, setVisible] = useState(true);
  const [bursting, setBursting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = '';
    setVisible(false);
    onDone();
  };

  useEffect(() => {
    // Check reduced motion or previous view in session
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || sessionStorage.getItem('introSeen')) {
      finish();
      return;
    }

    sessionStorage.setItem('introSeen', '1');
    document.body.style.overflow = 'hidden';

    // 9s hard safety net
    const hardStop = setTimeout(finish, 9000);
    // 4.5s auto-trigger
    const autoTrigger = setTimeout(() => {
      runAnimation();
    }, 4500);

    return () => {
      clearTimeout(hardStop);
      clearTimeout(autoTrigger);
      document.body.style.overflow = '';
    };
  }, []);

  const runAnimation = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    setBursting(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setTimeout(finish, 700);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setTimeout(finish, 700);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    function size() {
      W = window.innerWidth;
      H = window.innerHeight;
      if (canvas && ctx) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    size();
    window.addEventListener('resize', size);

    // 700 spiral-galaxy particles
    const parts: Array<{ ang: number; r: number; col: string; sz: number; tw: number }> = [];
    const palette = ['#ffe9b0', '#ffd86b', '#f7b733', '#bfe3ff', '#9fc6ff', '#ffcf9e'];
    for (let i = 0; i < 700; i++) {
      const arm = i % 3;
      const t = Math.pow(Math.random(), 0.5) * 5.2;
      const ang = t * 0.95 + (arm / 3) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      parts.push({
        ang,
        r: t * 30,
        col: palette[(Math.random() * palette.length) | 0],
        sz: Math.random() * 1.8 + 0.5,
        tw: Math.random() * 6.28,
      });
    }

    const start = performance.now();
    let rot = 0;
    const SUN_END = 1200;
    const GAL_END = 2700;
    const FADE_END = 3600;

    function rays(cx: number, cy: number, R: number, a: number) {
      if (!ctx) return;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, 'rgba(255,247,218,' + a + ')');
      g.addColorStop(0.25, 'rgba(255,216,107,' + a + ')');
      g.addColorStop(0.6, 'rgba(201,162,75,' + a * 0.5 + ')');
      g.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 6.2832);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot * 0.6);
      ctx.strokeStyle = 'rgba(255,228,150,' + a * 0.5 + ')';
      ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        const an = (i / 24) * 6.2832;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(an) * R * 1.25, Math.sin(an) * R * 1.25);
        ctx.stroke();
      }
      ctx.restore();
    }

    function galaxy(cx: number, cy: number, a: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      core.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      core.addColorStop(0.4, 'rgba(255,233,176,' + a + ')');
      core.addColorStop(1, 'rgba(150,110,40,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, 6.2832);
      ctx.fill();

      for (const p of parts) {
        p.tw += 0.08;
        const x = Math.cos(p.ang) * p.r;
        const y = Math.sin(p.ang) * p.r;
        ctx.globalAlpha = a * (0.5 + Math.sin(p.tw) * 0.35);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(x, y, p.sz, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    let animId: number;
    function frame(now: number) {
      if (finishedRef.current || !ctx || !canvas) return;
      const el = now - start;
      rot += 0.012;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.hypot(W, H);

      if (el < SUN_END) {
        const k = el / SUN_END;
        rays(cx, cy, maxR * (0.15 + k * 0.65), 1);
      } else if (el < GAL_END) {
        ctx.fillStyle = '#0b0922';
        ctx.fillRect(0, 0, W, H);
        const k = (el - SUN_END) / (GAL_END - SUN_END);
        galaxy(cx, cy, Math.min(1, k * 1.4));
        rays(cx, cy, maxR, Math.max(0, 1 - k * 1.6));
      } else {
        ctx.fillStyle = '#0b0922';
        ctx.fillRect(0, 0, W, H);
        galaxy(cx, cy, 1);
        const k = (el - GAL_END) / (FADE_END - GAL_END);
        canvas.parentElement!.style.opacity = String(Math.max(0, 1 - k));
      }

      if (el >= FADE_END) {
        window.removeEventListener('resize', size);
        finish();
        return;
      }
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);
  };

  if (!visible) return null;

  return (
    <div
      className={`intro ${bursting ? 'is-bursting' : ''}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).id !== 'introSkip') runAnimation();
      }}
    >
      <canvas ref={canvasRef} className="intro__canvas" />
      <button
        type="button"
        className="intro__seal"
        aria-label="Tap to reveal the invitation"
        onClick={runAnimation}
      >
        <span className="seal__ring" />
        <span className="seal__core">
          {emblemType === 'ganesha' && (
            <img src="/assets/img/ganesha.png" alt="Shri Ganesh Ji" width={72} height={72} />
          )}
          {emblemType === 'custom' && emblemUrl && (
            <img src={emblemUrl} alt="Emblem" width={72} height={72} style={{ objectFit: 'contain' }} />
          )}
          {emblemType === 'monogram' && (
            <span style={{ fontFamily: 'var(--font-script)', fontSize: '2.2rem', color: 'var(--maroon)' }}>
              {monogram || 'W'}
            </span>
          )}
          {emblemType === 'none' && (
            <span style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>✦</span>
          )}
        </span>
        <span className="seal__label">Tap to Reveal</span>
      </button>
      <button type="button" className="intro__skip" id="introSkip" onClick={finish}>
        Skip ›
      </button>
    </div>
  );
}
