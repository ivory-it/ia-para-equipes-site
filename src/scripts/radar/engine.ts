/**
 * Motor de regras do Radar IA. Funções puras, sem DOM: recebem o estado da
 * jornada e devolvem o que cada tela mostra. A Tela 07 e o PDF usam o mesmo
 * `planModel`, então o que aparece na tela é o que vai para o arquivo.
 *
 * Regras do documento v1.4: cenários em `src/data/radar/mirror.ts` (§4.6),
 * deduplicação por id de ação (§9.2), linguagem de hipótese (§9.3).
 *
 * Imports com `.ts` para o `node` rodar a checagem (`scripts/radar-engine-check.ts`).
 */
import { ACTIONS, type ActionId } from '../../data/radar/actions.ts';
import { CHALLENGES, type Challenge, type ChallengeId } from '../../data/radar/challenges.ts';
import { QUESTIONS, type DimensionId, type Letter, type MirrorAnswers, type QualState } from '../../data/radar/mirror.ts';
import {
  PORTRAIT_RULES, PORTRAIT_MATRIX, PORTRAIT_VALUES, PORTRAIT_ATTENTIONS, PORTRAIT_EXTRAS,
  type PortraitRule, type PortraitRuleId, type ValueKind,
} from '../../data/radar/portrait.ts';
import { CAPABILITIES, type CapabilityId } from '../../data/radar/capabilities.ts';
import { GOALS, type GoalId } from '../../data/radar/goals.ts';
import {
  GROUP_SIZES, TOOL_ENVS, INDICATORS, LARGE_GROUP_NOTE, TOOLS_MULTI_NOTE, PREPARATION, TRACK,
  type GroupSize, type ToolEnv, type IndicatorId,
} from '../../data/radar/path.ts';

export type Screen = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * De onde veio uma ação do plano (v1.6, §9.2: o PDF distingue o que o visitante
 * declarou do que o Radar sugere). Nada é salvo à mão: o plano é derivado.
 */
export type ActionSource = 'declarado' | 'sugerido';

export interface RadarState {
  screen: Screen;
  challenges: ChallengeId[];
  /** Pílula usada como dica curta da Tela 01. Sorteada uma vez (v1.6, §9.2). */
  tipPill: string | null;
  mirror: MirrorAnswers;
  capabilities: CapabilityId[];
  videoStarted: boolean;
  goal?: GoalId;
  group?: GroupSize;
  /** Ambientes de IA (múltipla escolha). */
  tools: ToolEnv[];
  indicator?: IndicatorId;
  company: string;
  /** Contato pedido no chat antes do PDF. Só em memória, como o resto. */
  contact: Contact;
  /** Token de acesso válido: pula as perguntas de contato e o envio do lead. */
  directPdf: boolean;
}

export interface Contact { nome: string; cargo: string; email: string; whatsapp: string }

export const initialState: RadarState = {
  screen: 1,
  challenges: [],
  tipPill: null,
  mirror: {},
  capabilities: [],
  videoStarted: false,
  tools: [],
  company: '',
  contact: { nome: '', cargo: '', email: '', whatsapp: '' },
  directPdf: false,
};

// ---------------------------------------------------------------- Tela 01

/**
 * Dica da Tela 01: uma pílula sorteada entre os desafios marcados. Fica estável
 * na sessão; só muda se a atual deixar de pertencer aos desafios marcados.
 */
export function pickTip(challenges: ChallengeId[], current: string | null, rand: () => number = Math.random): string | null {
  const pool = CHALLENGES.filter((c) => challenges.includes(c.id)).flatMap((c) => c.pills.map((p) => p.id));
  if (!pool.length) return null;
  if (current && pool.includes(current)) return current;
  return pool[Math.floor(rand() * pool.length)] ?? pool[0]!;
}

export const tipChallenge = (pillId: string | null) =>
  pillId ? CHALLENGES.find((c) => c.pills.some((p) => p.id === pillId)) ?? null : null;

// ---------------------------------------------------------------- Tela 02

export const isMirrorComplete = (m: MirrorAnswers): m is Record<DimensionId, Letter> =>
  QUESTIONS.every((q) => m[q.id] !== undefined);

export interface DimensionResult {
  id: DimensionId;
  dimension: string;
  state: QualState;
  summary: string;
  letter: Letter;
}

export function portrait(m: Record<DimensionId, Letter>): DimensionResult[] {
  return QUESTIONS.map((q) => {
    const option = q.options.find((o) => o.letter === m[q.id])!;
    return { id: q.id, dimension: q.dimension, state: option.state, summary: option.summary, letter: option.letter };
  });
}

