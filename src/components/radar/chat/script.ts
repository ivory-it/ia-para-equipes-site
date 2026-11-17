/**
 * Roteiro do Radar IA (documento v1.6, "conversa guiada progressiva"). Fixo,
 * sem modelo de linguagem. Cada passo segue o padrão da v1.6:
 *
 *   pergunta curta → opções → Radar reage na hora → confirmação ou dica breve
 *   → próxima pergunta.
 *
 * - `ia`: o que o Radar diz ao abrir o passo (uma fala por função);
 * - `reply`: as opções; resposta única avança sozinha, a múltipla tem um único
 *   "Continuar";
 * - `answer()`: aplica a escolha e devolve o resumo do visitante, o que o Radar
 *   responde em seguida (`after`) e o próximo passo.
 *
 * Nada é salvo à mão: o plano é derivado das respostas (`engine.ts`).
 */
import { CHALLENGES, CHALLENGES_INTRO } from '../../../data/radar/challenges.ts';
import { QUESTIONS, MIRROR_INTRO, type DimensionId, type Letter } from '../../../data/radar/mirror.ts';
import { CAPABILITIES, VIDEO_SCREEN } from '../../../data/radar/capabilities.ts';
import { GOALS, GOALS_INTRO, type GoalId } from '../../../data/radar/goals.ts';
import {
  GROUP_SIZES, TOOL_ENVS, INDICATORS, PATH_INTRO, QUESTIONS_06,
  type GroupSize, type IndicatorId,
} from '../../../data/radar/path.ts';
import {
  CHALLENGE_ICON, TIP_TRANSITION, MIRROR_REACTION, CAPABILITY_ICON, capabilitiesReaction,
  GOAL_ICON, GROUP_ICON, TOOL_ICON, INDICATOR_ICON,
} from '../../../data/radar/reactions.ts';
import { mirrorResult, isMirrorComplete, type RadarState, type Screen } from '../../../scripts/radar/engine.ts';
import { CONTACT, ROLES, firstName } from '../../../data/radar/contact.ts';
import { TOOL_LOGO, type Logo } from '../../../data/radar/tool-logos.ts';
import { emailError, maskPhone, phoneError } from '../../../scripts/lead-api.ts';
import type { SolarName } from '../icons';
import type { RadarAction } from '../state';

export type StepId =
  | 'desafios'
  | `espelho-${DimensionId}` | 'retrato'
  | 'video' | 'possibilidades'
  | 'objetivo'
  | 'grupo' | 'ferramentas' | 'indicador' | 'cenario'
  | 'contato-cargo' | 'contato-cargo-outro' | 'contato-email' | 'contato-whatsapp' | 'entrega';

/** Uma fala do Radar: selo opcional, título forte e texto curto, num bloco só. */
export interface Say { type: 'say'; eyebrow?: string; title?: string; text?: string }

/** O que o Radar mostra. `say` vira mensagem; o resto, composições fora do balão. */
export type Block =
  | Say
  | { type: 'tip' }
  | { type: 'portrait' }
  | { type: 'video' }
  | { type: 'scenario' };

/** `logo`: marca da ferramenta em SVG monocromático (vence o `icon`). */
export interface Option { id: string; label: string; desc?: string; icon?: SolarName; logo?: Logo; letter?: string }

/** Campo de texto no compositor (só nas perguntas de contato). */
export interface TextReply {
  kind: 'text';
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel';
  autoComplete: string;
  /** Mensagem de erro, ou null quando o valor serve. */
  validate: (value: string) => string | null;
  /** Formata enquanto digita (máscara do WhatsApp). */
  mask?: (value: string) => string;
}

export type Reply =
  | { kind: 'single'; options: Option[] }
  | TextReply
  | { kind: 'continue'; label: string }
  | { kind: 'multi'; options: Option[]; selected: string[]; submit: string; empty?: string }
  | { kind: 'none' };

export interface Step {
  id: StepId;
  screen: Screen;
  label: string;
  ia: (s: RadarState) => Block[];
  reply: (s: RadarState) => Reply;
}

export interface Answer {
  actions: RadarAction[];
  /** Resumo da escolha, no balão do visitante. Vazio = sem balão (só avançar). */
  text: string;
  /** O que o Radar responde logo depois (dica, confirmação). */
  after?: Block[];
  next: StepId;
}

