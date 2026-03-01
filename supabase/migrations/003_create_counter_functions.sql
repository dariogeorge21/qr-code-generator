-- Create stored function to increment generated counter
CREATE OR REPLACE FUNCTION increment_qr_generated()
RETURNS TABLE (total_generated BIGINT, total_downloaded BIGINT, updated_at TIMESTAMP WITH TIME ZONE) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE qr_counter
  SET total_generated = total_generated + 1, updated_at = NOW()
  WHERE id = 1
  RETURNING qr_counter.total_generated, qr_counter.total_downloaded, qr_counter.updated_at;
END;
$$;

-- Create stored function to increment downloaded counter
CREATE OR REPLACE FUNCTION increment_qr_downloaded()
RETURNS TABLE (total_generated BIGINT, total_downloaded BIGINT, updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE qr_counter
  SET total_downloaded = total_downloaded + 1, updated_at = NOW()
  WHERE id = 1
  RETURNING qr_counter.total_generated, qr_counter.total_downloaded, qr_counter.updated_at;
END;
$$;

-- Grant execute permissions for authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_qr_generated TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_qr_downloaded TO authenticated, anon;

-- Create policy to allow function execution
CREATE POLICY "Allow increment functions" ON qr_counter
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
