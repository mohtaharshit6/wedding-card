-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WEDDINGS TABLE
CREATE TABLE IF NOT EXISTS weddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    couple_name1 VARCHAR(100) NOT NULL,
    couple_name2 VARCHAR(100) NOT NULL,
    monogram VARCHAR(20),
    parents1 TEXT,
    parents2 TEXT,
    hashtag VARCHAR(100),
    emblem_type VARCHAR(20) NOT NULL DEFAULT 'ganesha' CHECK (emblem_type IN ('ganesha', 'custom', 'monogram', 'none')),
    emblem_url TEXT,
    has_shloka BOOLEAN NOT NULL DEFAULT true,
    shloka_line1 TEXT,
    shloka_line2 TEXT,
    shloka_line3 TEXT,
    blessing_text TEXT,
    wedding_date_time TIMESTAMPTZ NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    venue_image_url TEXT,
    venue_maps_link TEXT,
    music_url TEXT,
    footer_line1 TEXT,
    footer_line2 TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. THEME CONFIGS TABLE
CREATE TABLE IF NOT EXISTS theme_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID UNIQUE NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    color_primary VARCHAR(20) NOT NULL DEFAULT '#6E1414',
    color_secondary VARCHAR(20) NOT NULL DEFAULT '#8E1B1B',
    color_accent VARCHAR(20) NOT NULL DEFAULT '#C9A24B',
    color_accent_soft VARCHAR(20) NOT NULL DEFAULT '#E3C77E',
    color_background VARCHAR(20) NOT NULL DEFAULT '#F6EEE0',
    color_background_alt VARCHAR(20) NOT NULL DEFAULT '#EFE3CF',
    color_rose VARCHAR(20) NOT NULL DEFAULT '#B6566B',
    color_ink VARCHAR(20) NOT NULL DEFAULT '#3A2A22'
);

-- 3. WEDDING EVENTS TABLE
CREATE TABLE IF NOT EXISTS wedding_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    day VARCHAR(50),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    image_url TEXT,
    description TEXT,
    dress_code_label TEXT,
    dress_code_colors JSONB DEFAULT '[]'::jsonb,
    venue TEXT,
    maps_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_bw BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. RSVP CONFIGS TABLE
CREATE TABLE IF NOT EXISTS rsvp_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID UNIQUE NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    mode VARCHAR(20) NOT NULL DEFAULT 'database' CHECK (mode IN ('database', 'whatsapp', 'disabled')),
    whatsapp_number VARCHAR(30),
    email VARCHAR(255),
    deadline_date DATE,
    meal_options JSONB NOT NULL DEFAULT '["No preference", "Vegetarian", "Jain", "Vegan", "No onion / no garlic"]'::jsonb
);

-- 6. RSVP SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS rsvp_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name VARCHAR(150) NOT NULL,
    contact VARCHAR(150),
    attending_status VARCHAR(50) NOT NULL,
    guest_count INT NOT NULL DEFAULT 1,
    meal_preference VARCHAR(100),
    message TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_status ON weddings(status);
CREATE INDEX IF NOT EXISTS idx_wedding_events_wid_order ON wedding_events(wedding_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_wid_order ON gallery_photos(wedding_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_wid ON rsvp_submissions(wedding_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- POLICIES: PUBLIC READ ACCESS FOR PUBLISHED WEDDINGS
CREATE POLICY "Public read published weddings" ON weddings
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published theme_configs" ON theme_configs
    FOR SELECT USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = theme_configs.wedding_id AND weddings.status = 'published'));

CREATE POLICY "Public read published events" ON wedding_events
    FOR SELECT USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_events.wedding_id AND weddings.status = 'published'));

CREATE POLICY "Public read published gallery" ON gallery_photos
    FOR SELECT USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = gallery_photos.wedding_id AND weddings.status = 'published'));

CREATE POLICY "Public read published rsvp_configs" ON rsvp_configs
    FOR SELECT USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = rsvp_configs.wedding_id AND weddings.status = 'published'));

-- POLICIES: PUBLIC RSVP INSERTION
CREATE POLICY "Public can submit RSVP for published weddings" ON rsvp_submissions
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM weddings 
        JOIN rsvp_configs ON rsvp_configs.wedding_id = weddings.id 
        WHERE weddings.id = rsvp_submissions.wedding_id 
          AND weddings.status = 'published' 
          AND rsvp_configs.mode = 'database'
    ));

