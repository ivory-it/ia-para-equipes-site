/**
 * Tela 05 — Sua primeira transformação com IA (§6 do documento do Radar IA v1.4).
 * Um objetivo prioritário, observável, e uma iniciativa inicial.
 */
import type { ActionId } from './actions.ts';

export type GoalId = 'esforco' | 'qualidade' | 'analise' | 'uso-seguro' | 'compartilhar';

export interface Goal {
  id: GoalId;
  label: string;
  /** Texto inicial de recomendação (tabela do §6). */
  recommendation: string;
  /** Começo da iniciativa sugerida, completado pela capacidade escolhida. */
  initiative: string;
  /** Iniciativa quando nenhuma capacidade foi escolhida. */
  initiativeFallback: string;
  /** Atividades candidatas para experimentação (Tela 06). */
  candidates: [string, string];
  /** Competências a desenvolver (Bloco 5 da Tela 07). */
  competencies: string[];
  /** Ação do plano equivalente, para não duplicar. */
  action: ActionId;
}

export const GOALS_INTRO = {
  eyebrow: 'Tela 5 de 7 · Sua primeira transformação com IA',
  title: 'E se você pudesse começar a transformar sua equipe amanhã?',
  text: 'Você descobriu novas possibilidades. Agora vamos escolher onde elas poderiam fazer diferença na sua empresa.',
  question: 'Qual resultado você gostaria de alcançar primeiro?',
  hint: 'Selecione uma prioridade inicial.',
  editHint: 'Você pode ajustar o texto da iniciativa antes de seguir.',
  next: 'Construir meu caminho',
};

export const GOALS: Goal[] = [
  {
    id: 'esforco',
    label: 'Reduzir o esforço em atividades repetitivas.',
    recommendation: 'Identifique uma tarefa recorrente e experimente como a IA pode reduzir o esforço de execução.',
    initiative: 'Escolher uma tarefa recorrente da equipe e',
    initiativeFallback: 'Escolher uma tarefa recorrente da equipe e comparar a execução com e sem IA.',
    candidates: ['Preparação de relatórios periódicos', 'Consolidação de informações de várias fontes'],
    competencies: ['Identificar tarefas recorrentes com potencial de apoio da IA', 'Escrever instruções reutilizáveis', 'Revisar resultados antes de usá-los'],
    action: 'experimento-com-sem-ia',
  },
  {
    id: 'qualidade',
    label: 'Melhorar a qualidade das entregas.',
    recommendation: 'Selecione uma entrega frequente e estabeleça um método com critérios de revisão e qualidade.',
    initiative: 'Definir critérios de qualidade para uma entrega frequente e',
    initiativeFallback: 'Definir critérios de qualidade para uma entrega frequente e usar a IA na revisão.',
    candidates: ['Revisão de documentos e propostas', 'Padronização de relatórios'],
    competencies: ['Dar contexto e critérios à IA', 'Avaliar a qualidade das respostas', 'Usar modelos e referências da empresa'],
    action: 'desafios-praticos',
  },
  {
    id: 'analise',
    label: 'Desenvolver a capacidade de análise da equipe.',
    recommendation: 'Desenvolva exercícios para interpretar informações, explorar dados e preparar análises com IA.',
    initiative: 'Criar exercícios de análise com dados da rotina e',
    initiativeFallback: 'Criar exercícios de análise com dados da rotina, usando informações fictícias ou autorizadas.',
    candidates: ['Análise de planilhas e indicadores', 'Preparação de resumos para reuniões'],
    competencies: ['Explorar dados com perguntas bem formuladas', 'Verificar números e fontes', 'Comunicar conclusões com clareza'],
    action: 'desafios-praticos',
  },
  {
    id: 'uso-seguro',
    label: 'Ampliar o uso seguro e consistente da IA.',
    recommendation: 'Trabalhe boas práticas para utilizar ferramentas aprovadas de maneira responsável.',
    initiative: 'Combinar diretrizes de uso responsável com prática guiada e',
    initiativeFallback: 'Combinar diretrizes de uso responsável com exercícios em cenários fictícios.',
    candidates: ['Uso de documentos internos nas ferramentas aprovadas', 'Revisão humana de respostas antes do envio'],
    competencies: ['Classificar informações antes de usá-las com IA', 'Reconhecer ferramentas aprovadas', 'Validar resultados antes de decidir'],
    action: 'checklist-uso-responsavel',
  },
  {
    id: 'compartilhar',
    label: 'Compartilhar conhecimento entre colaboradores.',
    recommendation: 'Identifique boas aplicações existentes e defina como multiplicá-las entre os colaboradores.',
    initiative: 'Registrar as boas aplicações que já existem e',
    initiativeFallback: 'Registrar as boas aplicações que já existem e apresentá-las em encontros curtos.',
    candidates: ['Documentação de boas práticas por área', 'Encontros “15 minutos de IA”'],
    competencies: ['Documentar maneiras de trabalhar com IA', 'Ensinar colegas a partir de casos reais', 'Adaptar práticas a outras áreas'],
    action: 'biblioteca-praticas',
  },
];

export const goalById = (id: GoalId) => GOALS.find((g) => g.id === id)!;
