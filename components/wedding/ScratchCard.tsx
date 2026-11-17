'use client';

import React, { useEffect, useRef, useState } from 'react';
import { triggerConfettiBurst } from '@/lib/utils/confetti';
import PetalsCanvas from './PetalsCanvas';

interface ScratchCardProps {
  weddingDateTime: string;
}

export default function ScratchCard({ weddingDateTime }: ScratchCardProps) {
  const [cleared, setCleared] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dateObj = new Date(weddingDateTime);
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];
  const month = monthNames[dateObj.getMonth()] || 'JAN';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = String(dateObj.getFullYear());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowPetals(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCleared(true);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function paint() {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, '#C9A24B');
      g.addColorStop(0.5, '#E3C77E');
      g.addColorStop(1, '#B8902F');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);

      ctx.fillStyle = 'rgba(255,255,255,.25)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
      }

      ctx.fillStyle = 'rgba(110,20,20,.85)';
      ctx.font = "600 16px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('✦ scratch here ✦', r.width / 2, r.height / 2 + 5);
      ctx.globalCompositeOperation = 'destination-out';
    }

    paint();

    let drawing = false;
    let done = false;

    const pos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const t = 'touches' in e ? e.touches[0] : (e as MouseEvent);
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };

    const erase = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    const pct = () => {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < img.length; i += 64) {
        if (img[i] === 0) clear++;
      }
      return clear / (img.length / 64);
    };

    const reveal = () => {
      if (done) return;
      done = true;
      setCleared(true);
      const r = canvas.getBoundingClientRect();
      triggerConfettiBurst(r.left + r.width / 2, r.top + r.height / 2, 90);
    };

    const check = () => {
      if (!done && pct() > 0.2) reveal();
    };

    let moves = 0;
    const start = (e: MouseEvent | TouchEvent) => {
      drawing = true;
      const p = pos(e);
      erase(p.x, p.y);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      if ('cancelable' in e && e.cancelable) e.preventDefault();
      const p = pos(e);
      erase(p.x, p.y);
      if (++moves % 5 === 0) check();
    };

    const end = () => {
      if (drawing) {
        drawing = false;
        check();
      }
    };

    canvas.addEventListener('mousedown', start as any);
    canvas.addEventListener('mousemove', move as any);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start as any, { passive: false });
    canvas.addEventListener('touchmove', move as any, { passive: false });
    window.addEventListener('touchend', end);

    const handleResize = () => {
      if (!done) paint();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', start as any);
      canvas.removeEventListener('mousemove', move as any);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start as any);
      canvas.removeEventListener('touchmove', move as any);
      window.removeEventListener('touchend', end);
    };
  }, []);

  return (
    <section className="section savedate" id="savedate" ref={containerRef} style={{ position: 'relative' }}>
      {showPetals && <PetalsCanvas count={24} />}
      <p className="kicker reveal is-visible">THE DATE</p>
      <h2 className="display reveal is-visible">Save the Date</h2>
      <p className="savedate__hint reveal is-visible">Scratch below to reveal our wedding date</p>

      <div className="scratch reveal is-visible" id="scratchWrap">
        <div className="scratch__tiles">
          <div className="tile">
            <span className="tile__label">Month</span>
            <span className="tile__val">{month}</span>
          </div>
          <div className="tile">
            <span className="tile__label">Day</span>
            <span className="tile__val">{day}</span>
          </div>
          <div className="tile">
            <span className="tile__label">Year</span>
            <span className="tile__val">{year}</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className={`scratch__canvas ${cleared ? 'is-cleared' : ''}`}
        />
      </div>
      <p className={`savedate__revealed ${cleared ? 'show' : ''}`}>✨ See you there! ✨</p>
    </section>
  );
}
