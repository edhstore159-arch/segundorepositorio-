const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Voce e um desenvolvedor web full-stack de elite. Crie sites profissionais de altissima qualidade usando HTML, CSS e JavaScript vanilla.

FORMATO — SEMPRE retorne JSON valido:
{
  "response": "Descricao do que foi criado",
  "files": [
    { "path": "index.html", "content": "<!DOCTYPE html>..." },
    { "path": "styles.css", "content": "..." },
    { "path": "script.js", "content": "..." }
  ]
}

═══ DESIGN OBRIGATORIO ═══
- Hero section com gradiente, 100vh, titulo grande (3-5rem), botao CTA
- Grid layouts com CSS Grid
- Secoes alternadas com fundos claros/escuros
- Espacamento generoso (padding 4-8rem)
- Container max-width 1200px centralizado

═══ TIPOGRAFIA ═══
- Google Fonts via link: Inter para corpo, Poppins para titulos
- Titulos grandes, bold, letter-spacing negativo
- Text-gradient para titulos principais

═══ CORES E VISUAL ═══
- Paleta de 5-7 cores com variaveis CSS
- Gradientes sofisticados
- Glassmorphism: backdrop-filter: blur(16px)
- Sombras suaves: box-shadow com 3+ valores
- Cores vivas para botoes CTA

═══ ANIMACOES ═══
- Transicoes 0.3s ease em TUDO
- Botoes com scale(1.05) no hover + sombra crescente
- Cards que sobem 8-12px no hover
- Navbar muda de transparente para solida no scroll
- Scroll reveal: fade-in + translateY(30px)
- Contador animado para numeros
- Carousel de depoimentos

═══ COMPONENTES ═══
- Navbar sticky: logo, links, CTA
- Hero: titulo + subtitulo + CTA + imagem
- Features/servicos em grid com icones SVG
- Secao Sobre imagem-texto
- Depoimentos carousel
- Footer completo

═══ CONTEUDO REAL ═══
- NUNCA use Lorem ipsum
- Telefones: (XX) XXXXX-XXXX
- Imagens: picsum.photos
- Icones: SVG inline Lucide Icons

═══ RESPONSIVIDADE ═══
- Mobile-first: 640px, 768px, 1024px, 1280px
- Hamburger menu mobile
- Botoes minimo 44px altura

═══ JAVASCRIPT ═══
- Smooth scroll
- Navbar sticky
- Scroll reveal com IntersectionObserver
- Contador animado
- Hamburger menu
- Form validation

═══ REGRAS ═══
- index.html, styles.css, script.js separados
- Nunca use <iframe>
- Minimo 200 linhas CSS, 3 secoes HTML`;

function parseAiResponse(raw: string): { response: string; files: Record<string, string> } | null {
  const text = (raw || "").trim();
  if (!text) return null;

  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*"files"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      if (parsed.files && typeof parsed.files === "object") {
        const files: Record<string, string> = {};
        if (Array.isArray(parsed.files)) {
          for (const f of parsed.files) {
            if (f.path && f.content) files[f.path] = f.content;
          }
        } else {
          for (const [path, content] of Object.entries(parsed.files)) {
            if (typeof content === "string") files[path] = content;
          }
        }
        return { response: parsed.response || "Codigo gerado.", files };
      }
    } catch (e) {
      console.error("[site-builder] JSON parse error:", e);
    }
  }

  const htmlMatch = text.match(/<!DOCTYPE[\s\S]*/i);
  if (htmlMatch) {
    return { response: "Codigo gerado.", files: { "index.html": htmlMatch[0].trim() } };
  }

  return null;
}

async function callOpenRouter(messages: Array<{ role: string; content: string }>, key: string): Promise<string | null> {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer": "https://deusfiel.onrender.com",
      "X-Title": "DeusFiel Site Builder",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      temperature: 0.7,
      max_tokens: 10000,
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    console.error("[site-builder] OpenRouter error:", resp.status, err.slice(0, 200));
    return null;
  }
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function callEmergent(messages: Array<{ role: string; content: string }>, key: string): Promise<string | null> {
  const resp = await fetch("https://integrations.emergentagent.com/llm/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 10000,
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    console.error("[site-builder] Emergent error:", resp.status, err.slice(0, 200));
    return null;
  }
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const userMessage: string = String(body.message ?? "").trim();
    const history: Array<{ role: string; content: string }> = Array.isArray(body.history) ? body.history : [];
    const projectFiles: Record<string, string> = body.project_files || {};

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: "message vazio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";
    const EMERGENT_KEY = Deno.env.get("EMERGENT_API_KEY") || "";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content: Object.keys(projectFiles).length > 0
          ? `Arquivos atuais:\n${Object.entries(projectFiles).map(([p, c]) => `--- ${p} ---\n${c}`).join("\n\n")}\n\n---\n\n${userMessage}`
          : userMessage,
      },
    ];

    let raw = "";
    let provider = "";

    // Tenta OpenRouter primeiro
    if (OPENROUTER_KEY) {
      console.log("[site-builder] Tentando OpenRouter...");
      raw = (await callOpenRouter(messages, OPENROUTER_KEY)) || "";
      if (raw) provider = "openrouter";
    }

    // Fallback: Emergent
    if (!raw && EMERGENT_KEY) {
      console.log("[site-builder] Tentando Emergent...");
      raw = (await callEmergent(messages, EMERGENT_KEY)) || "";
      if (raw) provider = "emergent";
    }

    if (!raw) {
      return new Response(
        JSON.stringify({ error: "Nenhum provider de IA disponivel" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = parseAiResponse(raw);

    if (!result || Object.keys(result.files).length === 0) {
      console.error("[site-builder] Parse falhou. Raw length:", raw.length);
      return new Response(
        JSON.stringify({ error: "Nao foi possivel parsear resposta da IA", files: {}, debug: raw.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("[site-builder] OK via", provider, "! Files:", Object.keys(result.files).join(", "));
    return new Response(
      JSON.stringify({ response: result.response, files: result.files, provider }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[site-builder] fatal:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
