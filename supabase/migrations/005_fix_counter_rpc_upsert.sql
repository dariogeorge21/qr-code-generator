-- ============================================================
-- Migration 005: Rewrite RPC functions to use UPSERT
-- ============================================================
-- WHY: The old functions used UPDATE WHERE id = 1 which silently
-- does nothing if no row exists.  UPSERT (INSERT … ON CONFLICT)
-- is atomic and creates the row automatically if missing.
-- ============================================================

CREATE OR REPLACE FUNCTION increment_qr_generated()
RETURNS TABLE (total_generated BIGINT, total_downloaded BIGINT, updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as the function owner (bypasses caller RLS)
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

CREATE OR REPLACE FUNCTION increment_qr_downloaded()
RETURNS TABLE (total_generated BIGINT, total_downloaded BIGINT, updated_at TIMESTAMP WITH TIME ZONE)
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

-- Re-grant execute (safe to run again)
GRANT EXECUTE ON FUNCTION increment_qr_generated TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_qr_downloaded TO authenticated, anon;