const MIRROR_IDS = QUESTIONS.map((q) => q.id);
const say = (o: Omit<Say, 'type'>): Say => ({ type: 'say', ...o });

export function getStep(id: StepId): Step {
  if (id.startsWith('espelho-')) {
    const dim = id.slice('espelho-'.length) as DimensionId;
    const i = MIRROR_IDS.indexOf(dim);
    const q = QUESTIONS[i]!;
    return {
      id, screen: 2, label: 'Retrato',
      // Só o tema no selo: a régua do cabeçalho já mostra o avanço (sem "1 de 4").
      ia: () => [say({ eyebrow: q.dimension, title: q.prompt })],
      reply: () => ({ kind: 'single', options: q.options.map((o) => ({ id: o.letter, letter: o.letter, label: o.text })) }),
    };
  }

  switch (id) {
    case 'desafios':
      return {
        id, screen: 1, label: 'Meus desafios',
        // Abre direto na pergunta (17/11/2026, pedido do Thiago: a frase do
        // combinado, "São 5 etapas rápidas…", saiu).
        ia: () => [say({ title: CHALLENGES_INTRO.title, text: CHALLENGES_INTRO.hint })],
        reply: (s) => ({
          kind: 'multi',
          options: CHALLENGES.map((c) => ({ id: c.id, label: c.label, desc: c.text, icon: CHALLENGE_ICON[c.id] })),
          selected: s.challenges,
          submit: 'Continuar',
        }),
      };
    case 'retrato':
      return {
        id, screen: 2, label: 'Retrato',
        ia: () => [say({ text: 'Pronto. Este é o retrato da empresa, a partir das suas respostas.' }), { type: 'portrait' }],
        reply: () => ({ kind: 'continue', label: MIRROR_INTRO.next }),
      };
    case 'video':
      return {
        id, screen: 4, label: 'Possibilidades',
        // Primeiro o vídeo, com o compositor só com "Continuar": assim o vídeo
        // cabe inteiro na tela. A pergunta vem no passo seguinte, depois de assistir.
        ia: () => [say({ title: VIDEO_SCREEN.title, text: VIDEO_SCREEN.intro }), { type: 'video' }],
        reply: () => ({ kind: 'continue', label: 'Continuar' }),
      };
    case 'possibilidades':
      return {
        id, screen: 4, label: 'Possibilidades',
        ia: () => [say({ title: VIDEO_SCREEN.question, text: 'Pode marcar mais de uma opção.' })],
        reply: (s) => ({
          kind: 'multi',
          options: CAPABILITIES.map((c) => ({ id: c.id, label: c.label, desc: c.option, icon: CAPABILITY_ICON[c.id] })),
          selected: s.capabilities,
          submit: 'Continuar',
          empty: 'Continuar sem escolher',
        }),
      };
    case 'objetivo':
      return {
        id, screen: 5, label: 'Objetivo',
        ia: () => [say({ title: GOALS_INTRO.title, text: `${GOALS_INTRO.question} Escolha uma prioridade.` })],
        reply: () => ({ kind: 'single', options: GOALS.map((g) => ({ id: g.id, label: g.label, icon: GOAL_ICON[g.id] })) }),
      };
    case 'grupo':
      return {
        id, screen: 6, label: 'Caminho',
        ia: () => [say({ title: PATH_INTRO.title, text: QUESTIONS_06.group })],
        reply: () => ({ kind: 'single', options: GROUP_SIZES.map((g) => ({ id: g.id, label: g.label, icon: GROUP_ICON[g.id] })) }),
      };
    case 'ferramentas':
      return {
        id, screen: 6, label: 'Caminho',
        ia: () => [say({ title: QUESTIONS_06.tools, text: 'Pode marcar mais de uma opção.' })],
        reply: (s) => ({
          kind: 'multi',
          options: TOOL_ENVS.map((t) => ({ id: t.id, label: t.label, icon: TOOL_ICON[t.id], logo: TOOL_LOGO[t.id] })),
          selected: s.tools,
          submit: 'Continuar',
        }),
      };
    case 'indicador':
      return {
        id, screen: 6, label: 'Caminho',
        ia: () => [say({ title: QUESTIONS_06.indicator })],
        reply: () => ({ kind: 'single', options: INDICATORS.map((i) => ({ id: i.id, label: i.label, icon: INDICATOR_ICON[i.id] })) }),
      };
    case 'cenario':
      return {
        id, screen: 6, label: 'Caminho',
        // Sem a Tela 07: com o token de acesso, o compositor já oferece o PDF;
        // sem ele, o Radar emenda a primeira pergunta de contato, sem clique extra.
        ia: (s) => [
          say({ text: 'Este é o seu cenário inicial.' }),
          { type: 'scenario' },
          ...(s.directPdf ? [] : [say({ title: CONTACT.nameTitle, text: CONTACT.privacy })]),
        ],
        reply: (s) => (s.directPdf ? { kind: 'none' } : text(CONTACT.namePlaceholder, 'text', 'name', (v) => (v.trim() ? null : CONTACT.nameError))),
      };
    case 'contato-cargo':
      return {
        id, screen: 7, label: 'Seu plano',
        ia: (s) => [say({ title: CONTACT.roleTitle(firstName(s.contact.nome)) })],
        reply: () => ({ kind: 'single', options: ROLES.map((r) => ({ id: r.id, label: r.label })) }),
      };
    case 'contato-cargo-outro':
      return {
        id, screen: 7, label: 'Seu plano',
        ia: () => [say({ title: CONTACT.roleOtherTitle })],
        reply: () => text(CONTACT.roleOtherPlaceholder, 'text', 'organization-title', (v) => (v.trim() ? null : CONTACT.roleError)),
      };
    case 'contato-email':
      return {
        id, screen: 7, label: 'Seu plano',
        ia: () => [say({ title: CONTACT.emailTitle })],
        reply: () => text(CONTACT.emailPlaceholder, 'email', 'email', emailError),
      };
    case 'contato-whatsapp':
      return {
        id, screen: 7, label: 'Seu plano',
        ia: () => [say({ title: CONTACT.phoneTitle })],
        reply: () => ({ ...text(CONTACT.phonePlaceholder, 'tel', 'tel', phoneError), mask: maskPhone }),
      };
    case 'entrega':
      return {
        id, screen: 7, label: 'Seu plano',
        ia: (s) => [say({ text: CONTACT.delivery(firstName(s.contact.nome)) })],
        reply: () => ({ kind: 'none' }),
      };
  }
  throw new Error(`Passo desconhecido: ${id}`);
}

