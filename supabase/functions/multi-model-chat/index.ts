// Multi-model chat via Emergent API (streaming).
// Suporta ChatGPT, Gemini e Claude via Emergent. Ollama é chamado direto pelo cliente.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMERGENT_BASE = "https://integrations.emergentagent.com/llm/chat/completions";

// Maps frontend model IDs to Emergent candidate model names (tries each in order)
const MODEL_CANDIDATES: Record<string, string[]> = {
  "openai/gpt-5.5": ["openai/gpt-5.5", "gpt-5.5", "gpt-4o-mini"],
  "openai/gpt-5-mini": ["openai/gpt-5-mini", "gpt-5-mini", "gpt-4o-mini"],
  "google/gemini-2.5-pro": ["google/gemini-2.5-pro", "gemini-2.5-pro", "gpt-4o-mini"],
  "google/gemini-2.5-flash": ["google/gemini-2.5-flash", "gemini-2.5-flash", "gpt-4o-mini"],
  "anthropic/claude-sonnet-4-20250514": [
    "anthropic/claude-sonnet-4-20250514",
    "claude-sonnet-4-20250514",
    "claude-sonnet-4-5",
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5",
    "gpt-4o-mini",
  ],
};

const FALLBACK_CANDIDATES = ["gpt-4o-mini"];

async function tryEmergent(key: string, model: string, payload: any): Promise<Response> {
  return fetch(EMERGENT_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ ...payload, model }),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages, model, system } = await req.json();
    if (!Array.isArray(messages) || !messages.length) {
      return new Response(JSON.stringify({ error: "messages obrigatório" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emergentKey = Deno.env.get("EMERGENT_API_KEY") || Deno.env.get("EMERGENT_LLM_KEY") || "";
    if (!emergentKey) {
      return new Response(JSON.stringify({ error: "Chave EMERGENT_API_KEY ausente nas secrets." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const candidates = MODEL_CANDIDATES[model] || [...(model ? [model] : []), ...FALLBACK_CANDIDATES];

    const payload = {
      stream: true,
      messages: [
        ...(system ? [{ role: "system", content: String(system) }] : []),
        ...messages.map((m: any) => ({ role: m.role, content: String(m.content ?? "") })),
      ],
    };

    let lastError = "";
    let lastStatus = 0;

    for (const candidate of candidates) {
      const upstream = await tryEmergent(emergentKey, candidate, payload);

      if (!upstream.ok || !upstream.body) {
        const text = await upstream.text().catch(() => "");
        lastStatus = upstream.status;
        lastError = text || `HTTP ${upstream.status}`;
        // If 400/404 (model not found), try next candidate
        if (upstream.status === 400 || upstream.status === 404) {
          console.warn(`Emergent rejeitou modelo ${candidate}, tentando próximo...`);
          continue;
        }
        // Other errors (429, 401, 500) — return immediately
        let msg = lastError;
        if (upstream.status === 429) msg = "Limite de requisições excedido. Tente em instantes.";
        if (upstream.status === 401) msg = "Chave de API inválida. Verifique EMERGENT_API_KEY.";
        return new Response(JSON.stringify({ error: msg }), {
          status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Success — stream the response
      return new Response(upstream.body, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // All candidates exhausted
    return new Response(JSON.stringify({ error: `Nenhum modelo aceito pela Emergent. Último erro: ${lastError.slice(0, 200)}` }), {
      status: lastStatus || 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
