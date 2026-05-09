-- ============================================================
-- QR Code Studio — NeonDB Schema
-- ============================================================
-- This schema is derived from `supabase/schema.sql`, but stripped
-- of Supabase-specific RLS/policies/role grants.
--
-- Apply with:
--   psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================

-- ============================================================
-- 1. CONTACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_contacts_email      ON qr_contacts (email);
CREATE INDEX IF NOT EXISTS idx_qr_contacts_created_at ON qr_contacts (created_at DESC);


-- ============================================================
-- 2. QR COUNTER
--    Single-row aggregate of total generated/downloaded.
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_counter (
  id               BIGSERIAL PRIMARY KEY,
  total_generated  BIGINT DEFAULT 0,
  total_downloaded BIGINT DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the single counter row
INSERT INTO qr_counter (id, total_generated, total_downloaded)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. QR STATS (legacy — kept for historical data)
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_stats (
  id          BIGSERIAL PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,   -- 'generated' | 'downloaded'
  count       BIGINT DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_stats_metric_type ON qr_stats (metric_type);
CREATE INDEX IF NOT EXISTS idx_qr_stats_created_at  ON qr_stats (created_at);


-- ============================================================
-- 4. QR EVENTS
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

  -- Customisation flags
  color_modified BOOLEAN DEFAULT false,
  style_modified BOOLEAN DEFAULT false,
  frame_modified BOOLEAN DEFAULT false,
  logo_added     BOOLEAN DEFAULT false,
  text_added     BOOLEAN DEFAULT false,

  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_events_event_type ON qr_events (event_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_qr_type    ON qr_events (qr_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_created_at ON qr_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_events_export_fmt ON qr_events (export_format);


-- ============================================================
-- 5. FUNCTIONS
-- ============================================================

-- 5a. increment_qr_generated
CREATE OR REPLACE FUNCTION increment_qr_generated()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMPTZ
)
LANGUAGE plpgsql
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

-- 5b. increment_qr_downloaded
CREATE OR REPLACE FUNCTION increment_qr_downloaded()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMPTZ
)
LANGUAGE plpgsql
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

-- 5c. get_qr_counter
CREATE OR REPLACE FUNCTION get_qr_counter()
RETURNS TABLE (
  total_generated  BIGINT,
  total_downloaded BIGINT,
  updated_at       TIMESTAMPTZ
)
LANGUAGE sql
AS $$
  SELECT total_generated, total_downloaded, updated_at
  FROM   qr_counter
  WHERE  id = 1
  LIMIT  1;
$$;
