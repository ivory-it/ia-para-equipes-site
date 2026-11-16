/**
 * Tela 02 — O espelho da organização. Quatro perguntas de resposta única e o
 * estado qualitativo de cada resposta (§4 do documento do Radar IA v1.4). A
 * leitura consultiva de cada combinação está em `portrait.ts`, gerado da matriz
 * revisada pelo Thiago; quem a aplica é `src/scripts/radar/engine.ts`.
 *
 * Não há nota nem porcentagem: o retrato representa respostas declaradas.
 */
export type Letter = 'A' | 'B' | 'C' | 'D';
export type DimensionId = 'pessoas' | 'processos' | 'seguranca' | 'disseminacao';

/** Estados qualitativos permitidos (§4.5). A ordem é a de evolução, sem número. */
export type QualState = 'Primeiros passos' | 'Em desenvolvimento' | 'Em estruturação' | 'Mais estruturado' | 'Não identificado';

export const STATE_LEVEL: Record<QualState, number> = {
  'Não identificado': 0,
  'Primeiros passos': 1,
  'Em desenvolvimento': 2,
  'Em estruturação': 3,
  'Mais estruturado': 4,
};

export interface Option {
  letter: Letter;
  text: string;
  state: QualState;
  /** Frase do retrato ("Seu retrato", §4.7). */
  summary: string;
}

export interface Question {
  id: DimensionId;
  dimension: string;
  prompt: string;
  options: [Option, Option, Option, Option];
}

export const MIRROR_INTRO = {
  eyebrow: 'Tela 2 de 7 · O espelho da organização',
  title: 'Sua empresa está pronta para dar o próximo passo com IA?',
  text: 'Você já identificou alguns desafios. Agora vamos descobrir o que sua organização já tem a favor e o que ainda precisa desenvolver.',
  hint: 'Quatro perguntas rápidas, uma por vez. Você pode voltar quando quiser.',
  resultTitle: 'Seu retrato',
  resultNote: 'Retrato baseado nas suas respostas. Não é uma nota nem uma medição.',
  transitionTitle: 'Você já tem pontos de partida importantes.',
  transitionText: 'Agora vamos descobrir onde eles podem fazer mais diferença.',
  next: 'Descobrir oportunidades para minha equipe',
};

export const QUESTIONS: [Question, Question, Question, Question] = [
  {
    id: 'pessoas',
    dimension: 'Pessoas e competências',
    prompt: 'Como a equipe utiliza IA atualmente?',
    options: [
      { letter: 'A', text: 'Geralmente faz perguntas simples, sem um método definido.', state: 'Primeiros passos', summary: 'Uso básico, sem método definido' },
      { letter: 'B', text: 'Algumas pessoas já conseguem obter bons resultados.', state: 'Em desenvolvimento', summary: 'Conhecimento prático em parte da equipe' },
      { letter: 'C', text: 'Existem colaboradores que dominam aplicações práticas e orientam outras pessoas.', state: 'Em estruturação', summary: 'Referências internas identificadas' },
      { letter: 'D', text: 'Não sei dizer como a equipe utiliza IA.', state: 'Não identificado', summary: 'Uso da equipe ainda não identificado' },
    ],
  },
  {
    id: 'processos',
    dimension: 'Aplicação nos processos',
    prompt: 'A empresa já identificou quais atividades poderiam ser melhoradas com o uso de IA?',
    options: [
      { letter: 'A', text: 'Ainda não mapeamos oportunidades de aplicação de IA nas atividades da empresa.', state: 'Primeiros passos', summary: 'Oportunidades ainda não mapeadas' },
      { letter: 'B', text: 'Temos algumas ideias, mas ainda não sabemos quais priorizar.', state: 'Em desenvolvimento', summary: 'Ideias conhecidas, sem priorização' },
      { letter: 'C', text: 'Já experimentamos IA em algumas atividades, mas sem um processo estruturado.', state: 'Em estruturação', summary: 'Experimentação sem processo estruturado' },
      { letter: 'D', text: 'Temos atividades definidas em que a IA é utilizada de forma recorrente, com resultados acompanhados.', state: 'Mais estruturado', summary: 'Aplicações recorrentes com resultados acompanhados' },
    ],
  },
  {
    id: 'seguranca',
    dimension: 'Segurança e orientação',
    prompt: 'Como a empresa orienta os colaboradores sobre o uso seguro da IA?',
    options: [
      { letter: 'A', text: 'Não temos orientações claras.', state: 'Primeiros passos', summary: 'Faltam diretrizes básicas' },
      { letter: 'B', text: 'Ele costuma consultar alguém de TI ou da liderança.', state: 'Em desenvolvimento', summary: 'Orientações dependem de consultas' },
      { letter: 'C', text: 'Temos ferramentas e orientações aprovadas.', state: 'Em estruturação', summary: 'Ferramentas e orientações aprovadas' },
      { letter: 'D', text: 'Temos políticas e colaboradores capacitados para aplicá-las.', state: 'Mais estruturado', summary: 'Políticas e pessoas capacitadas para aplicá-las' },
    ],
  },
  {
    id: 'disseminacao',
    dimension: 'Disseminação do conhecimento',
    prompt: 'Como a empresa compartilha o conhecimento sobre o uso de IA?',
    options: [
      { letter: 'A', text: 'O conhecimento geralmente fica com a própria pessoa.', state: 'Primeiros passos', summary: 'Conhecimento concentrado em indivíduos' },
      { letter: 'B', text: 'É compartilhado informalmente com colegas.', state: 'Em desenvolvimento', summary: 'Compartilhamento espontâneo, pouco estruturado' },
      { letter: 'C', text: 'Costumamos compartilhar boas aplicações.', state: 'Em estruturação', summary: 'Troca de experiências incentivada' },
      { letter: 'D', text: 'Existem iniciativas para registrar, ensinar e ampliar essas práticas.', state: 'Mais estruturado', summary: 'Mecanismos para registrar e multiplicar práticas' },
    ],
  },
];

export type MirrorAnswers = Partial<Record<DimensionId, Letter>>;
