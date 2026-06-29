# Cinematic Wedding Invitation (replica of `invifest-demo.vercel.app`)

A single-page, mobile-first Indian wedding invitation: cinematic envelope→galaxy intro,
scratch-to-reveal date, countdown, polaroid gallery, illustrated event cards, RSVP with a
thank-you state, background music, and a Bollywood-style footer.

Pure HTML/CSS/JS — **no build step, no dependencies**. Open `index.html` and it runs.

## ✏️ Personalize (edit only `assets/js/config.js`)

| Key | Controls |
|-----|----------|
| `couple` | Names, parents' lines, hashtag |
| `shloka` | Ganesh invocation + blessing line |
| `weddingDateTime` | Countdown + Add-to-Calendar |
| `saveTheDate` | The month/day/year revealed by the scratch card |
| `gallery[]` | "Forever Us" polaroids (`bw:true` = black & white, `caption`) |
| `events[]` | Each ritual card: name, day/date/time, image, description, dressCode + swatches, venue, map |
| `venue` | Featured hall photo, name, address, map link |
| `rsvp` | How responses reach you (see below) |
| `footer` | Closing message |
| `music` | Background track |

**Photos / illustrations:** the defaults are free online placeholders. Drop your own into
`assets/img/` and point the URL to e.g. `assets/img/sangeet.jpg`. The event images are meant to be
swapped for hand-painted illustrations later.

**Colors / fonts:** edit the `--` variables at the top of `assets/css/styles.css`.

## 📨 RSVP options (`rsvp.provider`)
- `"whatsapp"` (default) — opens WhatsApp prefilled. Set `whatsappNumber`. Works instantly.
- `"mailto"` — opens the guest's email app. Set `email`.
- `"formspree"` — real submissions to your inbox. Make a free form at formspree.io → set `formspreeId`.
- `"googleForm"` — posts to a Google Form. Fill the `googleForm` field IDs.

Any provider shows the **Thank-You** state with a confetti burst after submitting.

## 🎬 Notes
- The intro plays **once per browser session** (sessionStorage). Clear it or open a new private
  window to see it again. A **Skip** button is always available.
- Background music can't autoplay with sound (browser policy) — tap the ♪ button (bottom-right).
- `prefers-reduced-motion` users skip the intro and particle effects automatically.

## 🚀 Deploy (free)
- **Netlify / Vercel:** drag this folder onto their dashboard.
- **GitHub Pages:** push to a repo, enable Pages.
- Or just send the folder — `index.html` opens offline (map/RSVP/music need network).

## 🧹 Housekeeping
The `frames/`, `crop/`, `zoom/` folders are reference stills extracted from the sample video for
matching the design — safe to delete.
