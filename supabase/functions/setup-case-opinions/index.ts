// Edge function para criar a tabela case_opinions via pg client
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  
  const DATABASE_URL = Deno.env.get("DATABASE_URL");
  
  if (!DATABASE_URL) {
    return new Response(JSON.stringify({ 
      error: "DATABASE_URL não configurada",
      hint: "Execute o SQL manualmente no Supabase SQL Editor"
    }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  try {
    const { Client } = await import("npm:pg@8");
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS case_opinions (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        visitor_name TEXT,
        visitor_phone TEXT,
        area TEXT NOT NULL,
        client_data JSONB DEFAULT '{}',
        conversation JSONB DEFAULT '[]',
        lawyer_analysis JSONB DEFAULT '{}',
        lawyer_name TEXT,
        lawyer_area TEXT,
        judge_opinion TEXT,
        judge_model TEXT,
        judge_area TEXT,
        judge_confidence TEXT,
        judge_references JSONB DEFAULT '[]',
        media_urls JSONB DEFAULT '[]',
        media_types JSONB DEFAULT '[]',
        status TEXT DEFAULT 'em_analise',
        priority TEXT DEFAULT 'normal',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        lawyer_analyzed_at TIMESTAMPTZ,
        judge_opinion_at TIMESTAMPTZ
      );
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_case_opinions_session ON case_opinions(session_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_case_opinions_area ON case_opinions(area);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_case_opinions_status ON case_opinions(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_case_opinions_created ON case_opinions(created_at DESC);`);
    
    await client.query(`ALTER TABLE case_opinions ENABLE ROW LEVEL SECURITY;`);
    
    try {
      await client.query(`
        CREATE POLICY "Authenticated users can manage case_opinions" ON case_opinions
          FOR ALL USING (auth.role() = 'authenticated');
      `);
    } catch { /* policy may exist */ }
    
    try {
      await client.query(`
        CREATE POLICY "Service role can manage case_opinions" ON case_opinions
          FOR ALL USING (auth.role() = 'service_role');
      `);
    } catch { /* policy may exist */ }
    
    await client.end();
    
    return new Response(JSON.stringify({ success: true, message: "Tabela case_opinions criada com sucesso!" }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