/**
 * Retrato consultivo (matriz revisada pelo Thiago, 11/11/2026): cada uma das 256
 * combinações aponta para uma das 22 regras e traz o bloco de valor, a nota de
 * atenção e duas ações complementares. Os textos vêm de `portrait.ts`, gerado da
 * planilha por `scripts/radar-import-retrato.py`.
 */
export interface MirrorResult {
  portrait: DimensionResult[];
  rule: PortraitRule & { id: PortraitRuleId };
  /** "O que já existe a favor" ou, sem ponto favorável comprovado, "O que ainda precisamos descobrir". */
  value: { kind: ValueKind; title: string; text: string };
  attention: string;
  /** Duas ações complementares, só no PDF. */
  extras: [string, string];
  /** Pessoas = D ("Não sei"): falta visibilidade, não competência. */
  unknownPeople: boolean;
}

export const VALUE_TITLE: Record<ValueKind, string> = {
  favor: 'O que já existe a favor',
  descobrir: 'O que ainda precisamos descobrir',
};

export const mirrorCode = (m: Record<DimensionId, Letter>) => `${m.pessoas}${m.processos}${m.seguranca}${m.disseminacao}`;

export function mirrorResult(m: Record<DimensionId, Letter>): MirrorResult {
  const [ruleId, kind, value, attention, e1, e2] = PORTRAIT_MATRIX[mirrorCode(m)]!;
  return {
    portrait: portrait(m),
    rule: { id: ruleId, ...PORTRAIT_RULES[ruleId] },
    value: { kind, title: VALUE_TITLE[kind], text: PORTRAIT_VALUES[value]! },
    attention: PORTRAIT_ATTENTIONS[attention]!,
    extras: [PORTRAIT_EXTRAS[e1]!, PORTRAIT_EXTRAS[e2]!],
    unknownPeople: m.pessoas === 'D',
  };
}

// ---------------------------------------------------------------- Tela 05

export function suggestedInitiative(goal: GoalId, capabilities: CapabilityId[]): string {
  const g = GOALS.find((x) => x.id === goal)!;
  const cap = CAPABILITIES.find((c) => capabilities.includes(c.id));
  return cap ? `${g.initiative} ${cap.experiment}.` : g.initiativeFallback;
}

export function recommendation(state: Pick<RadarState, 'goal' | 'capabilities' | 'challenges'>) {
  if (!state.goal) return null;
  const goal = GOALS.find((g) => g.id === state.goal)!;
  const suggested = suggestedInitiative(goal.id, state.capabilities);
  return {
    goal,
    text: goal.recommendation,
    suggested,
    initiative: suggested,
  };
}

// ---------------------------------------------------------------- Tela 06

export function scenarioCard(state: RadarState) {
  const rec = recommendation(state);
  const group = GROUP_SIZES.find((g) => g.id === state.group);
  const tools = TOOL_ENVS.filter((t) => state.tools.includes(t.id));
  const indicator = INDICATORS.find((i) => i.id === state.indicator);
  return {
    goal: rec?.goal.label,
    initiative: rec?.initiative,
    group: group?.label,
    largeGroupNote: state.group === 'mais-50' ? LARGE_GROUP_NOTE : undefined,
    tools: tools.length ? tools.map((t) => t.label).join(', ') : undefined,
    toolsNote: tools.length === 1 ? tools[0]!.note : tools.length ? TOOLS_MULTI_NOTE : undefined,
    candidates: rec?.goal.candidates ?? [],
    indicator: indicator?.label,
    preparation: PREPARATION,
  };
}

export const isPathComplete = (s: RadarState) => Boolean(s.group && s.tools.length && s.indicator);

// ---------------------------------------------------------------- plano

/** Ids do retrato no plano: o próximo passo e as duas ações complementares. */
export type PortraitActionId = 'retrato-passo' | 'retrato-extra-1' | 'retrato-extra-2';
export interface PlanAction { id: ActionId | PortraitActionId; text: string; source: ActionSource; why?: string }

/**
 * Ações do plano, derivadas das respostas e sem duplicar por ID (v1.6, §9.2):
 * as três pílulas de cada desafio marcado (declarado), depois o próximo passo e
 * as duas ações complementares do retrato e a do objetivo (sugerido).
 */
