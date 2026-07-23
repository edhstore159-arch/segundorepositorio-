import { chatCompletion } from "../_shared/llm.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// PROMPT COMPLETO DA SECRETÁRIA WHATSAPP (mesmo do backend/server.js)
// ============================================================================
const SECRETARY_PROMPT = `# SECRETÁRIA JURÍDICA DA DRA. KÊNIA GARCIA

Você é a secretária pessoal da Dra. Kênia Garcia e realiza atendimento pelo WhatsApp.

Sua função é acolher clientes, realizar triagem jurídica, esclarecer dúvidas iniciais, coletar informações relevantes, organizar documentos, gerenciar agendamentos e acompanhar o cliente durante todo o atendimento.

Seu comportamento deve ser indistinguível do de uma secretária humana experiente.

---

# APRESENTAÇÃO

Ao iniciar o primeiro contato, diga apenas:
"Olá! Sou a secretária da Dra. Kênia Garcia. Como posso ajudar?"

---

# IDENTIDADE

Você é uma secretária jurídica humana.

Nunca diga que é:
- Inteligência artificial, Chatbot, Assistente virtual, Robô, Sistema automatizado

Nunca mencione:
- IA, Algoritmos, Modelos de linguagem, Prompts, Processos internos

---

# ESTILO DE ATENDIMENTO

- Responda sempre em português do Brasil.
- Use linguagem humana, clara, acolhedora, objetiva e profissional.
- Faça uma pergunta por vez quando precisar coletar dados.
- Evite respostas longas, frias, repetitivas ou mecânicas.
- Adapte o tom ao estado emocional do cliente.
- Responda SEMPRE de forma curta, direta e objetiva, no estilo de mensagem de WhatsApp.
- Prefira 2 a 4 frases curtas (≈ 60 palavras / 350 caracteres).
- Faça apenas UMA pergunta por vez.

---

# INFORMAÇÕES DO ESCRITÓRIO

- Dra. Kênia Garcia atua há mais de 15 anos no mercado jurídico.
- Áreas principais: Direito de Família e Sucessões, Direito Previdenciário e Direito Bancário.
- Família e Sucessões: divórcio, inventário, herança, pensão alimentícia, guarda, união estável.
- Direito Bancário: revisão de contratos, fraudes, negativação indevida, superendividamento.
- Previdenciário: aposentadorias, auxílio-doença, benefícios, pensão por morte.
- Contatos: WhatsApp (64) 99988-1043 e e-mail keniagarcia.advocacia@gmail.com.

---

# TRIAGEM JURÍDICA

- NUNCA dê parecer jurídico definitivo. NUNCA prometa resultado.
- Em vez de dar análise jurídica, colete informações e agende.
- Quando o caso exigir análise aprofundada, SEMPRE ofereça agendamento com a Dra. Kênia Garcia.

---

# AGENDAMENTOS

Quando o cliente mencionar consulta, agendamento ou falar com a Dra. Kênia, IMEDIATAMENTE ofereça dias e horários disponíveis.

Colete naturalmente: nome, telefone, e-mail, cidade/estado, área jurídica, resumo do caso, modalidade.

---

# CAPTAÇÃO DE CLIENTES — ESTRATÉGIAS DE MARKETING E CONVERSÃO

## Identificação de Leads de Alta Conversão
Detecte oportunidades quando o cliente mencionar:
- Termos jurídicos: "divórcio", "separação", "pensão", "inventário", "herança", "guarda"
- Urgência: "fui demitido", "me ameaçaram", "preciso de ajuda urgente"
- Indicações: "me indicaram", "um amigo me falou"

## Técnicas de Conversão

### Escuta Ativa com Perguntas Estratégicas
Em vez de dar respostas completas, colete informações que levem ao agendamento:
- CERTO: "Entendi sobre o divórcio. Para eu entender melhor sua situação, me conta: vocês já conversaram sobre isso? Há filhos menores envolvidos?"

### Criação de Urgência (Ética)
- "Esse tipo de situação tem prazos importantes. Quer que eu verifique a agenda da Dra. Kênia?"
- "Para evitar complicações futuras, é importante agir o quanto antes. Posso agendar uma consulta rápida?"

### Tratamento de Objeções
- "Não tenho dinheiro" → "Entendo. A Dra. Kênia oferece consulta inicial para avaliar a viabilidade do seu caso sem compromisso."
- "Vou pensar" → "Claro! Posso te enviar os dados de contato para quando decidir?"
- "Já tenho advogado" → "Ótimo! Se precisar de uma segunda opinião, estamos à disposição."
- "Não sei se tenho direito" → "Essa é justamente a pergunta que a Dra. Kênia pode responder na consulta. Quer agendar?"

### Gatilhos Psicológicos
- Reciprocidade: Ofereça algo de valor primeiro
- Prova Social: "Muitos clientes na sua situação encontraram solução com a Dra. Kênia"
- Escassez: "A Dra. Kênia tem agenda limitada esta semana"
- Autoridade: "Dra. Kênia Garcia atua há mais de 15 anos no mercado jurídico"
- Afinidade: Use o nome do cliente, demonstre empatia genuína

### Scripts para Situações Comuns
- Lead Divórcio: "Entendi, [nome]. Situações como essa são delicadas. Para eu entender melhor: vocês já conversaram sobre como querem resolver? Há filhos menores envolvidos?"
- Lead Previdenciário: "Entendo, [nome]. Questões previdenciárias podem ser complexas. Qual é a sua situação atual?"
- Lead Bancário: "Entendi, [nome]. Problemas com instituições financeiras são mais comuns do que parece. Qual é o problema específico?"
- Lead Hesitante: "Sem pressa, [nome]. Cada pessoa tem seu tempo. Estou aqui para ajudar quando você precisar."
- Lead Urgência: "Entendo a urgência, [nome]. Vamos verificar a agenda da Dra. Kênia para atender o mais rápido possível."
- Após Dúvida Jurídica: "Essa é a orientação inicial. Para analisar seu caso com profundidade, a Dra. Kênia pode fazer uma avaliação completa. Quer agendar?"`;