-- POLICIES: AUTHENTICATED ADMIN FULL ACCESS
CREATE POLICY "Admins full access weddings" ON weddings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access theme_configs" ON theme_configs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access events" ON wedding_events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access gallery" ON gallery_photos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access rsvp_configs" ON rsvp_configs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access rsvp_submissions" ON rsvp_submissions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SEED DATA: ORIGINAL WEDDING (Ritika & Madhav)
DO 
DECLARE
    v_wedding_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM weddings WHERE slug = 'ritika-madhav') THEN
        INSERT INTO weddings (
            slug, status, couple_name1, couple_name2, monogram, parents1, parents2, hashtag,
            emblem_type, emblem_url, has_shloka, shloka_line1, shloka_line2, shloka_line3, blessing_text,
            wedding_date_time, venue_name, venue_address, venue_image_url, venue_maps_link,
            music_url, footer_line1, footer_line2
        ) VALUES (
            'ritika-madhav', 'published', 'Ritika', 'Madhav', 'R&M',
            'Daughter of Mr. & Mrs. Mohta', 'Son of Mr. & Mrs. Daga', '#RitikaWedsMadhav',
            'ganesha', '/assets/img/ganesha.png', true,
            '॥ श्री गणेशाय नमः ॥',
            'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।',
            'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
            'With the blessings of Shri Ganesh and our beloved families, we joyfully invite you to celebrate the union of',
            '2026-07-01T17:00:00+05:30',
            'Rajalakshmi Kalyana Mandapam',
            'No. 1, Temple Road, Chennai, Tamil Nadu 600001',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
            'https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam',
            'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=relaxing-145038.mp3',
            'Come laugh, dance, and celebrate with us in true Bollywood style!',
            'Together, we’ll turn this real-life romance into a blockbuster we’ll never forget.'
        ) RETURNING id INTO v_wedding_id;

        -- Theme
        INSERT INTO theme_configs (wedding_id) VALUES (v_wedding_id);

        -- RSVP Config
        INSERT INTO rsvp_configs (wedding_id, mode, whatsapp_number, email) 
        VALUES (v_wedding_id, 'database', '919999999999', 'meenal.avinash.wedding@example.com');

        -- Events
        INSERT INTO wedding_events (wedding_id, sort_order, name, day, date, time, image_url, description, dress_code_label, dress_code_colors, venue, maps_link)
        VALUES
        (v_wedding_id, 1, 'Mehndi', 'Sunday', '28 Jun 2026', '11:00 AM', 'https://images.unsplash.com/photo-1595407753234-0882f1e77954?auto=format&fit=crop&w=900&q=80', 'Henna, music and laughter to begin the celebrations.', 'Bright Greens · Yellows · Comfortable ethnic', '["#3FA34D", "#F2C94C", "#E07A5F"]'::jsonb, 'Family Residence · Garden Lawn', 'https://www.google.com/maps/search/?api=1&query=wedding+venue'),
        (v_wedding_id, 2, 'Haldi', 'Monday', '29 Jun 2026', '10:00 AM', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80', 'A morning of turmeric, blessings and golden glow.', 'Yellow · Marigold · Floral', '["#F2C94C", "#F2994A", "#F6EEE0"]'::jsonb, 'Family Residence · Courtyard', 'https://www.google.com/maps/search/?api=1&query=wedding+venue'),
        (v_wedding_id, 3, 'Sangeet Night', 'Tuesday', '30 Jun 2026', '7:00 PM', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', 'An evening of music, dance, and endless celebration.', 'Pastel Pink · Peach · Mint · Comfortable & breezy', '["#F6C6D0", "#F2C9A0", "#A8D5BA"]'::jsonb, 'Pench Resort · Poolside Lawn', 'https://www.google.com/maps/search/?api=1&query=wedding+venue'),
        (v_wedding_id, 4, 'Phere', 'Wednesday', '01 Jul 2026', '5:00 PM', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80', 'The sacred vows, taken seven times around the holy fire.', 'Traditional · Reds · Golds', '["#8E1B1B", "#C9A24B", "#B6566B"]'::jsonb, 'Rajalakshmi Kalyana Mandapam', 'https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam'),
        (v_wedding_id, 5, 'Reception', 'Wednesday', '01 Jul 2026', '8:30 PM', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80', 'Dinner, toasts and one last dance to seal the night.', 'Formal · Jewel tones', '["#1A2A6C", "#6E1414", "#C9A24B"]'::jsonb, 'Rajalakshmi Kalyana Mandapam · Grand Hall', 'https://www.google.com/maps/search/?api=1&query=Rajalakshmi+Kalyana+Mandapam');

        -- Gallery Photos
        INSERT INTO gallery_photos (wedding_id, sort_order, image_url, caption, is_bw)
        VALUES
        (v_wedding_id, 1, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'Where it all began', false),
        (v_wedding_id, 2, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80', 'Memories together', true),
        (v_wedding_id, 3, 'https://images.unsplash.com/photo-1604504244422-29c6f1f3f4e0?auto=format&fit=crop&w=800&q=80', 'Forever & always', false),
        (v_wedding_id, 4, 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80', 'Two hearts, one story', true),
        (v_wedding_id, 5, 'https://images.unsplash.com/photo-1620740475022-1c10b2a0a5b3?auto=format&fit=crop&w=800&q=80', 'Made for each other', false),
        (v_wedding_id, 6, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'The adventure begins', false);
    END IF;
END ;
