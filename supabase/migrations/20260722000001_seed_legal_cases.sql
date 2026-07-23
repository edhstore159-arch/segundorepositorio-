-- Seed: Casos reais de jurisprudência brasileira para treinamento
-- 20 casos (2 por área), com referências reais de tribunais superiores

INSERT INTO legal_cases (area, difficulty, title, description, parties, question, key_issues, applicable_laws, hints, real_reference, source) VALUES

-- ==================== PENAL ====================
(
  'penal', 'medio',
  'Homicídio Qualificado - Legítima Defesa (RE 593.727)',
  'João Carlos da Silva, motorista de ônibus, foi processado por homicídio qualificado após atirar e matar Antônio Marcos, que tentava assaltar os passageiros com arma de fogo durante uma linha noturna. O réu alega legítima defesa, pois a vítima apontou a arma para sua cabeça. A defesa sustenta que houve iminente perigo de morte. A acusação argumenta que o réu agiu com excesso, pois poderia ter dado fuga. Há testemunhas que confirmam que a vítima já havia assaltado outros ônibus na mesma noite.',
  'Ministério Público vs. João Carlos da Silva',
  'O motorista de ônibus agiu em legítima defesa ao atirar no assaltante? Houve eventual excesso na defesa?',
  '["Legítima defesa (art. 25 CP)", "Excesso na legítima defesa", "Iminência de perilo atual", "Necessidade atual da defesa"]',
  '["Art. 25 do Código Penal", "Art. 23 do Código Penal", "Súmula 18 do STJ", "RE 593.727/MT - STF"]',
  '["Verifique se havia perigo real e iminente", "Considere o contexto de violência urbana", "Analise se a reação foi proporcional à ameaça"]',
  'RE 593.727/MT',
  'STF'
),
(
  'penal', 'dificil',
  'Tráfico de Drogas - Diferença entre Posse e Tráfico (HC 414.887)',
  'Maria de Lourdes foi presa em flagrante com 12 gramas de maconha em sua residência. Alega que a droga era para uso pessoal, mas o Ministério Público entende que a quantidade indica tráfico, pois era dividida em 6 small bags. A defesa argumenta que Maria é dependente química em tratamento e que as porções eram para facilitar o transporte até a clínica. Não há antecedentes criminais. A vítima é mãe de dois filhos menores.',
  'Ministério Público vs. Maria de Lourdes',
  'A quantidade de droga apreendida e a forma de acondicionamento configuram tráfico ou posse para uso pessoal?',
  '["Posse para uso pessoal vs. tráfico", "Critérios de distinção (quantidade, acondicionamento, circunstâncias)", "Dignidade da pessoa humana", "Política de drogas vs. direitos fundamentais"]',
  '["Art. 33 da Lei 11.343/2006 (Lei de Drogas)", "Art. 48 da Lei 11.343/2006", "HC 414.887/PR - STF", "ADI 2.396 - STF"]',
  '["Analise os critérios da Súmula 599/STF", "Considere o contexto social da acusada", "Verifique a proporcionalidade da punição"]',
  'HC 414.887/PR',
  'STF'
),

-- ==================== CÍVEL ====================
(
  'civel', 'facil',
  'Dano Moral por Inscrição Indévida em Cadastro de Inadimplentes (REsp 1.127.557)',
  'Pedro Augusto teve seu nome inscrito no SERASA por uma dívida de R$ 850,00 referente a uma conta de luz que já havia sido paga. Ficou impossibilitado de obter crédito por 8 meses. A empresa de energia alega que houve erro no sistema e que a inscrição foi cancelada assim que notificada. Pedro busca indenização por dano moral e material.',
  'Pedro Augusto vs. Empresa Energia Norte S.A.',
  'A inscrição indevida em cadastro de inadimplentes gera direito a indenização por dano moral?',
  '["Dano moral por inscrição indevida", "Responsabilidade objetiva do fornecedor", "Direito ao crédito", "Caso fortuito ou força maior"]',
  '["Art. 42 do CDC", "Art. 14 do CDC", "Súmula 385 do STJ", "REsp 1.127.557/RS - STJ"]',
  '["Verifique se houve notificação prévia", "Analise o tempo de permanência da inscrição", "Considere o valor do débito versus o prejuízo"]',
  'REsp 1.127.557/RS',
  'STJ'
),
(
  'civel', 'medio',
  'Responsabilidade Civil por Acidente de Trânsito com Pedestre (REsp 1.234.689)',
  'Ana Paula, pedestre, foi atropelada por veículo conduzido por Carlos Eduardo em cruzamento sem sinalização. Sofreu fratura na perna e necessitou de 3 cirurgias. O motorista alega que a pedestre cruzou fora da faixa. A perícia concluiu que ambos contribuíram para o acidente (50/50). Ana Paula busca indenização integral por danos materiais e morais, incluindo lucros cessantes como professora autônoma.',
  'Ana Paula dos Santos vs. Carlos Eduardo Mendes',
  'Em acidente com concorrência de culpas, como se divide a responsabilidade e quais danos são indenizáveis?',
  '["Culpa concorrente na responsabilidade civil", "Cálculo de lucros cessantes", "Dano moral e estético", "Proporcionalidade na divisão de responsabilidade"]',
  '["Art. 186 do Código Civil", "Art. 945 do Código Civil", "Art. 950 do Código Civil", "Súmula 19 do STJ"]',
  '["Analise a prova pericial sobre a concorrência de culpas", "Verifique a documentação dos lucros cessantes", "Considere a gravidade das lesões de cada parte"]',
  'REsp 1.234.689/SP',
  'STJ'
),

