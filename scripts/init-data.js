const fs = require('fs');

const initialData = {
  wedding: {
    id: "madhav-ritika-wedding",
    slug: "madhav-ritika",
    status: "published",
    couple_name1: "Madhav",
    couple_name2: "Ritika",
    monogram: "M&R",
    parents1: "Son of Mr. & Mrs. Daga",
    parents2: "Daughter of Mr. & Mrs. Mohta",
    hashtag: "#MadhavWedsRitika",
    emblem_type: "ganesha",
    emblem_url: "/assets/img/ganesha.png",
    has_shloka: true,
    shloka_line1: "॥ श्री गणेशाय नमः ॥",
    shloka_line2: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।",
    shloka_line3: "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    blessing_text: "With the blessings of Shri Ganesh and our beloved families, we joyfully invite you to celebrate the union of",
    wedding_date_time: "2026-07-01T17:00:00",
    venue_name: "Rajalakshmi Kalyana Mandapam",
    venue_address: "No. 1, Temple Road, Chennai, Tamil Nadu 600001",
    venue_image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80",
    venue_maps_link: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam",
    music_url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=relaxing-145038.mp3",
    footer_line1: "Come laugh, dance, and celebrate with us in true Bollywood style!",
    footer_line2: "Together, we’ll turn this real-life romance into a blockbuster we’ll never forget."
  },
  theme: {
    wedding_id: "madhav-ritika-wedding",
    color_primary: "#6E1414",
    color_secondary: "#8E1B1B",
    color_accent: "#C9A24B",
    color_accent_soft: "#E3C77E",
    color_background: "#F6EEE0",
    color_background_alt: "#EFE3CF",
    color_rose: "#B6566B",
    color_ink: "#3A2A22"
  },
  events: [
    {
      id: "e1",
      wedding_id: "madhav-ritika-wedding",
      sort_order: 1,
      name: "Mehndi",
      day: "Sunday",
      date: "28 Jun 2026",
      time: "11:00 AM",
      image_url: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?auto=format&fit=crop&w=900&q=80",
      description: "Henna, music and laughter to begin the celebrations.",
      dress_code_label: "Bright Greens · Yellows · Comfortable ethnic",
      dress_code_colors: ["#3FA34D", "#F2C94C", "#E07A5F"],
      venue: "Family Residence · Garden Lawn",
      maps_link: "https://www.google.com/maps/search/?api=1&query=wedding+venue"
    },
    {
      id: "e2",
      wedding_id: "madhav-ritika-wedding",
      sort_order: 2,
      name: "Haldi",
      day: "Monday",
      date: "29 Jun 2026",
      time: "10:00 AM",
      image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80",
      description: "A morning of turmeric, blessings and golden glow.",
      dress_code_label: "Yellow · Marigold · Floral",
      dress_code_colors: ["#F2C94C", "#F2994A", "#F6EEE0"],
      venue: "Family Residence · Courtyard",
      maps_link: "https://www.google.com/maps/search/?api=1&query=wedding+venue"
    },
    {
      id: "e3",
      wedding_id: "madhav-ritika-wedding",
      sort_order: 3,
      name: "Sangeet Night",
      day: "Tuesday",
      date: "30 Jun 2026",
      time: "7:00 PM",
      image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
      description: "An evening of music, dance, and endless celebration.",
      dress_code_label: "Pastel Pink · Peach · Mint · Comfortable & breezy",
      dress_code_colors: ["#F6C6D0", "#F2C9A0", "#A8D5BA"],
      venue: "Pench Resort · Poolside Lawn",
      maps_link: "https://www.google.com/maps/search/?api=1&query=wedding+venue"
    },
    {
      id: "e4",
      wedding_id: "madhav-ritika-wedding",
      sort_order: 4,
      name: "Phere",
      day: "Wednesday",
      date: "01 Jul 2026",
      time: "5:00 PM",
      image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
      description: "The sacred vows, taken seven times around the holy fire.",
      dress_code_label: "Traditional · Reds · Golds",
      dress_code_colors: ["#8E1B1B", "#C9A24B", "#B6566B"],
      venue: "Rajalakshmi Kalyana Mandapam",
      maps_link: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam"
    },
    {
      id: "e5",
      wedding_id: "madhav-ritika-wedding",
      sort_order: 5,
      name: "Reception",
      day: "Wednesday",
      date: "01 Jul 2026",
      time: "8:30 PM",
      image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
      description: "Dinner, toasts and one last dance to seal the night.",
      dress_code_label: "Formal · Jewel tones",
      dress_code_colors: ["#1A2A6C", "#6E1414", "#C9A24B"],
      venue: "Rajalakshmi Kalyana Mandapam · Grand Hall",
      maps_link: "https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam"
    }
  ],
  gallery: [
    { id: "g1", wedding_id: "madhav-ritika-wedding", sort_order: 1, image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80", caption: "Where it all began", is_bw: false },
    { id: "g2", wedding_id: "madhav-ritika-wedding", sort_order: 2, image_url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80", caption: "Memories together", is_bw: true },
    { id: "g3", wedding_id: "madhav-ritika-wedding", sort_order: 3, image_url: "https://images.unsplash.com/photo-1604504244422-29c6f1f3f4e0?auto=format&fit=crop&w=800&q=80", caption: "Forever & always", is_bw: false },
    { id: "g4", wedding_id: "madhav-ritika-wedding", sort_order: 4, image_url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80", caption: "Two hearts, one story", is_bw: true },
    { id: "g5", wedding_id: "madhav-ritika-wedding", sort_order: 5, image_url: "https://images.unsplash.com/photo-1620740475022-1c10b2a0a5b3?auto=format&fit=crop&w=800&q=80", caption: "Made for each other", is_bw: false },
    { id: "g6", wedding_id: "madhav-ritika-wedding", sort_order: 6, image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", caption: "The adventure begins", is_bw: false }
  ],
  rsvpConfig: {
    wedding_id: "madhav-ritika-wedding",
    mode: "database",
    whatsapp_number: "919999999999",
    email: "madhav.ritika.wedding@example.com",
    deadline_date: "2026-06-15",
    meal_options: ["No preference", "Vegetarian", "Jain", "Vegan", "No onion / no garlic"]
  }
};

fs.writeFileSync("data/wedding.json", JSON.stringify(initialData, null, 2), "utf8");

const initialRsvps = [
  {
    id: "r1",
    wedding_id: "madhav-ritika-wedding",
    guest_name: "Ananya Sharma",
    contact: "+91 98765 43210",
    attending_status: "Joyfully accepts",
    guest_count: 2,
    meal_preference: "Vegetarian",
    message: "Wishing you both a lifetime of happiness, laughter and unconditional love!",
    submitted_at: "2026-11-05T10:30:00Z"
  },
  {
    id: "r2",
    wedding_id: "madhav-ritika-wedding",
    guest_name: "Vikram & Priya Singhania",
    contact: "vikram.singh@example.com",
    attending_status: "Joyfully accepts",
    guest_count: 4,
    meal_preference: "Jain",
    message: "So thrilled to celebrate with you! See you at the Sangeet.",
    submitted_at: "2026-11-04T15:20:00Z"
  }
];

fs.writeFileSync("data/rsvps.json", JSON.stringify(initialRsvps, null, 2), "utf8");
console.log("Initialized data/wedding.json and data/rsvps.json");