/** Aplica a resposta do visitante e diz para onde a conversa vai. */
export function answer(id: StepId, value: string, s: RadarState): Answer {
  if (id.startsWith('espelho-')) {
    const dim = id.slice('espelho-'.length) as DimensionId;
    const i = MIRROR_IDS.indexOf(dim);
    const letter = value as Letter;
    const last = i === MIRROR_IDS.length - 1;
    return {
      actions: [{ type: 'answer', dimension: dim, letter }],
      text: QUESTIONS[i]!.options.find((o) => o.letter === letter)!.text,
      after: dim === 'pessoas' && letter === 'D' ? [say({ text: MIRROR_REACTION.unknownPeople })] : undefined,
      next: last ? 'retrato' : `espelho-${MIRROR_IDS[i + 1]!}`,
    };
  }

  switch (id) {
    case 'desafios':
      return {
        // A dica é sorteada aqui, uma vez, entre os desafios marcados (v1.6, §9.2).
        actions: [{ type: 'pickTip', rand: Math.random() }],
        text: CHALLENGES.filter((c) => s.challenges.includes(c.id)).map((c) => c.label).join(' · '),
        after: [{ type: 'tip' }, say({ text: TIP_TRANSITION })],
        next: `espelho-${MIRROR_IDS[0]!}`,
      };
    // "Descobrir oportunidades" vai direto para o vídeo (pedido do Thiago: a
    // descoberta em diálogo alongava a conversa).
    case 'retrato':
      return { actions: [], text: '', next: 'video' };
    case 'video':
      return { actions: [], text: '', next: 'possibilidades' };
    case 'possibilidades':
      return {
        actions: [],
        text: s.capabilities.length ? CAPABILITIES.filter((c) => s.capabilities.includes(c.id)).map((c) => c.label).join(' · ') : 'Nenhuma em especial',
        after: [say({ text: capabilitiesReaction(s.capabilities.length) })],
        next: 'objetivo',
      };
    case 'objetivo':
      return { actions: [{ type: 'goal', id: value as GoalId }], text: GOALS.find((g) => g.id === value)!.label, next: 'grupo' };
    case 'grupo':
      return { actions: [{ type: 'group', id: value as GroupSize }], text: GROUP_SIZES.find((g) => g.id === value)!.label, next: 'ferramentas' };
    case 'ferramentas': {
      // Múltipla escolha: as ferramentas já foram marcadas com `toggleTool`. Sem
      // fala depois (pedido do Thiago): a nota fica no cenário e no PDF.
      const chosen = TOOL_ENVS.filter((t) => s.tools.includes(t.id));
      return { actions: [], text: chosen.map((t) => t.label).join(' · '), next: 'indicador' };
    }
    // Contato: o valor digitado (ou o cargo escolhido) vai para o estado.
    case 'cenario':
      return { actions: [{ type: 'contact', field: 'nome', value }], text: value.trim(), next: 'contato-cargo' };
    case 'contato-cargo': {
      if (value === 'outro') return { actions: [], text: 'Outro', next: 'contato-cargo-outro' };
      const role = ROLES.find((r) => r.id === value)!;
      return { actions: [{ type: 'contact', field: 'cargo', value: role.label }], text: role.label, next: 'contato-email' };
    }
    case 'contato-cargo-outro':
      return { actions: [{ type: 'contact', field: 'cargo', value }], text: value.trim(), next: 'contato-email' };
    case 'contato-email':
      return { actions: [{ type: 'contact', field: 'email', value }], text: value.trim(), next: 'contato-whatsapp' };
    case 'contato-whatsapp':
      return { actions: [{ type: 'contact', field: 'whatsapp', value: maskPhone(value) }], text: maskPhone(value), next: 'entrega' };
    case 'indicador':
      return { actions: [{ type: 'indicator', id: value as IndicatorId }], text: INDICATORS.find((i) => i.id === value)!.label, next: 'cenario' };
  }
  throw new Error(`Sem resposta para: ${id}`);
}

