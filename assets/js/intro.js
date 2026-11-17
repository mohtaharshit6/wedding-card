/* =====================================================================
   intro.js — tap-to-reveal cinematic opener:
   maroon seal ("Tap to Reveal") → golden sunburst → spiral galaxy → fade.
   Built to NEVER get stuck: auto-triggers if untouched, always fades out,
   survives any canvas error, plays once per session, has a Skip button.
   ===================================================================== */
(function () {
  "use strict";
  const intro = document.getElementById("intro");
  if (!intro) return;
  const canvas = document.getElementById("introCanvas");
  const seal = document.getElementById("introSeal");
  const skip = document.getElementById("introSkip");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false, started = false;
  let chosenLang = "en";

  function finish(lang) {
    if (finished) return;
    finished = true;
    if (lang) chosenLang = lang;
    window.SELECTED_LANG = chosenLang;
    if (typeof window.setWeddingLanguage === "function") {
      window.setWeddingLanguage(chosenLang);
    }
    intro.classList.add("is-hidden");
    document.body.style.overflow = "";
    setTimeout(() => { if (intro.parentNode) intro.remove(); }, 1100);
    window.dispatchEvent(new CustomEvent("intro:done", { detail: { lang: chosenLang } }));
  }

  // Skip entirely if already seen this session or reduced motion.
  if (reduce || sessionStorage.getItem("introSeen")) {
    if (intro.parentNode) intro.remove();
    document.body.style.overflow = "";
    window.dispatchEvent(new CustomEvent("intro:done", { detail: { lang: chosenLang } }));
    return;
  }
  sessionStorage.setItem("introSeen", "1");
  document.body.style.overflow = "hidden";

  // Hard safety net: no matter what, the intro is gone within 9s.
  const hardStop = setTimeout(() => finish(chosenLang), 9000);

  if (skip) skip.addEventListener("click", () => finish(chosenLang));

  /* ---------- The reveal animation ---------- */
  function run(lang) {
    if (started) return;
    started = true;
    if (lang) chosenLang = lang;
    window.SELECTED_LANG = chosenLang;
    if (typeof window.setWeddingLanguage === "function") {
      window.setWeddingLanguage(chosenLang);
    }

    // try to start music on this user gesture (allowed); ignore if blocked
    try {
      const a = document.getElementById("bgAudio");
      if (a && a.paused) {
        a.play().then(() => {
          const mb = document.getElementById("musicBtn");
          if (mb) { mb.classList.add("is-playing"); mb.title = "Pause music"; }
        }).catch(() => {});
      }
    } catch (_) {}

    intro.classList.add("is-bursting"); // seal scales up + fades

    let ok = true;
    let ctx;
    try { ctx = canvas.getContext("2d"); } catch (_) { ok = false; }
    if (!ok || !ctx) { setTimeout(finish, 700); return; }

    let dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
    function size() { W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener("resize", size);

    // spiral-galaxy particles
    const parts = [];
    const palette = ["#ffe9b0", "#ffd86b", "#f7b733", "#bfe3ff", "#9fc6ff", "#ffcf9e"];
    for (let i = 0; i < 700; i++) {
      const arm = i % 3;
      const t = Math.pow(Math.random(), 0.5) * 5.2;
      const ang = t * 0.95 + (arm / 3) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      parts.push({ ang, r: t * 30, col: palette[(Math.random() * palette.length) | 0], sz: Math.random() * 1.8 + 0.5, tw: Math.random() * 6.28 });
    }

    const start = performance.now();
    let rot = 0;
    const SUN_END = 1200, GAL_END = 2700, FADE_END = 3600;

    function rays(cx, cy, R, a) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, "rgba(255,247,218," + a + ")");
      g.addColorStop(0.25, "rgba(255,216,107," + a + ")");
      g.addColorStop(0.6, "rgba(201,162,75," + (a * 0.5) + ")");
      g.addColorStop(1, "rgba(201,162,75,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot * 0.6);
      ctx.strokeStyle = "rgba(255,228,150," + (a * 0.5) + ")"; ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) { const an = (i / 24) * 6.2832; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * R * 1.25, Math.sin(an) * R * 1.25); ctx.stroke(); }
      ctx.restore();
    }
    function galaxy(cx, cy, a) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      core.addColorStop(0, "rgba(255,255,255," + a + ")"); core.addColorStop(0.4, "rgba(255,233,176," + a + ")"); core.addColorStop(1, "rgba(150,110,40,0)");
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 6.2832); ctx.fill();
      for (const p of parts) {
        p.tw += 0.08;
        const x = Math.cos(p.ang) * p.r, y = Math.sin(p.ang) * p.r;
        ctx.globalAlpha = a * (0.5 + Math.sin(p.tw) * 0.35);
        ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(x, y, p.sz, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    function frame(now) {
      if (finished) return;
      const el = now - start;
      rot += 0.012;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, maxR = Math.hypot(W, H);

      if (el < SUN_END) {
        const k = el / SUN_END;                 // 0..1 sunburst grows
        rays(cx, cy, maxR * (0.15 + k * 0.65), 1);
      } else if (el < GAL_END) {
        ctx.fillStyle = "#0b0922"; ctx.fillRect(0, 0, W, H);
        const k = (el - SUN_END) / (GAL_END - SUN_END);
        galaxy(cx, cy, Math.min(1, k * 1.4));
        rays(cx, cy, maxR, Math.max(0, 1 - k * 1.6));
      } else {
        ctx.fillStyle = "#0b0922"; ctx.fillRect(0, 0, W, H);
        galaxy(cx, cy, 1);
        const k = (el - GAL_END) / (FADE_END - GAL_END);
        intro.style.opacity = String(Math.max(0, 1 - k));
      }

      if (el >= FADE_END) { finish(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Trigger on tap/click on language buttons or seal
  const langBtns = intro.querySelectorAll(".seal__lang-btn");
  langBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const l = btn.getAttribute("data-lang") || "en";
      run(l);
    });
  });

  seal && seal.addEventListener("click", (e) => {
    e.stopPropagation();
    run("en");
  });

  intro.addEventListener("click", (e) => {
    if (e.target !== skip && !e.target.closest(".seal__lang-btn")) run("en");
  });

  const autoTrigger = setTimeout(() => run("en"), 4500);

  // tidy timers when done
  window.addEventListener("intro:done", () => { clearTimeout(hardStop); clearTimeout(autoTrigger); });
})();
