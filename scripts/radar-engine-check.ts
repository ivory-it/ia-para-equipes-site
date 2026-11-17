/**
 * Checagem do motor de regras do Radar IA.
 *
 *   node scripts/radar-engine-check.ts
 *
 * Cobre o retrato consultivo (as 256 combinações contra a matriz revisada, os
 * exemplos validados e o "Não sei" em Pessoas), o plano derivado sem ações
 * repetidas, os campos do lead, o contato pedido no chat, a dica, o nome do
 * PDF.
 */
import assert from 'node:assert/strict';
import {
  mirrorResult, planModel, initialState, suggestedInitiative, pdfFileName, derivedActions, pickTip, tipChallenge,
  leadFields, isPathComplete,
  type RadarState,
} from '../src/scripts/radar/engine.ts';
import { emailError, isLocalHost, maskPhone, phoneError } from '../src/scripts/lead-api.ts';
import { answer, getStep } from '../src/components/radar/chat/script.ts';

let passed = 0;
const test = (name: string, fn: () => void) => {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
};

const L = ['A', 'B', 'C', 'D'] as const;
const all = () => L.flatMap((p) => L.flatMap((m) => L.flatMap((s) => L.map((k) => ({ pessoas: p, processos: m, seguranca: s, disseminacao: k })))));

test('retrato: as 256 combinações resolvem para uma das 22 regras, na contagem da planilha', () => {
  const count: Record<string, number> = {};
  for (const m of all()) {
    const r = mirrorResult(m);
    assert.ok(r.rule.insight && r.rule.why && r.rule.step && r.rule.deliverable && r.value.text && r.attention);
    assert.equal(r.extras.length, 2);
    count[r.rule.id] = (count[r.rule.id] ?? 0) + 1;
  }
  assert.equal(Object.keys(count).length, 22);
  for (const [id, n] of Object.entries(count)) assert.equal(n, /^[GVN][1-4]$/.test(id) && !/^N[12]$/.test(id) ? 16 : 8, id);
});

test('retrato: exemplos validados na planilha', () => {
  const r = (code: string) => mirrorResult({ pessoas: code[0], processos: code[1], seguranca: code[2], disseminacao: code[3] } as never);
  assert.equal(r('ABBB').rule.id, 'B2');
  assert.equal(r('ABBB').rule.insight, 'Há ideias de uso, mas falta definir com qual ferramenta e com quais dados testá-las.');
  assert.equal(r('AAAA').rule.id, 'B1');
  assert.equal(r('AAAA').value.kind, 'descobrir');
  assert.equal(r('AAAA').value.title, 'O que ainda precisamos descobrir');
  assert.equal(r('CCCC').rule.id, 'E1');
  assert.equal(r('DDDD').rule.id, 'N2');
  assert.equal(r('ACAA').rule.id, 'G2');
});

test('retrato: "Não sei" em Pessoas nunca some (64 combinações)', () => {
  const unknown = all().filter((m) => m.pessoas === 'D').map((m) => mirrorResult(m));
  assert.equal(unknown.length, 64);
  for (const r of unknown) {
    assert.ok(r.unknownPeople);
    assert.equal(r.portrait[0]!.state, 'Não identificado');
    // Fora das regras de visibilidade (N), a atenção avisa que falta visibilidade.
    if (!r.rule.id.startsWith('N')) assert.match(r.attention, /Não se sabe como a equipe usa IA/);
  }
});

test('plano derivado: 4 desafios geram 12 recomendações no apêndice', () => {
  const state: RadarState = { ...initialState, challenges: ['uso-individual', 'pouca-aplicacao', 'seguranca', 'direcionamento'] };
  const plan = planModel(state);
  assert.equal(plan.appendix.length, 4);
  assert.equal(plan.appendix.flatMap((c) => c.pills).length, 12);
  assert.equal(plan.actions.length, 12);
  assert.ok(plan.actions.every((a) => a.source === 'declarado'));
});

test('plano derivado: retrato entra com o próximo passo e duas ações, sem duplicar', () => {
  const state: RadarState = {
    ...initialState,
    challenges: ['seguranca'],
    mirror: { pessoas: 'A', processos: 'B', seguranca: 'B', disseminacao: 'B' },
    goal: 'uso-seguro',
  };
  const actions = derivedActions(state);
  const ids = actions.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(actions.find((a) => a.id === 'politica-uso-ia')!.source, 'declarado');
  const passo = actions.find((a) => a.id === 'retrato-passo')!;
  assert.equal(passo.source, 'sugerido');
  assert.match(passo.text, /Com TI e um gestor/);
  assert.ok(ids.includes('retrato-extra-1') && ids.includes('retrato-extra-2'));
});

