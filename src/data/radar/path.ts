/**
 * Tela 06 — Construa seu caminho (§7 do documento do Radar IA v1.4).
 */
export type GroupSize = 'ate-10' | '11-25' | '26-50' | 'mais-50';
export type ToolEnv = 'copilot' | 'claude' | 'gemini' | 'chatgpt' | 'outros' | 'avaliando';
export type IndicatorId = 'autonomia' | 'qualidade' | 'aplicacoes' | 'seguranca' | 'esforco';

export const PATH_INTRO = {
  eyebrow: 'Tela 6 de 7 · Construa seu caminho',
  title: 'Toda transformação começa com um primeiro grupo.',
  text: 'Vamos construir um caminho inicial para sua equipe explorar essas possibilidades.',
  scenarioTitle: 'Seu cenário inicial',
  transition: 'Seu primeiro caminho está estruturado. Agora vamos transformá-lo em um material para discussão interna.',
  next: 'Ver meu plano de evolução',
};

/**
 * Rótulos do caminho, iguais no cartão do cenário, no painel "Sua jornada" e no
 * PDF (revisão de clareza, 16/11/2026: antes eram "Grupo inicial", "Ambiente",
 * "Indicador" ou "Sinal de sucesso", conforme o lugar).
 */
export const PATH_LABEL = {
  goal: 'Objetivo',
  group: 'Primeiro grupo a capacitar',
  tools: 'Ferramenta de IA',
  indicator: 'Sinal de sucesso',
} as const;

export const GROUP_SIZES: { id: GroupSize; label: string }[] = [
  { id: 'ate-10', label: 'Até 10 colaboradores' },
  { id: '11-25', label: '11 a 25 colaboradores' },
  { id: '26-50', label: '26 a 50 colaboradores' },
  { id: 'mais-50', label: 'Mais de 50 colaboradores' },
];

export const TOOL_ENVS: { id: ToolEnv; label: string; note: string }[] = [
  { id: 'copilot', label: 'Microsoft 365 Copilot', note: 'O plano considera recursos do Microsoft 365 Copilot disponíveis no seu ambiente.' },
  { id: 'claude', label: 'Claude', note: 'O plano considera recursos do Claude disponíveis no seu ambiente.' },
  { id: 'gemini', label: 'Gemini', note: 'O plano considera recursos do Gemini disponíveis no seu ambiente.' },
  { id: 'chatgpt', label: 'ChatGPT', note: 'O plano considera recursos do ChatGPT disponíveis no seu ambiente.' },
  { id: 'outros', label: 'Outros', note: 'O plano considera as ferramentas que a sua empresa já usa ou aprovou.' },
  { id: 'avaliando', label: 'Ainda estamos avaliando', note: 'A capacitação também ajuda a comparar as ferramentas antes da escolha.' },
];

export const INDICATORS: { id: IndicatorId; label: string }[] = [
  { id: 'autonomia', label: 'Colaboradores mais autônomos para utilizar IA nas atividades.' },
  { id: 'qualidade', label: 'Melhor qualidade e consistência das entregas.' },
  { id: 'aplicacoes', label: 'Mais aplicações reais no dia a dia.' },
  { id: 'seguranca', label: 'Uso mais seguro e responsável das ferramentas.' },
  { id: 'esforco', label: 'Menor esforço em uma tarefa selecionada, com medição antes/depois.' },
];

export const QUESTIONS_06 = {
  group: 'Quantas pessoas você gostaria de envolver inicialmente?',
  tools: 'Qual ambiente de IA sua empresa utiliza ou pretende utilizar?',
  indicator: 'Se seu time fosse treinado, como você gostaria de perceber que uma capacitação está fazendo diferença?',
};

/** Mais de 50: turmas, sem número nem preço antes de validar o contexto. */
/** Nota depois da pergunta de ferramentas quando há mais de uma marcada. */
export const TOOLS_MULTI_NOTE = 'O plano considera os ambientes que você indicou, de acordo com o que cada equipe usa.';

export const LARGE_GROUP_NOTE = 'O IA para Equipes trabalha com até 50 participantes por turma. Para grupos maiores, é possível organizar mais de uma turma, definida depois de entender o contexto.';

export const TOOLS_RULE = 'As possibilidades do plano dependem do produto, da licença e da configuração do seu ambiente. Nem tudo o que aparece no vídeo está incluído em uma licença específica.';

/** Trilha da Tela 06 (§7, tratamento visual). */
/** `short`: a frase do marco na linha do tempo da apresentação em PDF. */
export const TRACK = [
  { id: 'preparar', label: 'Preparar', text: 'Diagnóstico prévio das necessidades e do nível de familiaridade da equipe.', short: 'Diagnóstico da equipe antes das sessões.' },
  { id: 'capacitar', label: 'Capacitar', text: 'Duas sessões online de 2 horas, com exemplos ligados à realidade das equipes.', short: 'Duas sessões online de 2 horas.' },
  { id: 'experimentar', label: 'Experimentar', text: 'Aplicar o aprendizado nas atividades candidatas, com ferramentas autorizadas.', short: 'Aplicar nas atividades escolhidas.' },
  { id: 'avaliar', label: 'Avaliar', text: 'Observar o indicador escolhido e reunir aprendizados.', short: 'Observar o sinal de sucesso.' },
  { id: 'expandir', label: 'Expandir', text: 'Decidir, com base no que foi observado, como ampliar para outras equipes.', short: 'Levar o que funcionou a outras equipes.' },
] as const;

/** Como o IA para Equipes se encaixa (§7, sem virar orçamento). */
export const OFFER = [
  'Diagnóstico prévio das necessidades e do nível de familiaridade.',
  'Duas sessões online de 2 horas, com foco em entendimento, boas práticas e aplicação.',
  'Até 50 pessoas por turma.',
  'Atividades e exemplos ligados à realidade das equipes.',
  'Possibilidade de apoio pós-capacitação, conforme contratação.',
  'Uso das ferramentas corporativas, como Microsoft 365 Copilot e Claude Enterprise, de acordo com o escopo e o ambiente do cliente.',
];

export const TECH_BOUNDARY = 'A capacitação desenvolve competências. Integração com sistemas legados, desenvolvimento de MCPs, implantação de automações, provisionamento de licenças e construção de dashboards corporativos podem demandar escopo técnico separado.';

/** Preparação recomendada, por ambiente (cartão "Seu cenário inicial"). */
export const PREPARATION = [
  'Confirmar quais ferramentas de IA estão aprovadas para o grupo.',
  'Escolher as atividades candidatas com a liderança da área.',
  'Registrar como a atividade é feita hoje, para comparar depois.',
];