/** O retrato só existe com as quatro respostas; garante que o passo não quebre. */
export const mirrorReady = (s: RadarState) => (isMirrorComplete(s.mirror) ? mirrorResult(s.mirror) : null);

export const FIRST_STEP: StepId = 'desafios';

/**
 * Etapas exibidas no cabeçalho. Sem a descoberta (Tela 03) e o fechamento
 * (Tela 07), a conversa tem 5 etapas; as telas internas seguem a numeração do
 * documento, que o painel e o motor usam.
 */
export const TOTAL_STEPS = 5;
export const DISPLAY_STEP: Record<Screen, number> = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 5 };

/** Nomes das 5 etapas, na régua de progresso do cabeçalho. */
export const STEP_NAMES = ['Meus desafios', 'Retrato', 'Possibilidades', 'Objetivo', 'Seu plano'] as const;

/**
 * Quanto da etapa atual já foi feito (0 a 1), para a régua: no retrato enche em
 * quartos; em "Seu plano", pergunta a pergunta até a entrega.
 */
export function progressWithin(id: StepId): number {
  if (id.startsWith('espelho-')) return MIRROR_IDS.indexOf(id.slice('espelho-'.length) as DimensionId) / 4;
  const within: Partial<Record<StepId, number>> = {
    retrato: 1, video: 0.4, possibilidades: 0.8,
    ferramentas: 0.2, indicador: 0.4, cenario: 0.55,
    'contato-cargo': 0.7, 'contato-cargo-outro': 0.75, 'contato-email': 0.8, 'contato-whatsapp': 0.9, entrega: 1,
  };
  return within[id] ?? 0;
}

// Campo de texto do compositor.
function text(placeholder: string, type: TextReply['type'], autoComplete: string, validate: TextReply['validate']): TextReply {
  return { kind: 'text', label: placeholder, placeholder, type, autoComplete, validate };
}