test('lead: respostas da jornada viram campos, sem campo vazio', () => {
  assert.deepEqual(leadFields(initialState), {});
  const state: RadarState = {
    ...initialState,
    challenges: ['uso-individual', 'seguranca'],
    mirror: { pessoas: 'A', processos: 'B', seguranca: 'B', disseminacao: 'B' },
    capabilities: ['sistemas'],
    goal: 'esforco',
    group: '26-50',
    tools: ['gemini', 'chatgpt'],
    indicator: 'aplicacoes',
  };
  assert.ok(isPathComplete(state));
  const f = leadFields(state);
  assert.equal(f.funcionarios, '26 a 50 colaboradores');
  assert.equal(f.ferramentas, 'Gemini, ChatGPT');
  assert.equal(f.radar_codigo, 'ABBB');
  assert.equal(f.radar_regra, 'B2');
  assert.match(f.radar_pessoas!, /^Primeiros passos: /);
  assert.ok(f.radar_desafios && f.radar_possibilidades && f.radar_objetivo && f.radar_indicador && f.radar_descoberta);
  assert.ok(Object.values(f).every((v) => v.trim()));
  assert.equal(planModel(state).scenario.tools, 'Gemini, ChatGPT');
});

test('contato no chat: validação de e-mail e WhatsApp', () => {
  assert.equal(emailError('ana@gmail.com'), 'Use seu e-mail corporativo.');
  assert.ok(emailError('ana@empresa'));
  assert.equal(emailError('ana@empresa.com.br'), null);
  assert.equal(maskPhone('31999998888'), '(31) 99999-8888');
  assert.equal(maskPhone('3133334444'), '(31) 3333-4444');
  assert.ok(phoneError('(31) 9999'));
  assert.equal(phoneError('(31) 99999-8888'), null);
  // PDF sem lead só em ambiente local (CORS); em produção, nunca.
  assert.ok(isLocalHost('localhost') && isLocalHost('127.0.0.1'));
  assert.ok(!isLocalHost('iaparaequipes.com.br') && !isLocalHost('ia-para-equipes.vercel.app'));
});

test('contato no chat: roteiro pula com o token e "Outro" pede o cargo', () => {
  const direct: RadarState = { ...initialState, directPdf: true };
  assert.equal(getStep('cenario').reply(direct).kind, 'none');
  assert.equal(getStep('cenario').reply(initialState).kind, 'text');
  assert.equal(answer('cenario', 'Ana Souza', initialState).next, 'contato-cargo');
  assert.equal(answer('contato-cargo', 'outro', initialState).next, 'contato-cargo-outro');
  assert.equal(answer('contato-cargo', 'rh', initialState).next, 'contato-email');
  const zap = answer('contato-whatsapp', '31999998888', initialState);
  assert.equal(zap.text, '(31) 99999-8888');
  assert.equal(zap.next, 'entrega');
});

test('dica: só de desafio marcado e estável', () => {
  const tip = pickTip(['pouca-aplicacao'], null, () => 0.99);
  assert.equal(tipChallenge(tip)!.id, 'pouca-aplicacao');
  assert.equal(pickTip(['pouca-aplicacao', 'seguranca'], tip, () => 0), tip);
  const moved = pickTip(['seguranca'], tip, () => 0);
  assert.equal(tipChallenge(moved)!.id, 'seguranca');
  assert.equal(pickTip([], tip), null);
});

test('iniciativa combina objetivo e capacidade', () => {
  const t = suggestedInitiative('esforco', ['sistemas']);
  assert.match(t, /sem pressupor que a integração já existe/);
  assert.equal(suggestedInitiative('esforco', []), 'Escolher uma tarefa recorrente da equipe e comparar a execução com e sem IA.');
});

test('planModel sem respostas não quebra', () => {
  const p = planModel(initialState);
  assert.equal(p.mirror, null);
  assert.equal(p.goal, null);
});

test('nome do arquivo normalizado', () => {
  assert.equal(pdfFileName('Plano_de_Evolucao_IA', ''), 'Plano_de_Evolucao_IA.pdf');
  assert.equal(pdfFileName('Plano_de_Evolucao_IA', 'Ação & Cia. Ltda'), 'Plano_de_Evolucao_IA_Acao_Cia_Ltda.pdf');
});

console.log(`\n${passed} verificações passaram.`);
