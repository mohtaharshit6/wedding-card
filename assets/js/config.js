/* =====================================================================
   ⭐ THE ONLY FILE YOU NEED TO EDIT ⭐
   Replica of the cinematic Indian wedding invitation.
   Everything on the page is driven from this object.
   Photos/illustrations: drop files in assets/img/ and point the URL to
   e.g. "assets/img/sangeet.jpg".  Defaults are free online placeholders.
   ===================================================================== */

const WEDDING = {

  /* ---------- The couple ---------- */
  couple: {
    name1: "Ritika",
    name2: "Madhav",
    monogram: "R&M",
    // Parents' line shown under the names on the invitation:
    parents1: "Daughter of Mr. & Mrs. Mohta",
    parents2: "Son of Mr. & Mrs. Daga",
    hashtag: "#RitikaWedsMadhav",
  },

  /* ---------- Ganesh invocation (top of the invitation) ---------- */
  shloka: {
    line1: "॥ श्री गणेशाय नमः ॥",
    line2: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।",
    line3: "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    blessing: "With the blessings of Shri Ganesh and our beloved families, we joyfully invite you to celebrate the union of",
  },

  /* ---------- The big day ----------
     Format: "YYYY-MM-DDTHH:MM:SS" (local time). Drives countdown + calendar. */
  weddingDateTime: "2026-07-01T17:00:00",

  /* ---------- Save the Date (scratch card reveals these) ---------- */
  saveTheDate: { month: "JULY", day: "01", year: "2026" },

  /* ---------- Forever Us — photo gallery (polaroids) ----------
     bw:true renders the photo in black & white. caption is handwritten-style. */
  gallery: [
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80", caption: "Where it all began", bw: false },
    { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80", caption: "Memories together", bw: true },
    { src: "https://images.unsplash.com/photo-1604504244422-29c6f1f3f4e0?auto=format&fit=crop&w=800&q=80", caption: "Forever & always", bw: false },
    { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80", caption: "Two hearts, one story", bw: true },
    { src: "https://images.unsplash.com/photo-1620740475022-1c10b2a0a5b3?auto=format&fit=crop&w=800&q=80", caption: "Made for each other", bw: false },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", caption: "The adventure begins", bw: false },
  ],

  /* ---------- Events & Rituals ----------
     image: a scene illustration/photo. dressCode.colors = swatch dots. */
  events: [
    {
      name: "Mehndi",
      day: "Sunday", date: "28 Jun 2026", time: "11:00 AM",
      image: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?auto=format&fit=crop&w=900&q=80",
      description: "Henna, music and laughter to begin the celebrations.",
      dressCode: { label: "Bright Greens · Yellows · Comfortable ethnic", colors: ["#3FA34D", "#F2C94C", "#E07A5F"] },
      venue: "Family Residence · Garden Lawn",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=wedding+venue",
    },
    {
      name: "Haldi",
      day: "Monday", date: "29 Jun 2026", time: "10:00 AM",
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80",
      description: "A morning of turmeric, blessings and golden glow.",
      dressCode: { label: "Yellow · Marigold · Floral", colors: ["#F2C94C", "#F2994A", "#F6EEE0"] },
      venue: "Family Residence · Courtyard",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=wedding+venue",
    },
    {
      name: "Sangeet Night",
      day: "Tuesday", date: "30 Jun 2026", time: "7:00 PM",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
      description: "An evening of music, dance, and endless celebration.",
      dressCode: { label: "Pastel Pink · Peach · Mint · Comfortable & breezy", colors: ["#F6C6D0", "#F2C9A0", "#A8D5BA"] },
      venue: "Pench Resort · Poolside Lawn",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=wedding+venue",
    },
    {
      name: "Phere",
      day: "Wednesday", date: "01 Jul 2026", time: "5:00 PM",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
      description: "The sacred vows, taken seven times around the holy fire.",
      dressCode: { label: "Traditional · Reds · Golds", colors: ["#8E1B1B", "#C9A24B", "#B6566B"] },
      venue: "Rajalakshmi Kalyana Mandapam",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam",
    },
    {
      name: "Reception",
      day: "Wednesday", date: "01 Jul 2026", time: "8:30 PM",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
      description: "Dinner, toasts and one last dance to seal the night.",
      dressCode: { label: "Formal · Jewel tones", colors: ["#1A2A6C", "#6E1414", "#C9A24B"] },
      venue: "Rajalakshmi Kalyana Mandapam · Grand Hall",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam",
    },
  ],

  /* ---------- Featured venue ---------- */
  venue: {
    name: "Rajalakshmi Kalyana Mandapam",
    address: "No. 1, Temple Road, Chennai, Tamil Nadu 600001",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam",
  },

  /* ---------- RSVP ----------
     provider: "whatsapp" | "mailto" | "formspree" | "googleForm"
     (whatsapp works instantly — no setup) */
  rsvp: {
    provider: "whatsapp",
    whatsappNumber: "919999999999",
    email: "meenal.avinash.wedding@example.com",
    formspreeId: "",
    googleForm: { action: "", nameField: "", attendingField: "", guestsField: "", messageField: "" },
    preferences: ["No preference", "Vegetarian", "Jain", "Vegan", "No onion / no garlic"],
  },

  /* ---------- Playful closing line (red footer) ---------- */
  footer: {
    line1: "Come laugh, dance, and celebrate with us in true Bollywood style!",
    line2: "Together, we’ll turn this real-life romance into a blockbuster we’ll never forget.",
  },

  /* ---------- Background music ---------- */
  music: {
    // Royalty-free placeholder. Swap for "assets/audio/music.mp3".
    src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=relaxing-145038.mp3",
  },
};

// Expose to other scripts (a top-level `const` is NOT added to window automatically).
window.WEDDING = WEDDING;
