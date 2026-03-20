-- ============================================================
--  SUPABASE DATABASE SCHEMA
--  Ayoub Elwamy Portfolio  |  Paste into: SQL Editor → Run
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─────────────────────────────────────
-- 1. PROJECTS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT 'web',   -- web | mobile | 3d | design | ai
    icon        TEXT NOT NULL DEFAULT 'fas fa-code',
    color       TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)',
    image       TEXT DEFAULT '',               -- base64 or URL
    tags        TEXT[] DEFAULT '{}',
    features    TEXT[] DEFAULT '{}',
    link        TEXT DEFAULT '#',
    github      TEXT DEFAULT '#',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- 2. ARTICLES
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    excerpt     TEXT NOT NULL,
    category    TEXT DEFAULT 'Tutorial',
    date        TEXT DEFAULT '',
    link        TEXT DEFAULT '#',
    icon        TEXT DEFAULT 'fas fa-file-code',
    color       TEXT DEFAULT 'linear-gradient(135deg, #1a7b8e, #7ba8a8)',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- 3. VIDEOS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    category    TEXT DEFAULT 'youtube',        -- youtube | vimeo | local
    url         TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url   TEXT DEFAULT '',               -- thumbnail (base64 or URL)
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- 4. TIMELINE  (My Journey)
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date        TEXT DEFAULT '',
    title       TEXT NOT NULL,
    company     TEXT DEFAULT '',
    description TEXT NOT NULL,
    icon        TEXT DEFAULT 'fas fa-briefcase',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- 5. MESSAGES  (Contact form submissions)
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT DEFAULT 'Anonymous',
    email      TEXT DEFAULT '',
    subject    TEXT DEFAULT '',
    message    TEXT DEFAULT '',
    read       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- 6. SETTINGS  (key-value store)
--    Used for: profilePhoto, etc.
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profilePhoto setting
INSERT INTO settings (key, value)
VALUES ('profilePhoto', 'assets/img/ayoub.jpg')
ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings  ENABLE ROW LEVEL SECURITY;


-- ─── PUBLIC READ policies (portfolio visitors) ───
-- Anyone can read projects, articles, videos, timeline, settings
CREATE POLICY "Public can read projects"
    ON projects FOR SELECT USING (true);

CREATE POLICY "Public can read articles"
    ON articles FOR SELECT USING (true);

CREATE POLICY "Public can read videos"
    ON videos FOR SELECT USING (true);

CREATE POLICY "Public can read timeline"
    ON timeline FOR SELECT USING (true);

CREATE POLICY "Public can read settings"
    ON settings FOR SELECT USING (true);


-- ─── PUBLIC INSERT on messages (contact form) ───
CREATE POLICY "Public can submit messages"
    ON messages FOR INSERT WITH CHECK (true);


-- ─── AUTHENTICATED WRITE policies (admin panel) ───
-- Only logged-in users (Supabase Auth) can write

CREATE POLICY "Auth users manage projects"
    ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage articles"
    ON articles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage videos"
    ON videos FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage timeline"
    ON timeline FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read messages"
    ON messages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users delete messages"
    ON messages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users update messages"
    ON messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage settings"
    ON settings FOR ALL USING (auth.role() = 'authenticated');


-- ============================================================
-- SEED DATA  (optional – delete rows you don't want)
-- ============================================================

INSERT INTO projects (title, description, category, icon, color, tags, features, link, github)
VALUES
  ('E-Commerce Platform',    'Full-stack shopping experience with modern UI and payment integration', 'web',    'fas fa-shopping-cart', 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)', ARRAY['React','Node.js','MongoDB'], ARRAY['Modern UI','Payment Integration','Admin Panel','Responsive'], '#', 'https://github.com/wamyyy'),
  ('Fitness Tracking App',   'Mobile app for workout tracking and progress analytics',                 'mobile', 'fas fa-mobile-alt',    'linear-gradient(135deg, #a33568 0%, #2c3e50 100%)', ARRAY['Flutter','Firebase','UI/UX'],  ARRAY['Workout Tracker','Progress Charts','Push Notifications'],   '#', 'https://github.com/wamyyy'),
  ('Interactive 3D Portfolio','Immersive web experience using WebGL and physics animations',           '3d',     'fas fa-cube',          'linear-gradient(135deg, #356ba3 0%, #1a2332 100%)', ARRAY['Three.js','WebGL','GSAP'],     ARRAY['3D Animations','WebGL Rendering','Physics Engine'],          '#', 'https://github.com/wamyyy'),
  ('AI Dashboard',           'Analytics platform with ML insights and real-time visualization',       'web',    'fas fa-brain',         'linear-gradient(135deg, #7b351a 0%, #2c3e50 100%)', ARRAY['Python','TensorFlow','D3.js'], ARRAY['ML Models','Real-time Charts','Data Export','AI Insights'],  '#', 'https://github.com/wamyyy')
ON CONFLICT DO NOTHING;

INSERT INTO timeline (date, title, company, description, icon)
VALUES
  ('2024 - Present', 'Full-Stack Developer',          'Freelance',               'Building modern web applications with React, Node.js, and cloud technologies.',            'fas fa-briefcase'),
  ('2022 - 2024',    'Frontend Developer',            'Creative Digital Agency',  'Developed responsive UIs for major brands. Improved performance by 40%.',                'fas fa-laptop-code'),
  ('2020 - 2022',    'UI/UX Designer & Developer',    'Startup Labs',             'Designed and developed user-centered interfaces for mobile and web applications.',       'fas fa-paint-brush'),
  ('2018 - 2020',    'Computer Science Studies',      'University',               'Focused on software engineering, algorithms, and modern web technologies.',               'fas fa-graduation-cap')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE ✅
-- All tables created with RLS policies.
-- ============================================================