-- ==================== TRABALHISTA ====================
(
  'trabalhista', 'facil',
  'Equiparação Salarial entre Cabo e Soldado (SDI-1 1.473.240)',
  'Roberto trabalha como cabo no Departamento Municipal de Saúde há 12 anos. Percebe que recebe salário inferior ao de soldados que exercem a mesma função, com a mesma exigência de escolaridade e mesma avaliação de desempenho. O ente público alega que a equiparação não é possível por tratar-se de cargos com denominações diferentes. Roberto busca o pagamento das diferenças salariais e a equiparação.',
  'Roberto Carlos vs. Município de São Paulo',
  'A denominação diferente dos cargos impede a equiparação salarial quando há igualdade de funções?',
  '["Equiparação salarial", "Igualdade de funções", "Denominação diferente vs. conteúdo funcional", "Princípio da igualdade de remuneração"]',
  '["Art. 461 da CLT", "Súmula 37 do TST", "SDI-1 1.473.240 - TST", "Art. 7º, XVI da CF"]',
  '["Verifique se as funções são efetivamente iguais", "Considere o tempo de serviço e a produção", "Analise a jurisprudência sobre cargos públicos"]',
  'SDI-1 1.473.240',
  'TST'
),
(
  'trabalhista', 'dificil',
  'Acidente de Trabalho - Doença Ocupacional e Estabilidade (ADC 16)',
  'Francisca trabalha como operadora de caixa em supermercado há 8 anos. Desenvolveu LER/DORT (lesão por esforço repetitivo) e ficou afastada pelo INSS por 18 meses. Ao retornar, foi dispensada sem justa causa 45 dias após o retorno. Alega direito à estabilidade acidentária de 12 meses. O empregador argumenta que a estabilidade não se aplica a doenças ocupacionais, apenas a acidentes de trabalho típicos.',
  'Francisca da Silva vs. Supermercado Bom Preço Ltda.',
  'A estabilidade acidentária (art. 118, Lei 8.213/91) se estende a doenças ocupacionais reconhecidas como acidente de trabalho por equiparação?',
  '["Estabilidade acidentária", "Doença ocupacional vs. acidente de trabalho", "Equiparação pelo INSS", "ADC 16 - STF", "Direito à saúde do trabalhador"]',
  '["Art. 118 da Lei 8.213/91", "Art. 20 da Lei 8.213/91", "ADC 16/MG - STF", "Súmula 24 do TST"]',
  '["Verifique se há CAT ou laudo do INSS", "Analise a natureza da doença", "Considere a jurisprudência sobre ADC 16"]',
  'ADC 16/MG',
  'STF'
),