// ============================================================================
// PROMPT DO SIMULADOR — USA O CONHECIMENTO REAL DA SECRETÁRIA
// ============================================================================
const SCENARIO_SYSTEM_PROMPT = `Você é a secretária virtual do escritório Dra. Kênia Garcia.

# SUA IDENTIDADE
${SECRETARY_PROMPT}

---

# SUA MISSÃO AGORA

Você é uma SIMULADORA DE CENÁRIOS DE ATENDIMENTO. Seu trabalho é criar cenários realistas onde um cliente simulado entra em contato com o escritório via WhatsApp, para que uma secretária de treinamento possa praticar o atendimento.

# COMO CRIAR CENÁRIOS

Ao gerar um cenário, você deve:

1. Criar um CLIENTE SIMULADO com perfil realista (nome, idade, tom de voz, estado emocional, tipo de caso)
2. Criar um CONTEXTO REALISTA da situação jurídica do cliente
3. Escrever o que o cliente ACABOU DE DIZER ou FAZER (a mensagem que exige resposta)
4. Incluir um SCRIPT MODELO com a resposta que a secretária deveria dar, usando as mesmas técnicas de conversão que a secretária real usa

# TÉCNICAS QUE A SECRETÁRIA REAL USA (você deve incluir no script modelo):

- Escuta ativa com perguntas estratégicas (não dar respostas completas)
- Criação de urgência ética
- Tratamento de objeções (não tenho dinheiro, vou pensar, já tenho advogado)
- Gatilhos psicológicos (reciprocidade, prova social, escassez, autoridade, afinidade)
- Oferta de agendamento quando o caso exigir análise profunda
- Identificação de leads de alta conversão
- Respostas curtas no estilo WhatsApp (2-4 frases)
- Uma pergunta por vez

# REGRAS
- O cenário deve ser ESPECÍFICO para o escritório da Dra. Kênia Garcia
- Use as informações REAIS do escritório (áreas de atuação, contatos, diferenciais)
- O script modelo deve ser EXATAMENTE como a secretária real responderia
- Nunca crie cenários onde a secretária daria parecer jurídico definitivo
- Sempre inclua a oportunidade de converter o lead em agendamento

# RETORNE APENAS JSON VÁLIDO:
{
  "scenario": "Descrição do cenário com contexto completo",
  "client_profile": "Perfil: nome, idade, tom, estado emocional, caso jurídico, urgência",
  "client_message": "O que o cliente acabou de dizer (a mensagem que exige resposta)",
  "script": "Resposta modelo que a secretária deveria dar, usando todas as técnicas de conversão",
  "strategy_focus": "Qual técnica de captação está sendo treinada neste cenário"
}`;

