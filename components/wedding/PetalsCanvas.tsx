'use client';

import React, { useEffect, useRef } from 'react';
import { PETAL_COLORS } from '@/lib/utils/confetti';

interface PetalsCanvasProps {
  count?: number;
}

export default function PetalsCanvas({ count = 26 }: PetalsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let raf: number;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => ({
      x: Math.random() * w,
      y: -10 - Math.random() * h,
      r: 4 + Math.random() * 6,
      vy: 0.5 + Math.random() * 1.1,
      vx: -0.5 + Math.random(),
      rot: Math.random() * Math.PI,
      vr: -0.04 + Math.random() * 0.08,
      col: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
    });

    const ps = Array.from({ length: count }, () => {
      const p = spawn();
      p.y = Math.random() * (h || 300);
      return p;
    });

    function draw() {
      if (!running || !ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.y / 40) * 0.4;
        p.rot += p.vr;
        if (p.y > h + 12) Object.assign(p, spawn());
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