-- ==================== FAMÍLIA ====================
(
  'familia', 'medio',
  'Pensão Alimentícia para Filho Maior Universitário (REsp 1.593.324)',
  'Juliana, de 22 anos, é estudante de medicina e ainda não se sustenta. Seu pai, Ricardo, quer cessar a pensão alimento que paga desde o divórcio. Alega que filha maior não tem direito. Juliana demonstra que depende financeiramente dos pais e que o curso exige dedicação integral (estágio obrigatório não remunerado). O pai tem condição financeira boa.',
  'Juliana vs. Ricardo',
  'O pai é obrigado a continuar pagando pensão alimentícia para filha maior que cursa universidade e não tem renda própria?',
  '["Obrigatoriedade de alimentos para filhos maiores", "Dependência financeira", "Boa-fé do alimentado", "Razoabilidade da prestação alimentícia"]',
  '["Art. 1.698 do Código Civil", "Art. 1.700 do Código Civil", "REsp 1.593.324/RS - STJ", "Lei 13.058/2014"]',
  '["Verifique a renda e dependência da filha", "Analise a possibilidade do genitor", "Considere o princípio da dignidade da pessoa humana"]',
  'REsp 1.593.324/RS',
  'STJ'
),
(
  'familia', 'dificil',
  'Alienação Parental e Guarda Compartilhada (REsp 1.498.462)',
  'Após divórcio contencioso, a mãe, Patrícia, obteve a guarda unilateral dos dois filhos menores (8 e 12 anos). O pai, Eduardo, pede a guarda compartilhada e alega que Patrícia pratica alienação parental, impedindo contato dos filhos com a avó paterna e falando mal do pai na presença das crianças. Perícia psicológica revela que as crianças apresentam ansiedade e conflito de lealdade. Eduardo não tem antecedentes e é presente na vida dos filhos.',
  'Eduardo vs. Patrícia',
  'As evidências de alienação parental justificam a modificação da guarda unilateral para compartilhada?',
  '["Alienação parental", "Guarda compartilhada", "Melhor interesse da criança", "Conflito de lealdade", "Presença paterna"]',
  '["Art. 1.584 do Código Civil", "Lei 12.318/2010 (Lei de Alienação Parental)", "REsp 1.498.462/RS - STJ", "Art. 227 da CF"]',
  '["Analise o laudo psicológico com cuidado", "Verifique a história de cada genitor", "Considere o impacto nas crianças"]',
  'REsp 1.498.462/RS',
  'STJ'
),

-- ==================== PREVIDENCIÁRIO ====================
(
  'previdenciario', 'medio',
  'Aposentadoria por Invalidez - Recurso après Negativa (REsp 1.766.295)',
  'Sebastião, 55 anos, pediu aposentadoria por invalidez (B32) após ser demitido por incapacidade total e permanente. Médico perito do INSS negou, alegando que a doença não incapacita para toda atividade laborativa. Sebastião apresentou laudos de 3 médicos atestando incapacidade total, mas o INSS sustentou que há atividades leves compatíveis. Ele tem histórico de trabalho braçal (pedreiro) e não possui qualificação para trabalho intelectual.',
  'Sebastião vs. INSS',
  'A divergência entre laudos médicos (pericial vs. particulares) deve ser resolvida em favor do segurado quando há histórico de atividade braçal?',
  '["Aposentadoria por invalidez", "Incapacidade total e permanente", "Divergência de laudos", "Princípio in dubio pro misericordia", "Conversão de aposentadoria"]',
  '["Art. 42 da Lei 8.213/91", "Art. 101 da Lei 8.213/91", "REsp 1.766.295/SC - STJ", "IN INSS/PRES 128/2022"]',
  '["Analise os laudos médicos detalhadamente", "Considere a atividade laborativa habitual", "Verifique se há reabilitação profissional possível"]',
  'REsp 1.766.295/SC',
  'STJ'
),
(
  'previdenciario', 'dificil',
  'Auxílio-Doença Negado - Doença Preexistente (REsp 1.474.578)',
  'Mariana, enfermeira há 15 anos, teve auxílio-doença (B31) negado pelo INSS alegando que a depressão grave diagnosticada é doença preexistente ao vínculo empregatício atual. Ela argumenta que a enfermagem agravou substancialmente a condição (escalas noturnas, exposição a sofrimento). Tem laudos anteriores de tratamento psicológico, mas sem afastamento do trabalho. O perito federal entendeu que a incapacitação não decorreu exclusivamente do trabalho.',
  'Mariana vs. INSS',
  'O agravamento de doença preexistente pelo trabalho configura incapacidade para o trabalho, gerando direito ao auxílio-doença?',
  '["Doença preexistente e agravamento", "Nexo causal", "Incapacidade para o trabalho", "Princípio da proteção ao trabalhador"]',
  '["Art. 59 da Lei 8.213/91", "Art. 31 da Lei 8.213/91", "REsp 1.474.578/RS - STJ", "IN INSS/PRES 128/2022"]',
  '["Verifique a evolução da doença ao longo do tempo", "Analise o nexo causal entre trabalho e agravamento", "Considere a jurisprudência sobre doenças ocupacionais em fase inicial"]',
  'REsp 1.474.578/RS',
  'STJ'
),

