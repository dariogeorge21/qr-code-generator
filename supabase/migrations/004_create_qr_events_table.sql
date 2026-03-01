-- ============================================================
-- QR Events Table — Detailed Anonymous Usage Analytics
-- ============================================================
-- PRIVACY NOTICE:
--   • NO QR code content or URLs are ever stored.
--   • NO user identifiers (IP, device, fingerprint) are stored.
--   • Only anonymous metadata about WHAT was created/downloaded.
-- ============================================================

CREATE TABLE IF NOT EXISTS qr_events (
  id              BIGSERIAL PRIMARY KEY,

  -- 'generated' = user started creating a QR type
  -- 'downloaded' = user actually downloaded the finished QR
  event_type      VARCHAR(20) NOT NULL CHECK (event_type IN ('generated', 'downloaded')),

  -- Which QR type was created (website, payment, wifi, text, email, phone, sms, social, contact)
  qr_type         VARCHAR(50),

  -- Export format chosen at download time (png, svg, jpeg, webp)
  export_format   VARCHAR(10),

  -- Customisation flags — were any of these tabs modified from defaults?
  color_modified  BOOLEAN DEFAULT false,   -- fg/bg color, gradient, palette changed
  style_modified  BOOLEAN DEFAULT false,   -- dot style or eye style changed
  frame_modified  BOOLEAN DEFAULT false,   -- frame/border was enabled
  logo_added      BOOLEAN DEFAULT false,   -- a logo image was uploaded
  text_added      BOOLEAN DEFAULT false,   -- title, caption, or bg-text was added

  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast analytics aggregation
CREATE INDEX IF NOT EXISTS idx_qr_events_event_type  ON qr_events (event_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_qr_type     ON qr_events (qr_type);
CREATE INDEX IF NOT EXISTS idx_qr_events_created_at  ON qr_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_events_export_fmt  ON qr_events (export_format);

-- Row Level Security
ALTER TABLE qr_events ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert an event (QR generation / download)
CREATE POLICY "Allow insert qr_events" ON qr_events
  FOR INSERT
  WITH CHECK (true);

-- Anyone (anon) can read events — needed for admin panel via anon key
CREATE POLICY "Allow select qr_events" ON qr_events
  FOR SELECT
  USING (true);
