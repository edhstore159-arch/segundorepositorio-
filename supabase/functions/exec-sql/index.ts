import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DB_URL = Deno.env.get("SUPABASE_DB_URL") || "";

const DEFAULT_SQL = `
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });

  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ") || auth.slice(7) !== KEY) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  if (!DB_URL) {
    return new Response(JSON.stringify({ error: "SUPABASE_DB_URL not set" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  let sql = DEFAULT_SQL;
  try {
    const body = await req.json();
    if (body?.sql) sql = body.sql;
  } catch {}

  try {
    const { Client } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts");
    const client = new Client(DB_URL);
    await client.connect();

    const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
    const results: string[] = [];

    for (const stmt of statements) {
      try {
        await client.queryArray(stmt + ";");
        results.push(`OK: ${stmt.slice(0, 80)}...`);
      } catch (e) {
        results.push(`ERR: ${stmt.slice(0, 60)}... -> ${(e as Error).message?.slice(0, 100)}`);
      }
    }

    await client.end();
    return new Response(JSON.stringify({ ok: true, results }, null, 2), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