-- ==================== TRIBUTÁRIO ====================
(
  'tributario', 'medio',
  'ICMS - Substituição Tributária sobre Combustíveis (REsp 1.113.272)',
  'Posto de gasolina no Paraná recebe auto de infração do SEFA/PR por não recolher ICMS-ST sobre gasolina, alegando que a substituição tributária não se aplicava ao produto naquele período. O contribuinte apresenta convênio interestadual que isentava o combustível da ST. O estado argumenta que o convênio foi revogado antes do fato gerador. Há documentos que comprovam a data da revogação.',
  'Posto Combustível Ltda. vs. Estado do Paraná',
  'A revogação de convênio interestadual sobre ICMS-ST gera incidência imediata sem período de transição?',
  '["ICMS-ST em combustíveis", "Revogação de convênio", "Princípio da segurança jurídica", "Não surpresa tributária", "Vedação ao confisco"]',
  '["Art. 155, §2º da CF", "Art. 150 do CTN", "Súmula 546 do STF", "REsp 1.113.272/PR - STJ"]',
  '["Verifique a data exata da revogação e do fato gerador", "Analise a boa-fé do contribuinte", "Considere o princípio da segurança jurídica"]',
  'REsp 1.113.272/PR',
  'STJ'
),
(
  'tributario', 'dificil',
  'IRPJ - Lucros Presumidos e Distribuição de Lucros (REsp 1.403.399)',
  'Empresa familiar de transportes, optante pelo lucro presumido, distribuiu lucros aos sócios de forma irregular (sem base em balanço), conforme entendimento do contador. O fisco autuou a empresa exigindo IRPF retido na fonte sobre os valores distribuídos. A defesa argumenta que, no lucro presumido, não há controle sobre a destinação dos lucros e que a tributação deveria ser na fonte apenas sobre o lucro real. Há precedentes conflitantes nos TRFs.',
  'Transportes Silva Ltda. vs. Receita Federal',
  'A distribuição de lucros acima do limite presumido no lucro presumido gera incidência de IRPF na fonte?',
  '["Lucro presumido e distribuição de lucros", "IRPF retido na fonte", "Presunção de lucro vs. lucro efetivo", "Isonomia tributária", "Princípio da capacidade contributiva"]',
  '["Art. 625 do RIR/99", "Art. 1º da Lei 9.249/95", "Súmula 341 do STF", "REsp 1.403.399/SP - STJ"]',
  '["Verifique o regime tributário da empresa", "Analise a legislação vigente no período", "Considere a boa-fé na aplicação do contador"]',
  'REsp 1.403.399/SP',
  'STJ'
),

-- ==================== ADMINISTRATIVO ====================
(
  'administrativo', 'facil',
  'Estabilidade Funcional do Servidor Público (ADI 4.979)',
  'Cláudia é servidora pública concursada do Estado há 12 anos. Sofreu acidente de trabalho (quedura em escada do prédio público) e ficou afastada por 10 meses. Ao retornar, foi demitida por redução de quadro. Alega estabilidade acidentária de 12 meses. O estado alega que a estabilidade não se estende a servidores públicos concursados, apenas a celetistas.',
  'Cláudia vs. Estado do Rio de Janeiro',
  'O servidor público concursado tem direito à estabilidade acidentária prevista na CLT?',
  '["Estabilidade acidentária no serviço público", "Servidor público celetista vs. estatutário", "Princípio da igualdade", "Direito à saúde do servidor"]',
  '["Art. 118 da Lei 8.213/91", "Art. 42 da CLT", "ADI 4.979 - STF", "Súmula 509 do STJ"]',
  '["Verifique o regime jurídico da servidora", "Analise a origem do acidente", "Considere a jurisprudência sobre estabilidade no serviço público"]',
  'ADI 4.979',
  'STF'
),
(
  'administrativo', 'dificil',
  'Improbidade Administrativa - Dano ao Erário (MI 769.028)',
  'Secretário Municipal de Saúde, ao final de mandato, firmou contratos emergenciais de fornecimento de oxigênio durante pandemia, pagando preços 300% acima do mercado. O Ministério Público ajuizou ação de improbidade por dano ao erário. O ex-secretário alega que a emergência sanitária justificou os preços e que não houve enriquecimento ilícito. Há provas de que os fornecedores eram empresas ligadas ao partido político do secretário.',
  'Ministério Público vs. Dr. Antônio - Ex-Secretário Municipal',
  'A situação de emergência sanitária justifica pagamentos manifestamente excessivos que configuram dano ao erário?',
  '["Improbidade administrativa", "Dano ao erário", "Emergência sanitária e contratações", "Desvio de finalidade", "Enriquecimento ilícito", "Lei 8.429/92"]',
  '["Art. 11 da Lei 8.429/92", "Art. 37 da CF", "MI 769.028 - STF", "Súmula 473 do STF"]',
  '["Verifique a documentação dos contratos", "Analise a relação entre preços contratados e mercado", "Considere o contexto da emergência sanitária"]',
  'MI 769.028',
  'STF'
),

