-- Create contacts table for storing form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into contacts (for form submissions)
CREATE POLICY "Allow insert for contact form" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select their own contacts (optional - for now allow all)
CREATE POLICY "Allow select all contacts" ON contacts
  FOR SELECT
  USING (true);
