/**
 * Diagramas das 12 práticas do apêndice do plano em PDF (16/11/2026, pedido do
 * Thiago: "mais criativo, diagramas e desenhos que já deixem a pessoa empolgada
 * em implementar"). Cada prática tem um tipo de diagrama escolhido pela forma do
 * conteúdo (regra da guizang-ppt-skill, usada só como referência): ciclo fechado
 * vira loop, passos lineares viram trilha, antes e depois viram comparação.
 *
 * Os rótulos vêm do texto da pílula (`challenges.ts`), encurtados. Nenhum número
 * ou resultado inventado: onde há campo de medida, ele fica em branco para a
 * empresa preencher.
 */
import type { SolarName } from '../../components/radar/icons.ts';

export type PracticeVisual =
  | { kind: 'fan'; sources: string[]; fields: string[]; target: string; targetNote: string }
  | { kind: 'sheet'; title: string; fields: { k: string; t: string }[]; versus: string; versusNote: string }
  | { kind: 'loop'; center: [string, string]; centerNote: string; steps: [string, string, string, string] }
  | { kind: 'matrix'; x: string; y: string; hot: string; hotNote: string; dots: [string, string, string] }
  | { kind: 'compare'; left: string; right: string; rows: string[]; fill: string }
  | { kind: 'trail'; steps: string[]; outputsLabel: string; outputs: [string, SolarName][] }
  | { kind: 'policy'; whoLabel: string; who: string[]; groups: { title: string; icon: SolarName; items: string[] }[] }
  | { kind: 'flow'; questions: string[]; yes: string; no: string; noNote: string }
  | { kind: 'document'; title: string; lines: { t: string; ok: boolean }[]; okLabel: string; protectLabel: string; questions: string[] }
  | { kind: 'funnel'; top: string; filters: string[]; result: string }
  | { kind: 'horizon'; start: string; question: string; mid: string; end: string; goals: string[] }
  | { kind: 'pilot'; inputs: [string, SolarName][]; metricsLabel: string; metrics: [string, string][]; result: string };

export const PRACTICE_VISUALS: Record<string, PracticeVisual> = {
  'uso-individual-1': {
    kind: 'fan',
    sources: ['Área 1', 'Área 2', 'Área 3'],
    fields: ['Tarefa feita com IA', 'Ferramenta usada', 'Benefício percebido'],
    target: 'Inventário de aplicações reais',
    targetNote: 'Montado com o conhecimento que já existe na empresa.',
  },
  'uso-individual-2': {
    kind: 'sheet',
    title: 'Ficha de prática',
    fields: [
      { k: 'Objetivo', t: 'O que a atividade precisa entregar' },
      { k: 'Informações', t: 'O que é preciso para executá-la' },
      { k: 'Instruções', t: 'O que foi pedido à IA' },
      { k: 'Critérios de revisão', t: 'Como conferir o resultado' },
    ],
    versus: 'Só o prompt',
    versusNote: 'Funciona para quem escreveu. Para os outros, falta contexto.',
  },
  'uso-individual-3': {
    kind: 'loop',
    center: ['15 minutos', 'de IA'],
    centerNote: 'a cada duas semanas',
    steps: ['Uma pessoa mostra uma aplicação real', 'Os colegas perguntam', 'A prática é registrada', 'Outras pessoas adaptam'],
  },
  'pouca-aplicacao-1': {
    kind: 'matrix',
    x: 'Quantas vezes é feita',
    y: 'Quanto tempo consome',
    hot: 'Comece aqui',
    hotNote: 'Frequente, demorada e simples de testar com segurança.',
    dots: ['Tarefa A', 'Tarefa B', 'Tarefa C'],
  },
  'pouca-aplicacao-2': {
    kind: 'compare',
    left: 'Processo atual',
    right: 'Com apoio da IA',
    rows: ['Tempo para concluir', 'Qualidade da entrega', 'Esforço para revisar'],
    fill: 'a medir',
  },
  'pouca-aplicacao-3': {
    kind: 'trail',
    steps: ['Escolhe uma tarefa do dia a dia', 'Experimenta com IA', 'Revisa e aperfeiçoa', 'Compartilha o que aprendeu'],
    outputsLabel: 'Cada pessoa sai com uma entrega real',
    outputs: [['Relatório', 'document-text'], ['Análise', 'chart-square'], ['Apresentação', 'presentation-graph'], ['Procedimento', 'clipboard-check']],
  },
  'seguranca-1': {
    kind: 'policy',
    whoLabel: 'Quem define',
    who: ['TI', 'Segurança', 'Jurídico e privacidade', 'RH', 'Áreas de negócio'],
    groups: [
      { title: 'O que usar', icon: 'layers', items: ['Ferramentas autorizadas', 'Classificação dos dados', 'Privacidade e LGPD', 'Usos permitidos e proibidos'] },
      { title: 'Como usar', icon: 'eye', items: ['Validação humana', 'Confidencialidade', 'Acessos e registros'] },
      { title: 'Como manter', icon: 'refresh', items: ['Resposta a incidentes', 'Capacitação', 'Revisão da política'] },
    ],
  },
  'seguranca-2': {
    kind: 'flow',
    questions: ['A ferramenta é aprovada pela empresa?', 'Tenho autorização para compartilhar essas informações?', 'Sei como verificar o resultado?'],
    yes: 'Pode usar',
    no: 'Pare e consulte',
    noNote: 'Fale com TI ou com a liderança antes de seguir.',
  },
  'seguranca-3': {
    kind: 'document',
    title: 'Contrato de prestação de serviços (fictício)',
    lines: [
      { t: 'Objeto e escopo do contrato', ok: true },
      { t: 'Nome e CPF do contratado', ok: false },
      { t: 'Prazos e entregas', ok: true },
      { t: 'Valores e dados bancários', ok: false },
      { t: 'Cláusulas padrão', ok: true },
    ],
    okLabel: 'Pode ir para a ferramenta aprovada',
    protectLabel: 'Exige proteção ou autorização',
    questions: ['O que pode ser usado?', 'O que exige proteção?', 'Como verificar a resposta?'],
  },
  'direcionamento-1': {
    kind: 'funnel',
    top: 'Todas as atividades da equipe',
    filters: ['Acontece com frequência', 'Entrada e saída bem definidas', 'Baixo risco para testar', 'Melhoria fácil de observar'],
    result: 'A primeira atividade',
  },
  'direcionamento-2': {
    kind: 'horizon',
    start: 'Hoje',
    question: 'O que a equipe deveria fazer melhor daqui a 30 dias?',
    mid: 'Como vamos perceber a evolução?',
    end: '30 dias',
    goals: ['Relatórios com menos esforço', 'Documentos de mais qualidade', 'Reuniões mais bem preparadas'],
  },
  'direcionamento-3': {
    kind: 'pilot',
    inputs: [['1 grupo', 'users-group-rounded'], ['2 atividades', 'checklist-minimalistic'], ['1 período', 'calendar']],
    metricsLabel: 'O que acompanhar',
    metrics: [['Adoção', 'Uso de IA nas atividades'], ['Qualidade', 'Critérios atendidos'], ['Eficiência', 'Tempo para executar']],
    result: 'Decisão de expansão',
  },
};
