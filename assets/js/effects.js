/* =====================================================================
   effects.js — particle emitter (petals / confetti) + scratch-card.
   Exposed on window.FX. No dependencies.
   ===================================================================== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Falling petals / confetti ----------
     FX.petals(el, {colors, count, shape, gravity, life})
     - element-anchored full-cover canvas that rains particles.
     FX.burst(x, y, {colors, count}) — one-shot celebratory burst. */

  function makeCanvas(host, fixed) {
    const c = document.createElement("canvas");
    c.style.cssText = "position:" + (fixed ? "fixed" : "absolute") +
      ";inset:0;width:100%;height:100%;pointer-events:none;z-index:5;";
    (host || document.body).appendChild(c);
    return c;
  }
  function fit(c) {
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(1, r.width * dpr);
    c.height = Math.max(1, r.height * dpr);
    return { dpr, w: r.width, h: r.height };
  }

  const PETAL_COLORS = ["#F6C6D0", "#E3C77E", "#C9A24B", "#B6566B", "#F2C9A0"];

  function petals(host, opts) {
    opts = opts || {};
    if (reduce) return { stop() {} };
    const colors = opts.colors || PETAL_COLORS;
    const count = opts.count || 36;
    const c = makeCanvas(host, false);
    const ctx = c.getContext("2d");
    let dim = fit(c), running = true, raf;
    const ps = [];
    const spawn = () => ({
      x: Math.random() * dim.w,
      y: -10 - Math.random() * dim.h,
      r: 4 + Math.random() * 6,
      vy: .5 + Math.random() * 1.1,
      vx: -.5 + Math.random(),
      rot: Math.random() * Math.PI,
      vr: -.04 + Math.random() * .08,
      col: colors[(Math.random() * colors.length) | 0],
    });
    for (let i = 0; i < count; i++) { const p = spawn(); p.y = Math.random() * dim.h; ps.push(p); }

    function draw() {
      if (!running) return;
      ctx.setTransform(dim.dpr, 0, 0, dim.dpr, 0, 0);
      ctx.clearRect(0, 0, dim.w, dim.h);
      for (const p of ps) {
        p.y += p.vy; p.x += p.vx + Math.sin(p.y / 40) * .4; p.rot += p.vr;
        if (p.y > dim.h + 12) Object.assign(p, spawn());
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.col; ctx.globalAlpha = .9;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * .5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }
    const onResize = () => dim = fit(c);
    window.addEventListener("resize", onResize);
    draw();
    return { stop() { running = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); c.remove(); } };
  }

  function burst(x, y, opts) {
    opts = opts || {};
    if (reduce) return;
    const colors = opts.colors || PETAL_COLORS;
    const count = opts.count || 120;
    const c = makeCanvas(document.body, true);
    const ctx = c.getContext("2d");
    let dim = fit(c);
    const ps = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 8;
      ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, r: 3 + Math.random() * 5,
        rot: Math.random() * 6, vr: -.3 + Math.random() * .6, col: colors[(Math.random() * colors.length) | 0], life: 1 });
    }
    let raf;
    function draw() {
      ctx.setTransform(dim.dpr, 0, 0, dim.dpr, 0, 0);
      ctx.clearRect(0, 0, dim.w, dim.h);
      let alive = false;
      for (const p of ps) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += .18; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .012;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.col;
        ctx.fillRect(-p.r, -p.r * .6, p.r * 2, p.r * 1.2);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(draw); else c.remove();
    }
    draw();
  }

  /* ---------- Scratch card ----------
     FX.scratch(canvas, {onDone}) — gold foil that erases on drag,
     auto-reveals after ~65% cleared. */
  function scratch(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function paint() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#C9A24B"); g.addColorStop(.5, "#E3C77E"); g.addColorStop(1, "#B8902F");
      ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
      ctx.fillStyle = "rgba(255,255,255,.25)";
      for (let i = 0; i < 40; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
      ctx.fillStyle = "rgba(110,20,20,.85)";
      ctx.font = "600 16px 'Inter',sans-serif"; ctx.textAlign = "center";
      ctx.fillText("✦ scratch here ✦", r.width / 2, r.height / 2);
      ctx.globalCompositeOperation = "destination-out";
    }
    if (reduce) { canvas.classList.add("is-cleared"); if (opts.onDone) opts.onDone(); return; }
    paint();

    let drawing = false, done = false;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const erase = (x, y) => {
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
    };
    const pct = () => {
      const r = canvas.getBoundingClientRect();
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0; for (let i = 3; i < img.length; i += 64) if (img[i] === 0) clear++;
      return clear / (img.length / 64);
    };
    const check = () => {
      if (done) return;
      if (pct() > .55) { done = true; canvas.classList.add("is-cleared"); if (opts.onDone) opts.onDone(); }
    };
    const start = (e) => { drawing = true; const p = pos(e); erase(p.x, p.y); };
    const move = (e) => { if (!drawing) return; e.preventDefault(); const p = pos(e); erase(p.x, p.y); };
    const end = () => { if (drawing) { drawing = false; check(); } };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
  }

  window.FX = { petals, burst, scratch };
})();
