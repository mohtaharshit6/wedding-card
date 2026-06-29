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
  $('[data-venue="name"]').textContent = W.venue.name;
  $('[data-venue="address"]').textContent = W.venue.address;
  $("#venueImg").src = W.venue.image;
  $("#venueMaps").href = W.venue.mapsLink;
  $('[data-footer="line1"]').textContent = W.footer.line1;
  $('[data-footer="line2"]').textContent = W.footer.line2;
  $("#bgAudio").src = W.music.src;

  /* ---------- Gallery (polaroids) ---------- */
  $("#galleryGrid").innerHTML = W.gallery.map((g, i) => `
    <figure class="polaroid${g.bw ? " bw" : ""}" data-idx="${i}">
      <img src="${g.src}" alt="${g.caption || "Photo"}" loading="lazy" />
      <figcaption>${g.caption || ""}</figcaption>
    </figure>`).join("");

  /* ---------- Events ---------- */
  $("#eventsList").innerHTML = W.events.map(e => {
    const dots = (e.dressCode.colors || []).map(c => `<i style="background:${c}"></i>`).join("");
    return `
    <article class="event reveal">
      <img class="event__img" src="${e.image}" alt="${e.name}" loading="lazy" />
      <div class="event__body">
        <h3 class="event__name">${e.name}</h3>
        <p class="event__when">${e.day} · ${e.date} · ${e.time}</p>
        <p class="event__desc">“${e.description}”</p>
        <p class="event__venue">${e.venue}</p>
        <div class="event__dress"><span>Dress code:</span><span class="dress__dots">${dots}</span><span>${e.dressCode.label}</span></div>
        <p style="margin-top:1rem"><a class="btn event__dir" href="${e.mapsLink}" target="_blank" rel="noopener">📍 Get Directions</a></p>
      </div>
    </article>`;
  }).join("");

  /* ---------- RSVP preferences ---------- */
  $("#rPref").innerHTML = (W.rsvp.preferences || ["No preference"])
    .map(p => `<option>${p}</option>`).join("");

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

  /* ---------- Music ---------- */
  const audio = $("#bgAudio"), musicBtn = $("#musicBtn");
  const showMusic = () => musicBtn.classList.add("is-ready");
  window.addEventListener("intro:done", showMusic);
  setTimeout(showMusic, 6000); // safety
  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => { musicBtn.classList.add("is-playing"); musicBtn.title = "Pause music"; }).catch(() => {});
    } else { audio.pause(); musicBtn.classList.remove("is-playing"); musicBtn.title = "Play music"; }
  });

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

  /* ---------- Gallery lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"); let li = 0;
  const show = i => { li = (i + W.gallery.length) % W.gallery.length; lbImg.src = W.gallery[li].src; };
  $("#galleryGrid").addEventListener("click", e => {
    const f = e.target.closest("[data-idx]"); if (f) { show(+f.dataset.idx); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); }
  });
  const closeLb = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbNext").addEventListener("click", () => show(li + 1));
  $("#lbPrev").addEventListener("click", () => show(li - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb(); if (e.key === "ArrowRight") show(li + 1); if (e.key === "ArrowLeft") show(li - 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) show(li + (dx < 0 ? 1 : -1)); tx = null; });

  /* ---------- RSVP attend toggle ---------- */
  $$(".attend__btn").forEach(b => b.addEventListener("click", () => {
    $$(".attend__btn").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    $("#rAttend").value = b.dataset.attend;
  }));

  /* ---------- RSVP submit ---------- */
  const form = $("#rsvpForm"), status = $("#rsvpStatus");
  const setStatus = (m, c) => { status.textContent = m; status.className = "rsvp__status " + (c || ""); };
  const showThanks = () => {
    $("#rsvpFormWrap").hidden = true;
    const ty = $("#thankyou"); ty.hidden = false;
    const r = ty.getBoundingClientRect();
    if (window.FX) FX.burst(innerWidth / 2, Math.max(120, r.top + 80), { count: 140 });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = {
      name: $("#rName").value.trim(), contact: $("#rContact").value.trim(),
      attending: $("#rAttend").value, guests: $("#rGuests").value,
      preference: $("#rPref").value, message: $("#rMsg").value.trim(),
    };
    if (!d.name) { setStatus("Please enter your name.", "err"); return; }
    const r = W.rsvp;
    const summary = `RSVP — ${d.name}\n${d.attending}\nGuests: ${d.guests}\nMeal: ${d.preference}` +
      (d.contact ? `\nContact: ${d.contact}` : "") + (d.message ? `\nMessage: ${d.message}` : "");

    if (r.provider === "formspree" && r.formspreeId) {
      setStatus("Sending…");
      fetch("https://formspree.io/f/" + r.formspreeId, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(res => res.ok ? showThanks() : setStatus("Something went wrong — please try again.", "err"))
        .catch(() => setStatus("Network error — please try again.", "err"));
    } else if (r.provider === "googleForm" && r.googleForm.action) {
      const fd = new FormData(), g = r.googleForm;
      if (g.nameField) fd.append(g.nameField, d.name);
      if (g.attendingField) fd.append(g.attendingField, d.attending);
      if (g.guestsField) fd.append(g.guestsField, d.guests);
      if (g.messageField) fd.append(g.messageField, d.message);
      fetch(g.action, { method: "POST", mode: "no-cors", body: fd }).then(showThanks).catch(showThanks);
    } else if (r.provider === "mailto") {
      window.location.href = `mailto:${r.email}?subject=${encodeURIComponent("Wedding RSVP — " + d.name)}&body=${encodeURIComponent(summary)}`;
      showThanks();
    } else { // whatsapp
      window.open("https://wa.me/" + r.whatsappNumber + "?text=" + encodeURIComponent(summary), "_blank");
      showThanks();
    }
  });

  /* ---------- Share ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: W.couple.name1 + " & " + W.couple.name2, text: "You're invited! " + W.couple.hashtag, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (_) {} }
    else { try { await navigator.clipboard.writeText(location.href); const b = $("#shareBtn"), t = b.textContent; b.textContent = "Link copied!"; setTimeout(() => b.textContent = t, 1800); } catch (_) { prompt("Copy link:", location.href); } }
  });
})();
