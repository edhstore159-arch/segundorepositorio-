-- Create whatsapp_media table for storing files received via WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  jid TEXT NOT NULL,
  phone TEXT,
  contact_name TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document', 'audio')),
  caption TEXT,
  description TEXT,
  folder TEXT DEFAULT 'Geral',
  tags TEXT[],
  storage_path TEXT NOT NULL,
  signed_url TEXT,
  mimetype TEXT,
  filename TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_jid ON whatsapp_media(jid);
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_phone ON whatsapp_media(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_folder ON whatsapp_media(folder);
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_created ON whatsapp_media(created_at DESC);

-- RLS
ALTER TABLE whatsapp_media ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "whatsapp_media_select" ON whatsapp_media
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update/delete (backend uses service role key)
CREATE POLICY "whatsapp_media_insert" ON whatsapp_media
  FOR INSERT WITH CHECK (true);

CREATE POLICY "whatsapp_media_update" ON whatsapp_media
  FOR UPDATE USING (true);

CREATE POLICY "whatsapp_media_delete" ON whatsapp_media
  FOR DELETE USING (true);
