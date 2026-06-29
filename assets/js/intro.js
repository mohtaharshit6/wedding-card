/* =====================================================================
   intro.js — cinematic opener:
   red envelope opens → golden sunburst → swirling spiral galaxy → fade.
   Plays once per browser session. Honors reduced-motion + Skip button.
   ===================================================================== */
(function () {
  "use strict";
  const intro = document.getElementById("intro");
  const canvas = document.getElementById("introCanvas");
  const env = document.getElementById("introEnvelope");
  const skip = document.getElementById("introSkip");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function done() {
    intro.classList.add("is-hidden");
    setTimeout(() => intro.remove(), 1100);
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("intro:done"));
  }

  // Skip if already seen this session, or reduced motion.
  if (reduce || sessionStorage.getItem("introSeen")) {
    intro.remove();
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("intro:done"));
    return;
  }
  sessionStorage.setItem("introSeen", "1");
  document.body.style.overflow = "hidden";
  skip.addEventListener("click", done);

  /* ---------- Galaxy canvas ---------- */
  const ctx = canvas.getContext("2d");
  let dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
  function size() {
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener("resize", size);

  // Build spiral galaxy particles (logarithmic arms).
  const N = 900, arms = 3, parts = [];
  for (let i = 0; i < N; i++) {
    const arm = i % arms;
    const t = Math.pow(Math.random(), .5) * 5.4;            // radius growth
    const ang = t * 0.9 + (arm / arms) * Math.PI * 2 + (Math.random() - .5) * .5;
    const palette = ["#bfe3ff", "#8fb7ff", "#d9c08a", "#ffe9b0", "#a6e6e0"];
    parts.push({
      t, ang,
      r: t * 34,
      col: palette[(Math.random() * palette.length) | 0],
      sz: Math.random() * 1.8 + .4,
      tw: Math.random() * Math.PI * 2,
    });
  }

  let phase = 0;        // 0 wait-envelope, 1 burst, 2 galaxy, 3 fade
  let t0 = 0, rot = 0, sunR = 0, galAlpha = 0;

  function sunburst(cx, cy, R, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, "#fff7da"); g.addColorStop(.25, "#ffd86b");
    g.addColorStop(.6, "rgba(201,162,75,.5)"); g.addColorStop(1, "rgba(201,162,75,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // rays
    ctx.translate(cx, cy); ctx.rotate(rot * .5);
    ctx.strokeStyle = "rgba(255,228,150," + (alpha * .5) + ")"; ctx.lineWidth = 2;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * R * 1.3, Math.sin(a) * R * 1.3); ctx.stroke();
    }
    ctx.restore();
  }

  function galaxy(cx, cy, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy); ctx.rotate(rot);
    // glowing core
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 70);
    core.addColorStop(0, "#fff"); core.addColorStop(.4, "#ffe9b0"); core.addColorStop(1, "rgba(120,90,200,0)");
    ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
    for (const p of parts) {
      p.tw += .08;
      const x = Math.cos(p.ang) * p.r, y = Math.sin(p.ang) * p.r;
      ctx.globalAlpha = alpha * (.5 + Math.sin(p.tw) * .35);
      ctx.fillStyle = p.col;
      ctx.beginPath(); ctx.arc(x, y, p.sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function frame(ts) {
    if (!t0) t0 = ts;
    const el = ts - t0;
    rot += 0.01;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    if (phase >= 2) {
      // deep space bg
      ctx.fillStyle = "#0a0820"; ctx.fillRect(0, 0, W, H);
    }

    if (phase === 1) {            // sunburst growing out of the envelope glow
      sunR = Math.min(sunR + W * 0.012, Math.hypot(W, H));
      sunburst(cx, cy, sunR, 1);
      if (sunR > Math.hypot(W, H) * 0.6) { phase = 2; }
    } else if (phase === 2) {     // galaxy emerges, sunburst fades
      galAlpha = Math.min(galAlpha + .015, 1);
      galaxy(cx, cy, galAlpha);
      sunburst(cx, cy, Math.hypot(W, H), Math.max(0, 1 - galAlpha));
      if (galAlpha >= 1 && el > 0) { /* hold */ }
    }

    if (phase < 3) requestAnimationFrame(frame);
  }

  // Timeline
  setTimeout(() => intro.classList.add("is-opening"), 500);   // envelope flap opens
  setTimeout(() => {                                          // light bursts
    intro.classList.add("is-burst");
    phase = 1; t0 = 0; requestAnimationFrame(frame);
  }, 1700);
  setTimeout(done, 5200);                                     // galaxy holds ~1.5s then fade to page
})();
