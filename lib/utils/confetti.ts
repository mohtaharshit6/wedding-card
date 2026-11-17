export const PETAL_COLORS = ['#F6C6D0', '#E3C77E', '#C9A24B', '#B6566B', '#F2C9A0'];

export function triggerConfettiBurst(x?: number, y?: number, count: number = 120) {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const posX = x ?? window.innerWidth / 2;
  const posY = y ?? window.innerHeight / 2;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ps: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    rot: number;
    vr: number;
    col: string;
    life: number;
  }> = [];

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 8;
    ps.push({
      x: posX,
      y: posY,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 4,
      r: 3 + Math.random() * 5,
      rot: Math.random() * 6,
      vr: -0.3 + Math.random() * 0.6,
      col: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
      life: 1,
    });
  }

  let raf: number;
  function draw() {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    for (const p of ps) {
      if (p.life <= 0) continue;
      alive = true;
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.012;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
      ctx.restore();
    }
    if (alive) {
      raf = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  draw();
}
