/**
 * Falas curtas do Radar (documento v1.6): a dica da Tela 01, as confirmações e
 * os ícones das opções.
 *
 * Dicas: uma por pílula, com título de até ~12 palavras e apoio de 1 a 2 frases
 * (v1.6, §3.6). Só a de "Pouca aplicação prática · Identificar" vem literal do
 * documento; as outras foram escritas para o site a partir do texto da pílula e
 * passam pela revisão do Thiago. O texto integral das pílulas vai para o PDF.
 */
import type { SolarName } from '../../components/radar/icons.ts';
import type { ChallengeId } from './challenges.ts';
import type { CapabilityId } from './capabilities.ts';
import type { GoalId } from './goals.ts';
import type { GroupSize, ToolEnv, IndicatorId } from './path.ts';

export interface Tip { title: string; text: string }

export const TIPS: Record<string, Tip> = {
  'uso-individual-1': { title: 'Seus especialistas em IA talvez já estejam na equipe.', text: 'Peça a cada área uma tarefa que já faz com IA, a ferramenta usada e o ganho percebido.' },
  'uso-individual-2': { title: 'Compartilhe maneiras de trabalhar, não só prompts.', text: 'Registre o objetivo, as informações, as instruções e o critério de revisão de cada boa prática.' },
  'uso-individual-3': { title: 'Quinze minutos a cada duas semanas multiplicam o que funciona.', text: 'Uma pessoa mostra uma aplicação real; os colegas perguntam e adaptam.' },
  'pouca-aplicacao-1': { title: 'Comece pelas atividades, não pelas ferramentas.', text: 'Escolha três tarefas recorrentes e compare esforço, qualidade e risco antes de decidir por onde começar.' },
  'pouca-aplicacao-2': { title: 'Uma demonstração convence. Uma comparação ensina.', text: 'Faça a mesma tarefa com e sem IA e compare tempo, qualidade e esforço de revisão.' },
  'pouca-aplicacao-3': { title: 'Transforme o aprendizado em uma entrega real.', text: 'Cada pessoa escolhe uma tarefa da rotina, faz com IA, revisa e compartilha o que aprendeu.' },
  'seguranca-1': { title: 'Regra clara ajuda a equipe a usar mais, com segurança.', text: 'Defina com TI, Jurídico, RH e as áreas de negócio o que pode, o que não pode e quem revisa.' },
  'seguranca-2': { title: 'Três perguntas antes de enviar qualquer informação à IA.', text: 'A ferramenta é aprovada? Posso compartilhar isso? Sei conferir a resposta?' },
  'seguranca-3': { title: 'Treine com situações reais, sem expor dados reais.', text: 'Use contratos e relatórios fictícios para praticar o que pode ir para a IA.' },
  'direcionamento-1': { title: 'O primeiro projeto não precisa ser o mais impressionante.', text: 'Escolha uma tarefa frequente, com entrada e saída claras e risco baixo.' },
  'direcionamento-2': { title: 'Comece pelo resultado que você quer em 30 dias.', text: 'Pergunte o que a equipe deveria fazer melhor daqui a um mês e defina como perceber a evolução.' },
  'direcionamento-3': { title: 'Não comece por toda a empresa. Comece por um piloto.', text: 'Um grupo, duas atividades e um período, acompanhando adoção, qualidade e tempo.' },
};

/** Transição da Tela 01 para a 02 (v1.6, §3.6, literal). */
export const TIP_TRANSITION = 'Entendi! Agora quero conhecer um pouco melhor como a IA faz parte do dia a dia da sua equipe.';

export const CHALLENGE_ICON: Record<ChallengeId, SolarName> = {
  'uso-individual': 'users-group-rounded',
  'pouca-aplicacao': 'widget-4',
  seguranca: 'shield-warning',
  direcionamento: 'compass',
};

export const MIRROR_REACTION = {
  /** P01 = "Não sei": não é nota baixa (§4.6, regra especial). */
  unknownPeople: 'Tudo bem não saber. Isso vira uma descoberta a fazer, não uma nota baixa.',
};

export const CAPABILITY_ICON: Record<CapabilityId, SolarName> = {
  sistemas: 'server-square',
  agendadas: 'alarm',
  arquivos: 'folder-with-files',
  entregas: 'presentation-graph',
};

export const capabilitiesReaction = (n: number) =>
  n ? 'Anotado. Vou usar essas possibilidades para sugerir por onde começar.'
    : 'Sem problema. As quatro possibilidades continuam no vídeo para rever.';

export const GOAL_ICON: Record<GoalId, SolarName> = {
  esforco: 'bolt',
  qualidade: 'medal-star',
  analise: 'chart-2',
  'uso-seguro': 'shield-check',
  compartilhar: 'share',
};

export const GROUP_ICON: Record<GroupSize, SolarName> = {
  'ate-10': 'user',
  '11-25': 'users-group-two-rounded',
  '26-50': 'users-group-rounded',
  'mais-50': 'buildings-2',
};

export const TOOL_ICON: Record<ToolEnv, SolarName> = {
  copilot: 'widget-4',
  claude: 'star-shine',
  gemini: 'bolt',
  chatgpt: 'presentation-graph',
  outros: 'layers',
  avaliando: 'compass',
};

export const INDICATOR_ICON: Record<IndicatorId, SolarName> = {
  autonomia: 'user-check',
  qualidade: 'medal-ribbon',
  aplicacoes: 'checklist-minimalistic',
  seguranca: 'shield-check',
  esforco: 'stopwatch',
};

// ---------------------------------------------------------------- Radar Vivo

/**
 * "Próximo foco" do Radar Vivo, uma frase por etapa (pedido do Thiago depois da
 * v1.6, com a referência do painel). Textos escritos para o site, em revisão.
 */
export const NEXT_FOCUS: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
  1: 'Entender como a equipe usa IA hoje.',
  2: 'Descobrir onde a IA pode gerar mais valor para a equipe.',
  3: 'Escolher o objetivo principal da capacitação.',
  4: 'Escolher o objetivo principal da capacitação.',
  5: 'Definir o grupo inicial, o ambiente e o sinal de sucesso.',
  6: 'Consolidar o seu plano.',
  7: 'Levar o plano para a conversa com a liderança.',
};

/** Rótulos curtos das possibilidades, para o bloco "Interesses no mapa". */
export const CAPABILITY_SHORT: Record<CapabilityId, string> = {
  sistemas: 'Sistemas corporativos',
  agendadas: 'Tarefas programadas',
  arquivos: 'Arquivos locais',
  entregas: 'Entregas profissionais',
};

/** Rótulos curtos dos desafios, para os chips do Radar Vivo. */
export const CHALLENGE_SHORT: Record<ChallengeId, string> = {
  'uso-individual': 'Uso individual',
  'pouca-aplicacao': 'Pouca aplicação',
  seguranca: 'Segurança',
  direcionamento: 'Direção',
};
