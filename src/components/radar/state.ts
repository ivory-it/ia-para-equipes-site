/**
 * Estado da jornada do Radar IA. Fica só em memória (sem banco, sem
 * localStorage): recarregar a página apaga as respostas, e a página avisa
 * antes de sair (§8.4 do documento).
 */
import { useReducer } from 'react';
import { initialState, pickTip, type Contact, type RadarState, type Screen } from '../../scripts/radar/engine.ts';
import type { ChallengeId } from '../../data/radar/challenges.ts';
import type { DimensionId, Letter } from '../../data/radar/mirror.ts';
import type { CapabilityId } from '../../data/radar/capabilities.ts';
import type { GoalId } from '../../data/radar/goals.ts';
import type { GroupSize, ToolEnv, IndicatorId } from '../../data/radar/path.ts';

export type RadarAction =
  | { type: 'go'; screen: Screen }
  | { type: 'toggleChallenge'; id: ChallengeId }
  /** Confirma a Tela 01: sorteia a dica uma vez (ou mantém a atual, se ainda vale). */
  | { type: 'pickTip'; rand?: number }
  | { type: 'answer'; dimension: DimensionId; letter: Letter }
  | { type: 'toggleCapability'; id: CapabilityId }
  | { type: 'videoStarted' }
  | { type: 'goal'; id: GoalId }
  | { type: 'group'; id: GroupSize }
  | { type: 'toggleTool'; id: ToolEnv }
  | { type: 'indicator'; id: IndicatorId }
  | { type: 'contact'; field: keyof Contact; value: string }
  | { type: 'access'; direct: boolean };

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function reducer(state: RadarState, action: RadarAction): RadarState {
  switch (action.type) {
    case 'go': return { ...state, screen: action.screen };
    // O plano é derivado das respostas (v1.6): mudar os desafios muda as ações.
    case 'toggleChallenge': return { ...state, challenges: toggle(state.challenges, action.id) };
    case 'pickTip': return { ...state, tipPill: pickTip(state.challenges, state.tipPill, action.rand === undefined ? Math.random : () => action.rand!) };
    case 'answer': return { ...state, mirror: { ...state.mirror, [action.dimension]: action.letter } };
    case 'toggleCapability': return { ...state, capabilities: toggle(state.capabilities, action.id) };
    case 'videoStarted': return { ...state, videoStarted: true };
    case 'goal': return { ...state, goal: action.id };
    case 'group': return { ...state, group: action.id };
    case 'toggleTool': return { ...state, tools: toggle(state.tools, action.id) };
    case 'indicator': return { ...state, indicator: action.id };
    case 'contact': return { ...state, contact: { ...state.contact, [action.field]: action.value.trim().slice(0, 120) } };
    case 'access': return { ...state, directPdf: action.direct };
  }
}

export const useRadar = () => useReducer(reducer, initialState);

export type Dispatch = (action: RadarAction) => void;