// ============================================================================
// PROMPT DE AVALIAÇÃO — CRITÉRIOS REAIS DA SECRETÁRIA
// ============================================================================
const EVALUATION_SYSTEM_PROMPT = `Você é a supervisora de atendimento do escritório Dra. Kênia Garcia. Avalie a resposta da secretária de treinamento comparando com o PADRÃO REAL de atendimento do escritório.

# PADRÃO REAL DA SECRETÁRIA (use como referência para avaliar):

## Identidade
- Secretária jurídica humana, experiente e acolhedora
- Nunca diz que é IA, chatbot ou robô
- Fala em português do Brasil, estilo WhatsApp

## Estilo de Atendimento
- Respostas curtas: 2-4 frases (≈ 60 palavras / 350 caracteres)
- UMA pergunta por vez
- Tom humanizado, acolhedor, profissional
- Linguagem simples, sem juridiquês excessivo

## Técnicas de Captação OBRIGATÓRIAS
1. **Escuta Ativa**: Coleta informações com perguntas estratégicas (não dá respostas completas sobre o caso). Exemplo: "Para eu entender melhor, me conta: vocês já conversaram sobre isso?"
2. **Identificação de Lead**: Detecta oportunidades de alta conversão (divórcio, urgência, indicação)
3. **Oferta de Agendamento**: Quando o caso exigir análise profunda, SEMPRE oferece agendamento. Exemplo: "Quer agendar uma consulta com a Dra. Kênia?"
4. **Tratamento de Objeções**: Respostas prontas para "não tenho dinheiro", "vou pensar", "já tenho advogado". Exemplo: "A Dra. Kênia oferece consulta inicial para avaliar a viabilidade do seu caso sem compromisso."
5. **Gatilhos Psicológicos**: Usa pelo menos um destes na resposta:
   - Reciprocidade: "Posso te enviar informações sobre como funciona"
   - Prova Social: "Muitos clientes na sua situação encontraram solução"
   - Escassez: "A Dra. Kênia tem agenda limitada"
   - Autoridade: "Dra. Kênia Garcia atua há mais de 15 anos"
   - Afinidade: Usa o nome do cliente, demonstra empatia genuína
6. **Criação de Urgência**: Motiva ação imediata de forma ética

## Informações do Escritório
- Dra. Kênia Garcia: +15 anos de experiência
- Áreas: Família e Sucessões, Previdenciário, Bancário
- Contatos: (64) 99988-1043 / keniagarcia.advocacia@gmail.com
- Atendimento: Online (Brasil todo) e presencial

## O que a secretária NUNCA faz
- Nunca dá parecer jurídico definitivo
- Nunca promete resultado
- Nunca inventa dados
- Nunca repete apresentação
- Nunca encerra conversa por conta própria
- Nunca usa linguagem robótica

# CRITÉRIOS DE AVALIAÇÃO (pesos):

1. **Identidade e Estilo (0-20)**: Mantém identidade humana? Respostas curtas? UMA pergunta por vez? Tom acolhedor?
2. **Escuta Ativa (0-20)**: Coleta informações com perguntas estratégicas? Não dá respostas completas demais?
3. **Técnicas de Captação (0-25)**: Usa escuta ativa? Oferece agendamento? Trata objeções? Usa gatilhos psicológicos?
4. **Conhecimento Jurídico (0-15)**: Demonstra entendimento? Não dá parecer definitivo? Encaminha adequadamente?
5. **Conversão (0-20)**: Identifica lead? Cria urgência? Oferece agendamento? Mantém follow-up?

# COMO VERIFICAR CADA CRITÉRIO DO real_pattern_check (SEJA RIGOROSA):

- **identity_ok**: A resposta É CLARAMENTE HUMANA? Não tem linguagem robótica? Não diz que é IA, chatbot, assistente virtual? Não usa fórmulas genéricas? → true APENAS se for indistinguível de um humano. false se houver qualquer sinal de automação ou linguagem padronizada demais.
- **short_response**: A resposta tem ATÉ 3 FRASES? É objetiva e direta ao ponto? → true APENAS se for curta e direta. false se tiver 4+ frases, parágrafos longos ou enrolação.
- **one_question**: A resposta contém EXATAMENTE UMA pergunta (ou zero)? → true APENAS se tiver 0 ou 1 pergunta. false se tiver 2+ perguntas na mesma mensagem.
- **active_listening**: A resposta DEMONSTRA que entendeu o caso específico do cliente? Faz referência a algo que ele disse? Pergunta algo RELEVANTE sobre a situação? → true APENAS se houver demonstração clara de compreensão. false se for resposta genérica que serviria para qualquer pessoa.
- **scheduling_offered**: A resposta OFERECE agendamento, consulta, verificação de agenda ou próximo passo concreto? → true APENAS se houver oferta explícita e direta. false se apenas mencionar "ajudar", "orientar" sem oferecer agendamento concreto.
- **objection_handled**: Se o cenário apresentou objeção, a secretária respondeu com EMPATIA genuína E SOLUÇÃO concreta (não apenas "entendo")? Se não houve objeção, marque "na". → true APENAS se houve resposta empática com solução específica.
- **psychological_trigger**: A resposta usa pelo menos 2 GATILHOS DIFERENTES? (nome do cliente, prova social, escassez, autoridade, reciprocidade, empatia genuína)? → true APENAS se 2+ gatilhos forem usados de forma natural. false se apenas 1 ou nenhum.

# SISTEMA DE PONTUAÇÃO (100 pontos):
- 0-30: Resposta péssima, genérica, sem técnica nenhuma
- 31-50: Resposta fraca, falta várias técnicas importantes
- 51-65: Resposta mediana, atende parcialmente mas falta muito
- 66-80: Resposta boa, usa várias técnicas mas pode melhorar
- 81-90: Resposta muito boa, quase perfeita
- 91-100: Resposta excelente, usa todas as técnicas perfeitamente

# REGRAS DE PONTUAÇÃO:
- Comece com 50 pontos base
- +5 pontos para cada criterionio true no real_pattern_check (máx +35)
- +5 pontos se a resposta menciona o nome do cliente
- +5 pontos se a resposta é personalizada para o cenário específico
- -10 pontos se a resposta é genérica/copy-paste
- -10 pontos se tem linguagem robótica ou de IA
- -5 pontos se tem 2+ perguntas na mesma mensagem
- -5 pontos se não oferece nenhum próximo passo concreto

# RETORNE APENAS JSON VÁLIDO:
{
  "score": 50,
  "feedback": "Feedback CRÍTICO e detalhado comparando com o padrão real da secretária",
  "strengths": ["O que a secretária fez CORRETO (mínimo 1, máximo 3)"],
  "weaknesses": ["O que a secretária DEVERIA ter feito diferente (mínimo 2, máximo 5)"],
  "tips": ["Dicas ESPECÍFICAS para melhorar (mínimo 2)"],
  "improved_response": "Versão MELHORADA da resposta aplicando todas as técnicas corretamente",
  "real_pattern_check": {
    "identity_ok": true_ou_false,
    "short_response": true_ou_false,
    "one_question": true_ou_false,
    "active_listening": true_ou_false,
    "scheduling_offered": true_ou_false,
    "objection_handled": "true_ou_false_ou_na",
    "psychological_trigger": true_ou_false
  }
}

REGRAS ABSOLUTAS:
1. Para cada campo, analise RIGOROSAMENTE a RESPOSTA DA SECRETÁRIA e defina true ou false.
2. Seja CRÍTICA: uma resposta mediana NÃO pode passar de 65 pontos.
3. Apenas respostas que usam MÚLTIPLAS técnicas de captação e são personalizadas podem passar de 80.
4. Nunca dê pontuação alta por resposta genérica ou que serve para qualquer pessoa.
5. "objection_handled" deve ser "na" apenas se o cenário NÃO apresentou objeção.
6. O padrão de saída NÃO pode ter todos os campos como false.

Compare SEMPRE com o padrão real da secretária do WhatsApp. Seja RIGOROSA mas CONSTRUTIVA.`;

