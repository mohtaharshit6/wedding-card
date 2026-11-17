/* =====================================================================
   main.js — renders WEDDING (config.js) into the page and wires up
   countdown, scratch card, gallery, RSVP, music, share, reveals.
   Edit config.js, not this file.
   ===================================================================== */
(function () {
  "use strict";
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Static text from config ---------- */
  document.title = W.couple.name1 + " & " + W.couple.name2 + " — Wedding Invitation";
  $$('[data-name="1"]').forEach(e => e.textContent = W.couple.name1);
  $$('[data-name="2"]').forEach(e => e.textContent = W.couple.name2);
  $$("[data-hashtag]").forEach(e => e.textContent = W.couple.hashtag);
  $('[data-parents="1"]').textContent = W.couple.parents1;
  $('[data-parents="2"]').textContent = W.couple.parents2;
  Object.keys(W.shloka).forEach(k => { const el = $(`[data-shloka="${k}"]`); if (el) el.textContent = W.shloka[k]; });
  $('[data-date="month"]').textContent = W.saveTheDate.month;
  $('[data-date="day"]').textContent = W.saveTheDate.day;
  $('[data-date="year"]').textContent = W.saveTheDate.year;
  const vName = $('[data-venue="name"]'); if (vName && W.venue) vName.textContent = W.venue.name;
  const vAddr = $('[data-venue="address"]'); if (vAddr && W.venue) vAddr.textContent = W.venue.address;
  const vImg = $("#venueImg"); if (vImg && W.venue) vImg.src = W.venue.image;
  const vMaps = $("#venueMaps"); if (vMaps && W.venue) vMaps.href = W.venue.mapsLink;
  const fLine1 = $('[data-footer="line1"]'); if (fLine1 && W.footer) fLine1.textContent = W.footer.line1;
  const fLine2 = $('[data-footer="line2"]'); if (fLine2 && W.footer) fLine2.textContent = W.footer.line2;
  const bgAudio = $("#bgAudio"); if (bgAudio && W.music) bgAudio.src = W.music.src || "";

  /* ---------- Gallery (vertical carousel) ---------- */
  $("#galleryTrack").innerHTML = W.gallery.map((g, i) => `
    <div class="vslide" data-slide="${i}">
      <figure class="polaroid${g.bw ? " bw" : ""}" data-idx="${i}">
        <img src="${g.src}" alt="${g.caption || "Photo"}" loading="lazy" />
        <figcaption>${g.caption || ""}</figcaption>
      </figure>
    </div>`).join("");
  $("#galleryDots").innerHTML = W.gallery.map((_, i) =>
    `<button data-dot="${i}" aria-label="Photo ${i + 1}"></button>`).join("");

  /* ---------- Events ---------- */
  $("#eventsList").innerHTML = W.events.map(e => `
    <article class="event reveal">
      <img class="event__img" src="${e.image}" alt="${e.name}" loading="lazy" />
      <div class="event__body">
        <h3 class="event__name">${e.name}</h3>
        <p class="event__when">${e.day} · ${e.date} · ${e.time}</p>
        <p class="event__desc">“${e.description}”</p>
        <p class="event__venue">${e.venue}</p>
        <p style="margin-top:1rem"><a class="btn event__dir" href="${e.mapsLink}" target="_blank" rel="noopener">📍 Get Directions</a></p>
      </div>
    </article>`).join("");

  /* ---------- Scroll reveal (after dynamic content injected) ---------- */
  const revealAll = () => $$(".reveal:not(.is-visible)").forEach(el => el.classList.add("is-visible"));
  if (!("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(el => io.observe(el));
    // Reveal anything already on-screen at load (e.g. the hero) without waiting for scroll.
    requestAnimationFrame(() => $$(".reveal:not(.is-visible)").forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add("is-visible");
    }));
    // Safety net: never leave content invisible if the observer never fires.
    setTimeout(revealAll, 3500);
  }

  /* ---------- Music (optional) ---------- */
  const audio = $("#bgAudio"), musicBtn = $("#musicBtn");
  if (audio && musicBtn) {
    const showMusic = () => musicBtn.classList.add("is-ready");
    window.addEventListener("intro:done", showMusic);
    setTimeout(showMusic, 6000); // safety
    musicBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => { musicBtn.classList.add("is-playing"); musicBtn.title = "Pause music"; }).catch(() => {});
      } else { audio.pause(); musicBtn.classList.remove("is-playing"); musicBtn.title = "Play music"; }
    });
  }

  /* ---------- Countdown ---------- */
  const target = new Date(W.weddingDateTime).getTime();
  const set = (k, v) => { const el = $(`[data-cd="${k}"]`); if (el) el.textContent = v; };
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { ["days", "hours", "minutes", "seconds"].forEach(k => set(k, "0")); clearInterval(timer); return; }
    set("days", Math.floor(diff / 86400000));
    set("hours", String(Math.floor(diff % 86400000 / 3600000)).padStart(2, "0"));
    set("minutes", String(Math.floor(diff % 3600000 / 60000)).padStart(2, "0"));
    set("seconds", String(Math.floor(diff % 60000 / 1000)).padStart(2, "0"));
  }
  tick(); const timer = setInterval(tick, 1000);

  /* ---------- Add to Calendar (.ics) ---------- */
  $("#calBtn").addEventListener("click", () => {
    const start = new Date(W.weddingDateTime), end = new Date(start.getTime() + 4 * 3600000);
    const fmt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@wedding", "DTSTAMP:" + fmt(new Date()), "DTSTART:" + fmt(start), "DTEND:" + fmt(end),
      "SUMMARY:" + W.couple.name1 + " & " + W.couple.name2 + " — Wedding",
      "LOCATION:" + (W.venue.name + ", " + W.venue.address).replace(/,/g, "\\,"),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "wedding.ics"; a.click(); URL.revokeObjectURL(a.href);
  });

  /* ---------- Scratch card (Save the Date) ---------- */
  const sc = $("#scratchCanvas");
  if (sc && window.FX) {
    let petals;
    const startScratch = () => FX.scratch(sc, {
      onDone() {
        $("#scratchDone").classList.add("show");
        const r = sc.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 90 });
      }
    });
    // size canvas to wrapper before painting; start when section nears view
    const wrap = $("#scratchWrap");
    const obs = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (en.isIntersecting) {
          startScratch();
          if (!petals) petals = FX.petals($("#savedate"), { count: 26 });
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(wrap);
  }

  /* ---------- Gallery: vertical carousel (auto-advance + dots + lightbox) ---------- */
  const track = $("#galleryTrack");
  const slides = $$(".vslide", track);
  const dots = $$("[data-dot]");
  let cur = 0, autoTimer = null, userActive = false;

  const goTo = (i, smooth = true) => {
    cur = (i + slides.length) % slides.length;
    track.scrollTo({ top: slides[cur].offsetTop, behavior: smooth ? "smooth" : "auto" });
  };
  const markActive = () => dots.forEach((d, i) => d.classList.toggle("is-active", i === cur));
  markActive();

  // keep dots in sync as the user scrolls/swipes
  let scrollRaf;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      let nearest = 0, best = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetTop - track.scrollTop); if (d < best) { best = d; nearest = i; } });
      cur = nearest; markActive();
    });
  }, { passive: true });

  dots.forEach((d, i) => d.addEventListener("click", () => { userActive = true; goTo(i); }));

  // auto-advance, paused while the user interacts
  const startAuto = () => { stopAuto(); autoTimer = setInterval(() => { if (!userActive) goTo(cur + 1); }, 3200); };
  const stopAuto = () => { if (autoTimer) clearInterval(autoTimer); };
  ["pointerdown", "wheel", "touchstart"].forEach(ev => track.addEventListener(ev, () => {
    userActive = true; stopAuto(); clearTimeout(track._resume);
    track._resume = setTimeout(() => { userActive = false; startAuto(); }, 6000);
  }, { passive: true }));
  // only auto-play once the carousel is on screen
  new IntersectionObserver((ents, ob) => {
    ents.forEach(en => { if (en.isIntersecting) { startAuto(); } else { stopAuto(); } });
  }, { threshold: 0.3 }).observe($("#galleryCarousel"));

  /* ---------- Lightbox (tap a photo to enlarge) ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"); let licur = 0;
  const show = i => { licur = (i + W.gallery.length) % W.gallery.length; lbImg.src = W.gallery[licur].src; };
  track.addEventListener("click", e => {
    const f = e.target.closest("[data-idx]"); if (f) { show(+f.dataset.idx); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); }
  });
  const closeLb = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbNext").addEventListener("click", () => show(licur + 1));
  $("#lbPrev").addEventListener("click", () => show(licur - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowRight") show(licur + 1); if (e.key === "ArrowLeft") show(licur - 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) show(licur + (dx < 0 ? 1 : -1)); tx = null; });

  /* ---------- Share ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: W.couple.name1 + " & " + W.couple.name2, text: "You're invited! " + W.couple.hashtag, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (_) {} }
    else { try { await navigator.clipboard.writeText(location.href); const b = $("#shareBtn"), t = b.textContent; b.textContent = "Link copied!"; setTimeout(() => b.textContent = t, 1800); } catch (_) { prompt("Copy link:", location.href); } }
  });
})();