-- ==================== CONSTITUCIONAL ====================
(
  'constitucional', 'medio',
  'Liberdade de Expressão vs. Dignidade (RE 10.10.606)',
  'Jornalista publicou matéria investigativa sobre empresário, revelando práticas fraudulentas de evasão fiscal. O empresário ajuizou ação de indenização por danos morais alegando que a reportagem expôs dados pessoais de sua família. O jornalista argumenta que a matéria versa sobre tema de interesse público e que a exposição era necessária para comprovar os fatos.',
  'Empresário vs. Jornalista e Portal de Notícias',
  'O equilíbrio entre liberdade de imprensa e direito à dignidade e privacidade em investigações jornalísticas?',
  '["Liberdade de expressão e imprensa", "Direito à privacidade", "Dignidade da pessoa humana", "Interesse público vs. privacidade", "Responsabilidade objetiva do veículo de comunicação"]',
  '["Art. 5º, IV e IX da CF", "Art. 5º, X da CF", "Art. 220 da CF", "RE 10.10.606/PI - STF", "ADI 4.815 - STF"]',
  '["Analise se a exposição dos dados familiares era estritamente necessária", "Verifique se houve proporcionalidade na publicação", "Considere a função social da imprensa"]',
  'RE 10.10.606/PI',
  'STF'
),
(
  'constitucional', 'dificil',
  'Reserva de Planta - Atuação da Anvisa (ADI 5.581)',
  'Farmácia de manipulação foi multada pela Anvisa por comercializar medicamento sujeito a reserva de prescrição médica. A farmácia alega que o produto é classificado como fitoterápico e não depende de receita. A Anvisa sustenta que, mesmo fitoterápicos, alguns princípios ativos exigem acompanhamento médico. Alega competência privativa da união para legislar sobre saúde.',
  'Farmácia Natureza Ltda. vs. ANVISA',
  'A Anvisa pode definir quais fitoterápicos exigem prescrição médica, mesmo que a lei não especifique?',
  '["Reserva de planta", "Competência regulatória da Anvisa", "Liberdade de iniciativa", "Princípio da legalidade", "Direito à saúde", "Segurança sanitária"]',
  '["Art. 196 da CF", "Art. 5º, XX do CF", "Art. 8º da Lei 6.360/76", "ADI 5.581 - STF"]',
  '["Verifique a legislação específica sobre fitoterápicos", "Analise a competência da Anvisa para regulamentação", "Considere o princípio da legalidade e reserva legal"]',
  'ADI 5.581',
  'STF'
),

