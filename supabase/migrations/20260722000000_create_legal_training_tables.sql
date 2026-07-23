-- Tabela de casos reais de jurisprudência brasileira para treinamento
CREATE TABLE IF NOT EXISTS legal_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area TEXT NOT NULL CHECK (area IN ('penal','civel','trabalhista','familia','previdenciario','tributario','administrativo','constitucional','consumidor','ambiental')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facil','medio','dificil')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  parties TEXT,
  question TEXT,
  key_issues JSONB DEFAULT '[]',
  applicable_laws JSONB DEFAULT '[]',
  hints JSONB DEFAULT '[]',
  real_reference TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_cases_area ON legal_cases(area);
CREATE INDEX IF NOT EXISTS idx_legal_cases_difficulty ON legal_cases(difficulty);
CREATE INDEX IF NOT EXISTS idx_legal_cases_area_diff ON legal_cases(area, difficulty);

-- Tabela de sessões de treinamento (persistência no banco)
CREATE TABLE IF NOT EXISTS training_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID,
  mode TEXT NOT NULL CHECK (mode IN ('lawyer','judge')),
  area TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  legal_case_id UUID REFERENCES legal_cases(id),
  case_data JSONB NOT NULL,
  messages JSONB DEFAULT '[]',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  evaluation JSONB,
  corrected_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user ON training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_mode ON training_sessions(mode);
CREATE INDEX IF NOT EXISTS idx_training_sessions_area ON training_sessions(area);
CREATE INDEX IF NOT EXISTS idx_training_sessions_created ON training_sessions(created_at DESC);

-- RLS
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read legal_cases" ON legal_cases
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage legal_cases" ON legal_cases
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can insert training_sessions" ON training_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read training_sessions" ON training_sessions
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon');

CREATE POLICY "Authenticated users can update training_sessions" ON training_sessions
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role can delete training_sessions" ON training_sessions
  FOR DELETE USING (auth.role() = 'service_role');