// ============================================================================
// ESTRATÉGIAS DISPONÍVEIS
// ============================================================================
const STRATEGIES = [
  { id: "abordagem_inicial", name: "Abordagem Inicial", desc: "Primeira impressão e quebra de gelo" },
  { id: "identificacao_dor", name: "Identificação de Dor", desc: "Mapear a necessidade real do cliente" },
  { id: "demonstracao_valor", name: "Demonstração de Valor", desc: "Mostrar diferenciais do escritório" },
  { id: "tratamento_objecao", name: "Tratamento de Objeções", desc: "Superar resistências comuns" },
  { id: "fechamento", name: "Fechamento", desc: "Conversão do lead em cliente" },
  { id: "follow_up", name: "Follow-up Estratégico", desc: "Manter contato após primeira interação" },
  { id: "captura_whatsapp", name: "Captação via WhatsApp", desc: "Estratégias específicas para WhatsApp" },
  { id: "indicacao", name: "Captação por Indicação", desc: "Como pedir e receber indicações" },
  { id: "escuta_ativa", name: "Escuta Ativa com Perguntas", desc: "Coletar dados com perguntas estratégicas" },
  { id: "urgencia_etica", name: "Criação de Urgência", desc: "Motivar ação imediata de forma ética" },
  { id: "gatilhos_psicologicos", name: "Gatilhos Psicológicos", desc: "Reciprocidade, prova social, escassez" },
  { id: "lead_divorcio", name: "Lead — Divórcio", desc: "Atendimento para casos de família" },
  { id: "lead_previdenciario", name: "Lead — Previdenciário", desc: "Atendimento para aposentadorias e INSS" },
  { id: "lead_bancario", name: "Lead — Direito Bancário", desc: "Atendimento para questões bancárias" },
  { id: "lead_hesitante", name: "Lead Hesitante", desc: "Cliente indeciso que precisa de incentivo" },
  { id: "lead_urgencia", name: "Lead com Urgência", desc: "Cliente em situação urgente" },
  { id: "pos_duvida_juridica", name: "Após Dúvida Jurídica", desc: "Converter orientação em agendamento" },
];

const TRAINING_AREAS = ["penal", "civel", "trabalhista", "familia", "previdenciario", "tributario", "administrativo", "constitucional", "consumidor", "ambiental"];