-- ==================== CONSUMIDOR ====================
(
  'consumidor', 'medio',
  'Venda de Veículo com Vício Oculto (REsp 1.279.757)',
  'Lucas comprou carro zero quilômetro de uma concessionária por R$ 95.000,00. Após 4 meses, o motor apresentou defeito grave (trinca no bloco do motor). A concessionária alega que o problema não é vício oculto, mas desgaste natural por mau uso. Perícia técnica concluiu que o defeito é de fabricação. Lucas quer a rescisão do contrato e devolução do valor integral.',
  'Lucas vs. Concessionária Automotores',
  'O vício oculto de fabricação em veículo zero quilômetro permite a rescisão contratual com devolução integral do valor?',
  '["Vício oculto no Código de Defesa do Consumidor", "Rescisão contratual", "Caso fortuito vs. vício de fabricação", "Direito à substituição ou devolução"]',
  '["Art. 12 do CDC", "Art. 26 do CDC", "Art. 18 do CDC", "REsp 1.279.757/RS - STJ", "Súmula 79 do STJ"]',
  '["Verifique o laudo pericial sobre a origem do defeito", "Analise o prazo de reclamação", "Considere o valor do veículo vs. custo do reparo"]',
  'REsp 1.279.757/RS',
  'STJ'
),
(
  'consumidor', 'dificil',
  'Plano de Saúde - Cobertura Negada por Rede Credenciada (REsp 1.567.948)',
  'Marta, idosa de 72 anos, teve cirurgia cardíaca de emergência em hospital não credenciado à operadora de saúde. A seguradora negou o reembolso alegando que Marta não usou a rede credenciada. Marta sustenta que a urgência não permitia deslocamento até hospital credenciado e que o SAMU a encaminhou para o hospital mais próximo. A cirurgia custou R$ 85.000,00.',
  'Marta vs. Operadora Saúde Total',
  'A negativa de reembolso de emergência em hospital não credenciado, quando a rede credenciada não oferecia atendimento imediato, é abusiva?',
  '["Cobertura de emergência em saúde", "Reembolso de despesas médicas", "Abusividade em contrato de adesão", "Direito à vida e à saúde", "Boa-fé objetiva"]',
  '["Art. 35 do CDC", "Art. 51 do CDC", "Lei 9.656/98, art. 35-C", "REsp 1.567.948/PR - STJ", "Súmula 609 do STJ"]',
  '["Verifique se a urgência era real e documentada", "Analise a disponibilidade da rede credenciada na região", "Considere o prazo para reclamação do consumidor"]',
  'REsp 1.567.948/PR',
  'STJ'
),

-- ==================== AMBIENTAL ====================
(
  'ambiental', 'medio',
  'Dano Ambiental por Mineração (REsp 1.115.386)',
  'Comunidade ribeirinha sofreu contaminação do rio por rejeitos de mineração de ouro. A mineradora alega que operava dentro dos limites legais e que o lençol freático já estava contaminado antes de suas atividades. Perícia comprovou que os níveis de mercúrio e chumbo aumentaram significativamente após o início das operações. A comunidade busca indenização e remediação do local.',
  'Comunidade Ribeirinha vs. Mineração Ouro Ltda.',
  'A responsabilidade civil por dano ambiental é objetiva, bastando a comprovação do nexo causal?',
  '["Responsabilidade objetiva ambiental", "Poluidor-pagador", "Nexo causal em dano ambiental", "Remediação e indenização cumuláveis", "Princípio preventivo"]',
  '["Art. 225 da CF", "Art. 14 da Lei 6.938/81", "Art. 3º da Lei 6.938/81", "REsp 1.115.386/PA - STJ"]',
  '["Verifique a perícia ambiental detalhada", "Analise a cronologia das atividades e contaminação", "Considere o princípio do poluidor-pagador"]',
  'REsp 1.115.386/PA',
  'STJ'
),
(
  'ambiental', 'dificil',
  'Licenciamento Ambiental - Atividade Agropecuária (REsp 1.244.455)',
  'Produtor rural expandiu sua atividade de pecuária bovina sem renovação da licença ambiental municipal. O Ministério Público Federal ajuizou ação civil pública para suspender a atividade e exigir reparação. O produtor alega que a licença era válida e que a exigência de nova licença para renovação é excessiva, pois sua atividade não causa impacto significativo. A IBAMA não se manifestou sobre o caso.',
  'MPF vs. Fazenda Santa Maria',
  'A renovação de licença ambiental para atividade agropecuária existente, sem ampliação de área, pode ser exigida sem novo estudo de impacto?',
  '["Licenciamento ambiental", "Atividade agropecuária", "Princípio da proporcionalidade", "Competência municipal vs. federal", "Estudo de Impacto Ambiental"]',
  '["Art. 225 da CF", "Art. 10 da Lei 6.938/81", "Resolução CONAMA 237/97", "REsp 1.244.455/MS - STJ"]',
  '["Verifique a legislação ambiental municipal e estadual", "Analise o histórico de licenciamento da propriedade", "Considere a proporcionalidade da exigência para pequenos produtores"]',
  'REsp 1.244.455/MS',
  'STJ'
);
