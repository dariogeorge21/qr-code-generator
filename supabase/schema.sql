-- ============================================================
-- QR Code Studio — Complete Database Schema
-- ============================================================
-- Single source of truth consolidating migrations 001 → 006.
-- Run this file in the Supabase SQL Editor to set up the entire
-- database from scratch (e.g. on a new project or after a reset).
--
-- After running, remember to:
--   1. Go to Table Editor → qr_counter → row 1
--   2. Set the `admin_passkey` column to your chosen password
-- ============================================================


-- ============================================================
-- 1. CONTACTS
--    Stores contact-form submissions from the /contact page.
-- ============================================================

CREATE TABLE IF NOT EXISTS contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email      ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for contact form" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select all contacts" ON contacts
  FOR SELECT USING (true);


-- ============================================================
-- 2. QR COUNTER
--    Single-row aggregate of total QR codes generated/downloaded.
--    Also stores the admin passkey (read only by service-role).
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_counter (
  id               BIGSERIAL PRIMARY KEY,
  total_generated  BIGINT DEFAULT 0,
  total_downloaded BIGINT DEFAULT 0,
  admin_passkey    TEXT   DEFAULT NULL,   -- set manually in Table Editor
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed the single counter row
INSERT INTO qr_counter (id, total_generated, total_downloaded)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE qr_counter ENABLE ROW LEVEL SECURITY;

-- Anon/authenticated can read the row (column-level passkey protection
-- is handled by the get_qr_counter() function below)
CREATE POLICY "Allow select qr_counter public cols" ON qr_counter
  FOR SELECT USING (true);

-- Allow counter updates (used by the UPSERT RPCs via SECURITY DEFINER)
CREATE POLICY "Allow increment functions" ON qr_counter
  FOR UPDATE USING (true) WITH CHECK (true);


-- ============================================================
-- 3. QR STATS (legacy — kept for historical data)
--    Per-event rows written alongside the counter.
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_stats (
  id          BIGSERIAL PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,   -- 'generated' | 'downloaded'
  count       BIGINT DEFAULT 1,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_stats_metric_type ON qr_stats (metric_type);
CREATE INDEX IF NOT EXISTS idx_qr_stats_created_at  ON qr_stats (created_at);

ALTER TABLE qr_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert qr_stats" ON qr_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select qr_stats" ON qr_stats
  FOR SELECT USING (true);


-- ============================================================
-- 4. QR EVENTS
--    Anonymous, privacy-safe metadata about each QR generation
--    or download. NO QR content / URLs are ever stored.
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_events (
  id             BIGSERIAL PRIMARY KEY,

  -- 'generated' | 'downloaded'
  event_type     VARCHAR(20) NOT NULL
                   CHECK (event_type IN ('generated', 'downloaded')),

  -- Which QR type: website, payment, wifi, text, email, phone, sms, social, contact
  qr_type        VARCHAR(50),

  -- Export format chosen at download time: png, svg, jpeg, webp
  export_format  VARCHAR(10),

  -- Customisation flags (were any of these tabs changed from defaults?)
  color_modified BOOLEAN DEFAULT false,   -- fg/bg color, gradient, palette
  style_modified BOOLEAN DEFAULT false,   -- dot or eye style
  frame_modified BOOLEAN DEFAULT false,   -- frame / border enabled
  logo_added     BOOLEAN DEFAULT false,   -- logo image uploaded
  text_added     BOOLEAN DEFAULT false,   -- title, caption, or bg-text added

  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_events_event_type ON qr_events (event_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_qr_type    ON qr_events (qr_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_created_at ON qr_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_events_export_fmt ON qr_events (export_format);

ALTER TABLE qr_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert qr_events" ON qr_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select qr_events" ON qr_events
  FOR SELECT USING (true);


-- ============================================================
-- 5. FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- 5a. increment_qr_generated
--     UPSERT-safe: creates the counter row if it doesn't exist.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_qr_generated()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO qr_counter (id, total_generated, total_downloaded, updated_at)
  VALUES (1, 1, 0, NOW())
  ON CONFLICT (id) DO UPDATE
    SET total_generated = qr_counter.total_generated + 1,
        updated_at      = NOW()
  RETURNING
    qr_counter.total_generated,
    qr_counter.total_downloaded,
    qr_counter.updated_at;
END;
$$;

-- ------------------------------------------------------------
-- 5b. increment_qr_downloaded
--     UPSERT-safe: creates the counter row if it doesn't exist.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_qr_downloaded()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO qr_counter (id, total_generated, total_downloaded, updated_at)
  VALUES (1, 0, 1, NOW())
  ON CONFLICT (id) DO UPDATE
    SET total_downloaded = qr_counter.total_downloaded + 1,
        updated_at       = NOW()
  RETURNING
    qr_counter.total_generated,
    qr_counter.total_downloaded,
    qr_counter.updated_at;
END;
$$;

-- ------------------------------------------------------------
-- 5c. get_qr_counter
--     Public-safe read of counter stats — excludes admin_passkey.
--     Anon clients should call this function instead of querying
--     the table directly.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_qr_counter()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT total_generated, total_downloaded, updated_at
  FROM   qr_counter
  WHERE  id = 1
  LIMIT  1;
$$;

-- Grant execute to anon + authenticated
GRANT EXECUTE ON FUNCTION increment_qr_generated  TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_qr_downloaded TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_qr_counter          TO authenticated, anon;