export function derivedActions(state: RadarState): PlanAction[] {
  const out = new Map<PlanAction['id'], PlanAction>();
  const add = (id: ActionId, source: ActionSource, why?: string) => {
    if (!out.has(id)) out.set(id, { id, text: ACTIONS[id], source, why });
  };
  for (const c of CHALLENGES.filter((x) => state.challenges.includes(x.id))) {
    for (const p of c.pills) add(p.action, 'declarado', c.label);
  }
  if (isMirrorComplete(state.mirror)) {
    // Retrato consultivo: o próximo passo e as duas ações complementares.
    const r = mirrorResult(state.mirror);
    const why = r.rule.insight;
    out.set('retrato-passo', { id: 'retrato-passo', text: r.rule.step, source: 'sugerido', why });
    out.set('retrato-extra-1', { id: 'retrato-extra-1', text: r.extras[0], source: 'sugerido', why });
    out.set('retrato-extra-2', { id: 'retrato-extra-2', text: r.extras[1], source: 'sugerido', why });
  }
  const rec = recommendation(state);
  if (rec) add(rec.goal.action, 'sugerido', rec.goal.label);
  return [...out.values()];
}

export interface PlanModel {
  org: string;
  challenges: { id: ChallengeId; label: string; text: string }[];
  actions: PlanAction[];
  /** Apêndice do PDF: as três pílulas de cada desafio marcado, com texto integral. */
  appendix: { id: ChallengeId; label: string; pills: Challenge['pills'] }[];
  mirror: MirrorResult | null;
  capabilities: { id: CapabilityId; label: string; example: string; caveat: string; chapterStart: number }[];
  goal: { label: string; recommendation: string; initiative: string; competencies: string[] } | null;
  scenario: ReturnType<typeof scenarioCard>;
  track: typeof TRACK;
  /** Quem pediu o PDF (capa): nome e cargo informados no chat. Vazio com o token. */
  contact: { nome: string; cargo: string };
}

const stripDot = (s: string) => s.replace(/\.$/, '');

export function planModel(state: RadarState): PlanModel {
  const challenges = CHALLENGES.filter((c) => state.challenges.includes(c.id)).map(({ id, label, text }) => ({ id, label, text }));
  const actions = derivedActions(state);
  const appendix = CHALLENGES.filter((c) => state.challenges.includes(c.id)).map(({ id, label, pills }) => ({ id, label, pills }));
  const mirror = isMirrorComplete(state.mirror) ? mirrorResult(state.mirror) : null;
  const capabilities = CAPABILITIES.filter((c) => state.capabilities.includes(c.id))
    .map(({ id, label, example, caveat, chapterStart }) => ({ id, label, example, caveat, chapterStart }));
  const rec = recommendation(state);
  const goal = rec
    ? { label: rec.goal.label, recommendation: rec.text, initiative: rec.initiative, competencies: rec.goal.competencies }
    : null;

  return {
    org: state.company.trim() || '',
    challenges,
    actions,
    appendix,
    mirror,
    capabilities,
    goal,
    scenario: scenarioCard(state),
    track: TRACK,
    contact: { nome: state.contact.nome, cargo: state.contact.cargo },
  };
}

// ---------------------------------------------------------------- lead

/**
 * Respostas da jornada para o receptor de leads (pedido do Thiago, 11/11/2026:
 * o backend aceita campos novos). Só vai o que foi respondido. `funcionarios`
 * e `ferramentas` usam os nomes que o formulário da home já manda, porque o
 * formulário do Radar não pergunta mais esses dois.
 */
export function leadFields(state: RadarState): Record<string, string> {
  const labels = <T extends { id: string; label: string }>(list: T[], ids: string[]) =>
    list.filter((x) => ids.includes(x.id)).map((x) => x.label);
  const fields: Record<string, string> = {
    funcionarios: GROUP_SIZES.find((g) => g.id === state.group)?.label ?? '',
    ferramentas: labels(TOOL_ENVS, state.tools).join(', '),
    radar_desafios: labels(CHALLENGES, state.challenges).join('; '),
    radar_possibilidades: labels(CAPABILITIES, state.capabilities).join('; '),
    radar_objetivo: stripDot(GOALS.find((g) => g.id === state.goal)?.label ?? ''),
    radar_indicador: stripDot(INDICATORS.find((i) => i.id === state.indicator)?.label ?? ''),
  };
  for (const q of QUESTIONS) {
    const o = q.options.find((x) => x.letter === state.mirror[q.id]);
    if (o) fields[`radar_${q.id}`] = `${o.state}: ${o.text}`;
  }
  if (isMirrorComplete(state.mirror)) {
    const r = mirrorResult(state.mirror);
    fields.radar_codigo = mirrorCode(state.mirror);
    fields.radar_regra = r.rule.id;
    fields.radar_descoberta = r.rule.insight;
  }
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
}

/** Normaliza o nome da empresa para o nome do arquivo. */
export function pdfFileName(base: string, org: string): string {
  const slug = org
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `${base}${slug ? `_${slug}` : ''}.pdf`;
}
