-- Tabela para armazenar pareceres técnicos do juiz virtual
-- Cada caso analisado pelo advogado especializado gera um parecer do juiz

CREATE TABLE IF NOT EXISTS case_opinions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_phone TEXT,
  area TEXT NOT NULL,
  
  -- Dados do cliente coletados pelo advogado
  client_data JSONB DEFAULT '{}',
  
  -- Conversa completa (histórico WhatsApp)
  conversation JSONB DEFAULT '[]',
  
  -- Análise do advogado especializado
  lawyer_analysis JSONB DEFAULT '{}',
  lawyer_name TEXT,
  lawyer_area TEXT,
  
  -- Parecer do juiz virtual
  judge_opinion TEXT,
  judge_model TEXT,
  judge_area TEXT,
  judge_confidence TEXT,
  judge_references JSONB DEFAULT '[]',
  
  -- Documentos e mídias analisadas
  media_urls JSONB DEFAULT '[]',
  media_types JSONB DEFAULT '[]',
  
  -- Metadados
  status TEXT DEFAULT 'em_analise' CHECK (status IN ('em_analise', 'analise_advogado', 'parecer_pronto', 'revisao')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  lawyer_analyzed_at TIMESTAMPTZ,
  judge_opinion_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_case_opinions_session ON case_opinions(session_id);
CREATE INDEX IF NOT EXISTS idx_case_opinions_area ON case_opinions(area);
CREATE INDEX IF NOT EXISTS idx_case_opinions_status ON case_opinions(status);
CREATE INDEX IF NOT EXISTS idx_case_opinions_created ON case_opinions(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE case_opinions ENABLE ROW LEVEL SECURITY;

-- Policy para todos (anon + authenticated + service_role)
CREATE POLICY "Anyone can insert case_opinions" ON case_opinions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read case_opinions" ON case_opinions
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon');

CREATE POLICY "Authenticated users can update case_opinions" ON case_opinions
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role can delete case_opinions" ON case_opinions
  FOR DELETE USING (auth.role() = 'service_role');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_case_opinions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_case_opinions_updated_at_trigger
  BEFORE UPDATE ON case_opinions
  FOR EACH ROW
  EXECUTE FUNCTION update_case_opinions_updated_at();