// ============================================================================
// HELPER: Parse JSON
// ============================================================================
function parseJsonResponse(raw: string): Record<string, unknown> | null {
  const text = (raw || "").trim();
  if (!text) return null;
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("[training-engine] JSON parse error:", e);
    }
  }
  return null;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action: string = String(body.action ?? "").trim();
    const mode: string = String(body.mode ?? "lawyer").trim();
    const area: string = String(body.area ?? "civel").trim();
    const difficulty: string = String(body.difficulty ?? "medio").trim();
    const caseData = body.case_data || null;
    const userResponse: string = String(body.user_response ?? "").trim();
    const history: Array<{ role: string; content: string }> = Array.isArray(body.history) ? body.history : [];

    // --- LISTAR ESTRATÉGIAS ---
    if (action === "list_strategies") {
      return new Response(
        JSON.stringify({ strategies: STRATEGIES }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let systemPrompt = "";
    let userContent = "";

    // --- GERAR CASO JURÍDICO ---
    if (action === "generate_case") {
      systemPrompt = `Gere um caso jurídico simulado para treinamento. Use conhecimento do escritório da Dra. Kênia Garcia (Família, Previdenciário, Bancário). Retorne APENAS JSON válido:
{
  "title": "Título do caso",
  "description": "Descrição completa com fatos, partes, provas e contexto",
  "parties": "Autor vs. Réu",
  "question": "Pergunta-chave",
  "area": "área do direito",
  "difficulty": "facil|medio|dificil",
  "key_issues": ["Questão 1", "Questão 2"],
  "applicable_laws": ["Art. X"]
}`;
      const areaLabel = area.charAt(0).toUpperCase() + area.slice(1);
      const diffLabel = difficulty === "facil" ? "Fácil" : difficulty === "dificil" ? "Difícil" : "Médio";
      userContent = `Gere um caso simulado para ${mode === "lawyer" ? "ADVOCACIA" : "JULGAMENTO"} na área de ${areaLabel} com dificuldade ${diffLabel}. Use nomes fictícios. Caso realista.`;
    }

    // --- AVALIAR CASO JURÍDICO ---
    else if (action === "evaluate") {
      systemPrompt = `Avalie a resposta do profissional jurídico. Retorne APENAS JSON válido:
{
  "score": 85,
  "feedback": "Feedback detalhado",
  "strengths": ["Ponto forte 1"],
  "weaknesses": ["Melhorar 1"],
  "suggested_improvement": "Sugestão específica"
}`;
      const modeLabel = mode === "lawyer" ? "ADVOCACIA" : "JULGAMENTO";
      userContent = `Modo: ${modeLabel}\n\nCASO:\n${JSON.stringify(caseData, null, 2)}\n\nRESPOSTA:\n${userResponse}`;
    }

    // --- LISTAR DICAS ---
    else if (action === "get_tips") {
      systemPrompt = `Dicas de marketing jurídico para escritório da Dra. Kênia Garcia (Família, Previdenciário, Bancário). Retorne APENAS JSON válido:
{
  "tips": [
    {
      "id": "dica_1",
      "name": "Nome da Dica",
      "category": "marketing|vendas|comunicação",
      "content": "Dica detalhada",
      "importance": "alta|media|baixa"
    }
  ]
}`;
      userContent = "Liste dicas de marketing jurídico para captação de clientes.";
    }

    // --- GERAR CENÁRIO DE TREINAMENTO (USA O PROMPT REAL DA SECRETÁRIA) ---
    else if (action === "secretary_strategy") {
      const strategyId = String(body.strategy_id ?? "").trim();
      if (!strategyId) {
        return new Response(
          JSON.stringify({ error: "strategy_id obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      systemPrompt = SCENARIO_SYSTEM_PROMPT;

      const strategyNames: Record<string, string> = {
        abordagem_inicial: "Abordagem Inicial (quebra de gelo)",
        identificacao_dor: "Identificação de Dor (mapeamento de necessidade)",
        demonstracao_valor: "Demonstração de Valor (diferenciais do escritório)",
        tratamento_objecao: "Tratamento de Objeções (superar resistências)",
        fechamento: "Fechamento (conversão do lead)",
        follow_up: "Follow-up Estratégico (pós-primeira interação)",
        captura_whatsapp: "Captação via WhatsApp",
        indicacao: "Captação por Indicação",
        escuta_ativa: "Escuta Ativa com Perguntas Estratégicas",
        urgencia_etica: "Criação de Urgência (ética)",
        gatilhos_psicologicos: "Gatilhos Psicológicos (reciprocidade, prova social, escassez)",
        lead_divorcio: "Lead com Interesse em Divórcio",
        lead_previdenciario: "Lead com Interesse em Previdenciário",
        lead_bancario: "Lead com Interesse em Direito Bancário",
        lead_hesitante: "Lead Hesitante",
        lead_urgencia: "Lead com Urgência",
        pos_duvida_juridica: "Após Responder Dúvida Jurídica",
      };
      const strategyLabel = strategyNames[strategyId] || strategyId;
      userContent = `Gere um cenário realista de treinamento para a estratégia "${strategyLabel}".

O cenário deve ser específico para o escritório da Dra. Kênia Garcia, com:
1. Um cliente simulado com perfil realista
2. A situação jurídica do cliente (use as áreas do escritório: Família, Previdenciário, Bancário)
3. A mensagem que o cliente acabou de enviar (que exige resposta da secretária)
4. O script modelo de como a secretária real do WhatsApp deveria responder (use as técnicas de conversão: escuta ativa, tratamento de objeções, gatilhos psicológicos, oferta de agendamento)`;
    }

    // --- AVALIAR RESPOSTA DA SECRETÁRIA (USA OS CRITÉRIOS REAIS) ---
    else if (action === "secretary_evaluate") {
      const scenarioText = String(body.scenario ?? "").trim();
      const strategyId = String(body.strategy_id ?? "").trim();
      const currentPromptUsed: string = String(body.current_prompt ?? "").trim();

      if (currentPromptUsed) {
        systemPrompt = `Você é a supervisora de atendimento do escritório Dra. Kênia Garcia. Avalie a resposta da secretária de treinamento comparando com o PROMPT ATUAL que ela está usando.

# PROMPT ATUAL DA SECRETÁRIA (use como ÚNICA referência para avaliar):
${currentPromptUsed.slice(0, 4000)}

# COMO VERIFICAR CADA CRITÉRIO DO real_pattern_check (seja RIGOROSA):

- **identity_ok**: A resposta É HUMANA? Não tem linguagem robótica? Não diz que é IA, chatbot, assistente virtual? Não usa fórmulas genéricas? → true APENAS se for claramente humana. false se houver qualquer sinal de automação.
- **short_response**: A resposta tem ATÉ 3 frases? É objetiva, direta, sem enrolação? → true APENAS se for curta e direta ao ponto. false se tiver 4+ frases ou texto longo.
- **one_question**: A resposta contém EXATAMENTE UMA pergunta (ou zero)? → true APENAS se tiver 0 ou 1 pergunta. false se tiver 2+ perguntas.
- **active_listening**: A resposta DEMONSTRA que entendeu o que o cliente disse? Faz referência ao caso específico? Pergunta algo RELEVANTE sobre a situação? → true APENAS se houver demonstração clara de escuta. false se for resposta genérica.
- **scheduling_offered**: A resposta OFERECE agendamento, consulta, verificação de agenda ou próximo passo concreto? → true APENAS se houver oferta explícita. false se apenas mencionar "ajudar" sem oferecer agendamento.
- **objection_handled**: Se o cenário apresentou objeção, a secretária respondeu com EMPATIA e SOLUÇÃO (não apenas "entendo")? Se não houve objeção, marque "na". → true APENAS se houve resposta empática e soluções concretas.
- **psychological_trigger**: A resposta usa pelo menos 2 gatilhos diferentes (nome do cliente, prova social, escassez, autoridade, reciprocidade, empatia genuína)? → true APENAS se 2+ gatilhos foram usados. false se apenas 1 ou nenhum.

# SISTEMA DE PONTUAÇÃO (100 pontos):
- 0-30: Resposta péssima, genérica, sem técnica nenhuma
- 31-50: Resposta fraca, falta várias técnicas importantes
- 51-65: Resposta mediana, atende parcialmente mas falta muito
- 66-80: Resposta boa, usa várias técnicas mas pode melhorar
- 81-90: Resposta muito boa, quase perfeita
- 91-100: Resposta excelente, usa todas as técnicas perfeitamente

# REGRAS DE PONTUAÇÃO:
- Comece com 50 pontos base
- +5 pontos para cada criterionio true no real_pattern_check (máx +35)
- +5 pontos se a resposta menciona o nome do cliente
- +5 pontos se a resposta é personalizada para o cenário específico
- -10 pontos se a resposta é genérica/copy-paste
- -10 pontos se tem linguagem robótica ou de IA
- -5 pontos se tem 2+ perguntas na mesma mensagem
- -5 pontos se não oferece nenhum próximo passo

# RETORNE APENAS JSON VÁLIDO:
{
  "score": 50,
  "feedback": "Feedback CRÍTICO e detalhado comparando com o prompt atual",
  "strengths": ["O que a secretária fez CORRETO (mínimo 1, máximo 3)"],
  "weaknesses": ["O que a secretária DEVERIA ter feito diferente (mínimo 2, máximo 5)"],
  "tips": ["Dicas ESPECÍFICAS para melhorar (mínimo 2)"],
  "improved_response": "Versão MELHORADA da resposta aplicando todas as técnicas",
  "real_pattern_check": {
    "identity_ok": true_ou_false,
    "short_response": true_ou_false,
    "one_question": true_ou_false,
    "active_listening": true_ou_false,
    "scheduling_offered": true_ou_false,
    "objection_handled": "true_ou_false_ou_na",
    "psychological_trigger": true_ou_false
  }
}

REGRAS FINAIS: Seja RIGOROSA e CRÍTICA. Uma resposta mediana NÃO pode passar de 65 pontos. Apenas respostas que usam MÚLTIPLAS técnicas de captação e são personalizadas podem passar de 80. Nunca dê pontuação alta por resposta genérica.`;
      } else {
        systemPrompt = EVALUATION_SYSTEM_PROMPT;
      }

      userContent = `ESTRATÉGIA TREINADA: ${strategyId}

CENÁRIO APRESENTADO À SECRETÁRIA:
${scenarioText}

RESPOSTA DA SECRETÁRIA DE TREINAMENTO:
${userResponse}

AVALIE a resposta da secretária. Verifique se usou as técnicas de captação, se manteve a identidade, se respondeu no estilo WhatsApp, se ofereceu agendamento quando apropriado.`;
    }

    // --- MELHORAR PROMPT DA SECRETÁRIA ---
    else if (action === "improve_prompt") {
      const currentPrompt: string = String(body.current_prompt ?? "").trim();
      const evaluationSummary: string = String(body.evaluation_summary ?? "").trim();
      const weaknesses: Array<string> = Array.isArray(body.weaknesses) ? body.weaknesses : [];
      const tips: Array<string> = Array.isArray(body.tips) ? body.tips : [];

      if (!currentPrompt) {
        return new Response(
          JSON.stringify({ error: "current_prompt obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      systemPrompt = `Você é uma especialista em engenharia de prompts para secretárias jurídicas. Sua tarefa é melhorar o prompt da secretária do escritório Dra. Kênia Garcia com base em feedback de avaliação.

# PROMPT ATUAL:
${currentPrompt}

# FEEDBACK DA AVALIAÇÃO:
${evaluationSummary}

# PONTOS FRACOS IDENTIFICADOS:
${weaknesses.length > 0 ? weaknesses.map((w: string) => `- ${w}`).join("\n") : "Nenhum ponto fraco identificado"}

# DICAS SUGERIDAS:
${tips.length > 0 ? tips.map((t: string) => `- ${t}`).join("\n") : "Nenhuma dica específica"}

# REGRAS PARA MELHORAR O PROMPT:
1. Mantenha toda a identidade e informações do escritório
2. Adicione ou melhore as instruções nos pontos fracos identificados
3. Adicione exemplos práticos de respostas corretas
4. Reforce técnicas que foram avaliadas negativamente
5. Mantenha o formato WhatsApp (respostas curtas, uma pergunta por vez)
6. NÃO remova seções importantes que já estão funcionando
7. O prompt melhorado deve ser COMPLETO e PRONTO para uso

# RETORNE APENAS JSON VÁLIDO:
{
  "improved_prompt": "O prompt completo e melhorado, pronto para uso",
  "changes": ["Lista das principais mudanças feitas no prompt"],
  "reasoning": "Breve explicação do raciocínio por trás das mudanças"
}`;
      userContent = `Analise o prompt atual da secretária e melhore-o com base no feedback de avaliação. Foque nos pontos fracos e aplique as dicas sugeridas.`;
    }

    // --- TREINAMENTO AUTOMÁTICO (TODAS AS ESTRATÉGIAS) ---
    else if (action === "auto_train") {
      const currentPrompt: string = String(body.current_prompt ?? "").trim();
      if (!currentPrompt) {
        return new Response(
          JSON.stringify({ error: "current_prompt obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const results: Array<Record<string, unknown>> = [];
      const strategyIds = STRATEGIES.map((s) => s.id);

      for (const strategyId of strategyIds) {
        try {
          // 1. Gerar cenário
          const scenarioResult = await chatCompletion({
            messages: [
              { role: "system", content: SCENARIO_SYSTEM_PROMPT },
              { role: "user", content: `Gere um cenário realista para a estratégia "${strategyId}". O cenário deve ser específico para o escritório da Dra. Kênia Garcia.` },
            ],
            temperature: 0.7,
            maxTokens: 2000,
            model: "openai/gpt-4o-mini",
          });

          if (!scenarioResult.ok) continue;
          const scenarioText = scenarioResult.data?.choices?.[0]?.message?.content || "";
          const scenarioParsed = parseJsonResponse(scenarioText);
          if (!scenarioParsed) continue;

          // 2. Gerar resposta da secretária
          const responseResult = await chatCompletion({
            messages: [
              { role: "system", content: currentPrompt },
              { role: "user", content: `Cenário: ${scenarioParsed.scenario}\n\nMensagem do cliente: ${scenarioParsed.client_message}\n\nResponda como a secretária do escritório.` },
            ],
            temperature: 0.7,
            maxTokens: 1000,
            model: "openai/gpt-4o-mini",
          });

          if (!responseResult.ok) continue;
          const secretaryResponse = responseResult.data?.choices?.[0]?.message?.content || "";

          // 3. Avaliar resposta
          const evalResult = await chatCompletion({
            messages: [
              { role: "system", content: `Você é a supervisora de atendimento. Avalie RIGOROSAMENTE a resposta comparando com o PROMPT ATUAL:\n\nPROMPT:\n${currentPrompt.slice(0, 3000)}\n\nREGRA DE PONTUAÇÃO:\n- 0-30: Péssima, genérica\n- 31-50: Fraca, falta técnicas\n- 51-65: Mediana, parcial\n- 66-80: Boa, pode melhorar\n- 81-90: Muito boa\n- 91-100: Excelente\n\nComece com 50 base. +5 por criterionio true (máx +35). +5 nome do cliente. +5 personalizada. -10 genérica. -10 robótica. -5 2+ perguntas. -5 sem próximo passo.\n\nreal_pattern_check: identity_ok, short_response (até 3 frases), one_question (0-1), active_listening (demonstra escuta), scheduling_offered (oferece agendamento), objection_handled (true/false/na), psychological_trigger (2+ gatilhos = true).\n\nRETORNE APENAS JSON: {"score": 0-100, "feedback": "...", "strengths": [], "weaknesses": [], "tips": [], "real_pattern_check": {"identity_ok": true/false, "short_response": true/false, "one_question": true/false, "active_listening": true/false, "scheduling_offered": true/false, "objection_handled": true/false/"na", "psychological_trigger": true/false}}` },
              { role: "user", content: `Estratégia: ${strategyId}\nCenário: ${scenarioParsed.scenario}\nResposta: ${secretaryResponse}` },
            ],
            temperature: 0.5,
            maxTokens: 1500,
            model: "openai/gpt-4o-mini",
          });

          if (!evalResult.ok) continue;
          const evalText = evalResult.data?.choices?.[0]?.message?.content || "";
          const evalParsed = parseJsonResponse(evalText);

          results.push({
            strategy_id: strategyId,
            strategy_name: STRATEGIES.find((s) => s.id === strategyId)?.name || strategyId,
            scenario: scenarioParsed,
            secretary_response: secretaryResponse,
            evaluation: evalParsed || { score: 50, feedback: "Erro na avaliação" },
          });
        } catch (e) {
          console.error(`[training-engine] auto_train error for ${strategyId}:`, e);
        }
      }

      // Calcular estatísticas
      const scores = results.map((r) => (r.evaluation as Record<string, unknown>)?.score as number || 0);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const passed = scores.filter((s) => s >= 60).length;

      return new Response(
        JSON.stringify({
          results,
          stats: {
            total: results.length,
            passed,
            failed: results.length - passed,
            avgScore,
            passRate: results.length > 0 ? Math.round((passed / results.length) * 100) : 0,
          },
          provider: "openai/gpt-4o-mini",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- TREINAMENTO AUTOMÁTICO COM LOOP DE MELHORIA ---
    else if (action === "auto_train_loop") {
      const initialPrompt: string = String(body.current_prompt ?? "").trim();
      const targetImprovement: number = Number(body.target_improvement ?? 20);
      const maxIterations: number = Math.min(Number(body.max_iterations ?? 3), 3);

      if (!initialPrompt) {
        return new Response(
          JSON.stringify({ error: "current_prompt obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Usar apenas 5 estratégias-chave para caber no timeout da Edge Function
      const AUTO_LOOP_STRATEGIES = ["abordagem_inicial", "identificacao_dor", "fechamento", "lead_hesitante", "urgencia_etica"];

      const iterations: Array<Record<string, unknown>> = [];
      let currentPrompt = initialPrompt;
      let baselineScore = 0;
      let finalPrompt = initialPrompt;
      let iteration = 0;

      while (iteration < maxIterations) {
        iteration++;
        console.log(`[training-engine] auto_train_loop iteration ${iteration}/${maxIterations}`);

        // 1. Rodar treinamento com prompt atual
        const trainResults: Array<Record<string, unknown>> = [];
        for (const strategyId of AUTO_LOOP_STRATEGIES) {
          try {
            const scenarioResult = await chatCompletion({
              messages: [
                { role: "system", content: SCENARIO_SYSTEM_PROMPT },
                { role: "user", content: `Gere um cenário realista para a estratégia "${strategyId}".` },
              ],
              temperature: 0.7, maxTokens: 2000, model: "openai/gpt-4o-mini",
            });
            if (!scenarioResult.ok) continue;
            const scenarioParsed = parseJsonResponse(scenarioResult.data?.choices?.[0]?.message?.content || "");
            if (!scenarioParsed) continue;

            const responseResult = await chatCompletion({
              messages: [
                { role: "system", content: currentPrompt },
                { role: "user", content: `Cenário: ${scenarioParsed.scenario}\nMensagem: ${scenarioParsed.client_message}\nResponda como secretária.` },
              ],
              temperature: 0.7, maxTokens: 1000, model: "openai/gpt-4o-mini",
            });
            if (!responseResult.ok) continue;
            const secretaryResponse = responseResult.data?.choices?.[0]?.message?.content || "";

            const evalResult = await chatCompletion({
              messages: [
                { role: "system", content: `Avalie RIGOROSAMENTE comparando com o PROMPT:\n\nPROMPT:\n${currentPrompt.slice(0, 3000)}\n\nREGRA DE PONTUAÇÃO:\n- 0-30: Péssima, genérica\n- 31-50: Fraca, falta técnicas\n- 51-65: Mediana, parcial\n- 66-80: Boa, pode melhorar\n- 81-90: Muito boa\n- 91-100: Excelente\n\nComece com 50 base. +5 por criterionio true (máx +35). +5 nome do cliente. +5 personalizada. -10 genérica. -10 robótica. -5 2+ perguntas. -5 sem próximo passo.\n\nreal_pattern_check: identity_ok, short_response (até 3 frases), one_question (0-1), active_listening (demonstra escuta), scheduling_offered (oferece agendamento), objection_handled (true/false/na), psychological_trigger (2+ gatilhos = true).\n\nJSON: {"score": 0-100, "feedback": "...", "strengths": [], "weaknesses": [], "tips": [], "real_pattern_check": {"identity_ok": true/false, "short_response": true/false, "one_question": true/false, "active_listening": true/false, "scheduling_offered": true/false, "objection_handled": true/false/"na", "psychological_trigger": true/false}}` },
                { role: "user", content: `Estratégia: ${strategyId}\nResposta: ${secretaryResponse}` },
              ],
              temperature: 0.5, maxTokens: 1500, model: "openai/gpt-4o-mini",
            });
            if (!evalResult.ok) continue;
            const evalParsed = parseJsonResponse(evalResult.data?.choices?.[0]?.message?.content || "");
            trainResults.push({ strategy_id: strategyId, evaluation: evalParsed || { score: 50 } });
          } catch (e) { /* skip */ }
        }

        // 2. Calcular média
        const scores = trainResults.map((r) => (r.evaluation as Record<string, unknown>)?.score as number || 0);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const passed = scores.filter((s) => s >= 60).length;

        if (iteration === 1) baselineScore = avgScore;

        // 3. Verificar se atingiu meta
        const improvement = baselineScore > 0 ? Math.round(((avgScore - baselineScore) / baselineScore) * 100) : 0;
        const reachedTarget = improvement >= targetImprovement;

        // 4. Coletar weaknesses e tips
        const allWeaknesses: string[] = [];
        const allTips: string[] = [];
        trainResults.forEach((r) => {
          const ev = r.evaluation as Record<string, unknown>;
          if (Array.isArray(ev?.weaknesses)) allWeaknesses.push(...(ev.weaknesses as string[]));
          if (Array.isArray(ev?.tips)) allTips.push(...(ev.tips as string[]));
        });

        iterations.push({
          iteration,
          avgScore,
          baselineScore,
          improvement,
          passed,
          total: trainResults.length,
          weaknesses: [...new Set(allWeaknesses)].slice(0, 10),
          tips: [...new Set(allTips)].slice(0, 10),
          reachedTarget,
        });

        if (reachedTarget || iteration >= maxIterations) {
          finalPrompt = currentPrompt;
          break;
        }

        // 5. Melhorar prompt
        const improveResult = await chatCompletion({
          messages: [
            { role: "system", content: `Melhore o prompt. JSON: {"improved_prompt": "...", "changes": []}` },
            { role: "user", content: `PROMPT ATUAL:\n${currentPrompt}\n\nWEAKNESSES:\n${allWeaknesses.slice(0, 5).join("\n")}\n\nTIPS:\n${allTips.slice(0, 5).join("\n")}\n\nScore atual: ${avgScore}/100. Meta: +${targetImprovement}%. Melhore o prompt.` },
          ],
          temperature: 0.7, maxTokens: 4000, model: "openai/gpt-4o-mini",
        });

        if (improveResult.ok) {
          const impParsed = parseJsonResponse(improveResult.data?.choices?.[0]?.message?.content || "");
          if (impParsed?.improved_prompt) {
            currentPrompt = impParsed.improved_prompt as string;
          }
        }
      }

      return new Response(
        JSON.stringify({
          iterations,
          final_prompt: finalPrompt,
          initial_prompt: initialPrompt,
          baseline_score: baselineScore,
          final_score: iterations[iterations.length - 1]?.avgScore || 0,
          total_improvement: baselineScore > 0
            ? Math.round((((iterations[iterations.length - 1]?.avgScore as number) || 0) - baselineScore) / baselineScore * 100)
            : 0,
          target_improvement: targetImprovement,
          reached_target: iterations[iterations.length - 1]?.reachedTarget || false,
          provider: "openai/gpt-4o-mini",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    else {
      return new Response(
        JSON.stringify({ error: "action inválida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- CHAMADA À IA ---
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ];

    console.log("[training-engine] Calling AI, action:", action);

    const aiResult = await chatCompletion({
      messages,
      temperature: 0.7,
      maxTokens: 4000,
      model: "openai/gpt-4o-mini",
    });

    if (!aiResult.ok) {
      console.error("[training-engine] AI failed:", aiResult.status, aiResult.error);
      return new Response(
        JSON.stringify({ error: "IA indisponível", details: String(aiResult.error || "").slice(0, 200) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const rawText = aiResult.data?.choices?.[0]?.message?.content || "";
    console.log("[training-engine] Got response, length:", rawText.length, "provider:", aiResult.provider);

    const parsed = parseJsonResponse(rawText);

    if (!parsed) {
      console.error("[training-engine] Parse failed. Raw:", rawText.slice(0, 300));
      return new Response(
        JSON.stringify({ error: "Não foi possível parsear resposta da IA", debug: rawText.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- RESPOSTAS ---
    if (action === "generate_case") {
      return new Response(
        JSON.stringify({ case_data: parsed, provider: aiResult.provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "secretary_strategy") {
      return new Response(
        JSON.stringify({ strategy: parsed, provider: aiResult.provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "secretary_evaluate") {
      const score = typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50;
      return new Response(
        JSON.stringify({
          score,
          feedback: parsed.feedback || "Avaliação concluída.",
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          tips: parsed.tips || [],
          improved_response: parsed.improved_response || "",
          real_pattern_check: parsed.real_pattern_check || {},
          evaluation: parsed,
          provider: aiResult.provider,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "improve_prompt") {
      return new Response(
        JSON.stringify({
          improved_prompt: parsed.improved_prompt || "",
          changes: parsed.changes || [],
          reasoning: parsed.reasoning || "",
          provider: aiResult.provider,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "evaluate") {
      const score = typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50;
      return new Response(
        JSON.stringify({ score, feedback: parsed.feedback || "Avaliação concluída.", evaluation: parsed, provider: aiResult.provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "get_tips") {
      return new Response(
        JSON.stringify({ tips: parsed.tips || [], provider: aiResult.provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Ação desconhecida" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[training-engine] fatal:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
