/**
 * Radar Vivo: o mapa que cresce com a conversa (§10.1 do documento, redesenhado
 * a partir da referência do Thiago depois da v1.6). Modelo híbrido:
 *
 * - em cima, um círculo segmentado de traço fino com quatro arcos nomeados
 *   (Pessoas, Processos, Segurança, Disseminação). Cada arco ganha cor e estágio
 *   quando a pergunta da dimensão é respondida. Os rótulos ficam nos cantos, sem
 *   fio-guia;
 * - embaixo, um bloco de texto curto que cresce etapa a etapa: desafios,
 *   leitura atual, interesses, objetivo, caminho e próximo foco.
 *
 * O preenchimento do arco tem quatro degraus fixos, um por estágio qualitativo,
 * sempre com o estágio escrito ao lado. Não há número nem porcentagem, e tudo o
 * que o desenho mostra também está no texto (diverge do "sem área proporcional"
 * do §10.1, por decisão do Thiago; ver AGENTS.md).
 *
 * Turquesa só em preenchimento e traço; texto em navy ou `accent-ink`.
 */
import { useEffect, useId, useRef, useState } from 'react';
import { CHALLENGES, type ChallengeId } from '../../data/radar/challenges.ts';
import { QUESTIONS, type DimensionId, type QualState } from '../../data/radar/mirror.ts';
import { GOALS } from '../../data/radar/goals.ts';
import { GROUP_SIZES, TOOL_ENVS, INDICATORS, PATH_LABEL } from '../../data/radar/path.ts';
import { CHALLENGE_SHORT, CAPABILITY_SHORT, NEXT_FOCUS } from '../../data/radar/reactions.ts';
import { mirrorResult, isMirrorComplete, isPathComplete, type RadarState } from '../../scripts/radar/engine.ts';

const C = 200;
// Traço fino (12 em 400) e vãos visíveis entre os arcos (17/11/2026, pedido do
// Thiago: com traço 30 o anel ficava grosseiro e os arcos quase se encostavam).
const R = 150;
const STROKE = 12;
const SPAN = 39; // meia abertura de cada arco, em graus
const rad = (deg: number) => (deg * Math.PI) / 180;
// Arredondado: servidor e navegador calculam o último dígito de forma diferente,
// e o React acusaria divergência na hidratação.
const round = (n: number) => Math.round(n * 100) / 100;
const at = (r: number, deg: number) => ({ x: round(C + r * Math.cos(rad(deg))), y: round(C + r * Math.sin(rad(deg))) });
const arc = (r: number, from: number, to: number) => {
  const a = at(r, from);
  const b = at(r, to);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`;
};

// Ângulos em graus, sentido horário a partir das 3 h (SVG tem y para baixo).
const DIM: Record<DimensionId, { angle: number; label: string; align: string }> = {
  pessoas: { angle: 225, label: 'Pessoas', align: 'text-left' },
  processos: { angle: 315, label: 'Processos', align: 'text-right' },
  seguranca: { angle: 45, label: 'Segurança', align: 'text-right' },
  disseminacao: { angle: 135, label: 'Disseminação', align: 'text-left' },
};

/** Quatro degraus qualitativos: quanto do arco preenche e com que força. */
const STAGE: Record<Exclude<QualState, 'Não identificado'>, { fill: number; opacity: number }> = {
  'Primeiros passos': { fill: 25, opacity: 0.4 },
  'Em desenvolvimento': { fill: 50, opacity: 0.65 },
  'Em estruturação': { fill: 75, opacity: 0.85 },
  'Mais estruturado': { fill: 100, opacity: 1 },
};

const stripDot = (s: string) => s.replace(/\.$/, '');

/** O que cada bloco do painel mostra, resumido, para saber o que mudou. */
const signature = (s: RadarState): Record<string, string> => ({
  ...Object.fromEntries(QUESTIONS.map((q) => [q.id, s.mirror[q.id] ?? ''])),
  desafios: s.challenges.join(','),
  descoberta: isMirrorComplete(s.mirror) ? '1' : '',
  interesses: s.capabilities.join(','),
  objetivo: s.goal ?? '',
  caminho: [s.group ?? '', s.tools.join(','), s.indicator ?? ''].join('|'),
});

/**
 * Blocos que a última resposta mudou, por ~1,6 s (revisão de clareza, 16/11/2026):
 * sem isso, o painel mudava calado ao lado e a pessoa não ligava a resposta ao
 * retrato. Começa vazio no servidor e no 1º render, sem divergir na hidratação.
 */
function useChanged(state: RadarState, active: boolean): Set<string> {
  const prev = useRef<Record<string, string> | null>(null);
  const [keys, setKeys] = useState<Set<string>>(() => new Set());
  const sig = signature(state);
  const sigKey = JSON.stringify(sig);
  useEffect(() => {
    if (!active) return;
    const before = prev.current;
    prev.current = sig;
    if (!before) return;
    const diff = Object.keys(sig).filter((k) => sig[k] !== before[k]);
    if (!diff.length) return;
    setKeys(new Set(diff));
    const id = window.setTimeout(() => setKeys(new Set()), 1600);
    return () => window.clearTimeout(id);
  }, [sigKey, active]); // eslint-disable-line react-hooks/exhaustive-deps
  return keys;
}
const halo = 'motion-safe:animate-radar-halo [transform-box:fill-box] origin-center opacity-0';

/**
 * `full`: anel com rótulos e o bloco de texto (painel lateral e folha do celular).
 * `mini`: só o anel, sem rótulos (botão do cabeçalho no celular).
 * `portrait`: anel com rótulos, sem texto (cartão do retrato da Tela 02).
 */
export type RadarVariant = 'full' | 'mini' | 'portrait';

/** `highlight`: desafio da dica da Tela 01, destacado enquanto a dica aparece (v1.6, §3.6). */
/** `heading={false}`: sem o título "Sua jornada" (a folha do celular já tem o seu). */
export default function RadarVivo({ state, variant = 'full', highlight = null, heading = true }: { state: RadarState; variant?: RadarVariant; highlight?: ChallengeId | null; heading?: boolean }) {
  const titleId = useId();
  const states = Object.fromEntries(
    QUESTIONS.map((q) => [q.id, q.options.find((o) => o.letter === state.mirror[q.id])?.state]),
  ) as Partial<Record<DimensionId, QualState>>;
  // Sem a Tela 07: o mapa vira síntese quando o caminho está completo.
  const final = state.screen === 7 || isPathComplete(state);
  const center = final ? ['Síntese'] : state.screen >= 2 ? ['Retrato', 'atual'] : ['Sua', 'empresa'];
  const changed = useChanged(state, variant === 'full');

  const ring = (
    <svg viewBox={variant === 'mini' ? '36 36 328 328' : '0 0 400 400'} className="h-full w-full" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Sua jornada: quatro temas do retrato da sua organização. O texto ao lado descreve cada um.</title>
      {QUESTIONS.map((q) => {
        const { angle } = DIM[q.id];
        const st = states[q.id];
        const d = arc(R, angle - SPAN, angle + SPAN);
        const stage = st && st !== 'Não identificado' ? STAGE[st] : null;
        return (
          <g key={q.id}>
            {/* Trilha: cinza antes da resposta, turquesa claro depois. */}
            {/* "Não sei": tracejado de ponta reta (com ponta redonda os traços se fundem). */}
            <path d={d} fill="none" stroke={st ? '#00a88e' : '#0a2540'} strokeOpacity={st ? 0.14 : 0.1} strokeWidth={STROKE}
              strokeLinecap={st === 'Não identificado' ? 'butt' : 'round'}
              strokeDasharray={st === 'Não identificado' ? '5 7' : undefined} className="motion-safe:transition-all motion-safe:duration-700" />
            {stage && (
              <path d={d} pathLength={100} fill="none" stroke="#00a88e" strokeOpacity={stage.opacity} strokeWidth={STROKE} strokeLinecap="round"
                strokeDasharray={`${stage.fill} 100`} className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-700" />
            )}
            {stage && variant !== 'mini' && (
              <circle key={`h-${st}`} cx={at(R, angle).x} cy={at(R, angle).y} r={14} fill="none" stroke="#00a88e" strokeWidth={1.5} className={halo} />
            )}
          </g>
        );
      })}
      <circle cx={C} cy={C} r={84} fill="#0a2540" />
      {/* No mini (botão do celular) o texto ficaria ilegível: só o disco. */}
      {variant !== 'mini' && <text x={C} y={center.length === 1 ? C : C - 15} textAnchor="middle" dominantBaseline="middle" fontSize={center.some((t) => t.length > 8) ? 24 : 30} fontWeight={600} fill="#ffffff" className="font-display">
        {center.map((t, i) => <tspan key={t} x={C} dy={i ? 32 : 0}>{t}</tspan>)}
      </text>}
    </svg>
  );

  if (variant === 'mini') return ring;

  const labelRow = (ids: DimensionId[]) => (
    <div className="flex justify-between gap-3">
      {ids.map((id) => {
        const st = states[id];
        return (
          <p key={id} className={`-mx-1.5 max-w-[52%] rounded-lg px-1.5 py-0.5 text-[13px] leading-[1.15rem] motion-safe:transition-colors motion-safe:duration-700 ${changed.has(id) ? 'bg-accent/[0.14]' : ''} ${DIM[id].align}`}>
            <span className={`block font-display font-semibold ${st ? 'text-ink' : 'text-ink-soft/70'}`}>{DIM[id].label}</span>
            {st && <span className="block font-medium text-accent-ink">{st}</span>}
          </p>
        );
      })}
    </div>
  );

  const labelled = (
    // Rótulos em cima e embaixo do anel, nos cantos, como na referência. Em
    // linhas, e não sobrepostos: em 280 px o estágio quebra em duas linhas.
    <div className="mx-auto w-full max-w-[22rem]">
      {labelRow(['pessoas', 'processos'])}
      {/* No painel o anel é um pouco menor, para o texto caber sem rolagem. */}
      <div className={`mx-auto -my-2 aspect-square ${variant === 'full' ? 'w-[48%]' : 'w-[66%]'}`}>{ring}</div>
      {labelRow(['disseminacao', 'seguranca'])}
    </div>
  );

  if (variant === 'portrait') return <figure className="w-full">{labelled}</figure>;

  // ------------------------------------------------------- bloco de texto
  const challenges = CHALLENGES.filter((c) => state.challenges.includes(c.id));
  const insight = isMirrorComplete(state.mirror) ? mirrorResult(state.mirror).rule.insight : null;
  const goal = GOALS.find((g) => g.id === state.goal);
  // Mesmos rótulos do cartão do cenário e do PDF (um nome por dado).
  const path = [
    state.group && { k: PATH_LABEL.group, v: GROUP_SIZES.find((g) => g.id === state.group)!.label },
    state.tools.length > 0 && { k: PATH_LABEL.tools, v: TOOL_ENVS.filter((t) => state.tools.includes(t.id)).map((t) => t.label).join(', ') },
    state.indicator && { k: PATH_LABEL.indicator, v: stripDot(INDICATORS.find((i) => i.id === state.indicator)!.label) },
  ].filter(Boolean) as { k: string; v: string }[];

  // Cada bloco nasce visível, em cinza, com "A definir": o painel mostra desde
  // o início o que a conversa vai montar. O que a última resposta mudou ganha
  // um fundo turquesa por ~1,6 s, para ligar a resposta ao painel.
  const section = (key: string) =>
    `-mx-2 rounded-xl border-t border-ink/[0.08] px-2 pb-0.5 pt-2 motion-safe:transition-colors motion-safe:duration-700 ${changed.has(key) ? 'bg-accent/[0.1]' : ''}`;
  const title = (filled: boolean) => `font-display text-[15px] font-semibold ${filled ? 'text-ink' : 'text-ink-soft/80'}`;
  const pending = <p className="mt-1 text-ink-soft">A definir</p>;
  const noCapabilities = state.screen >= 5 && state.capabilities.length === 0;

  return (
    <figure className="w-full">
      {heading && <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">Sua jornada</p>}
      {labelled}

      <figcaption className="mt-2.5 space-y-1.5 text-[13px] leading-5 text-ink-2">
        <div className={section('desafios')}>
          <p className={title(challenges.length > 0)}>Desafios identificados</p>
          {challenges.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {challenges.map((c) => (
                <li key={c.id} className={`rounded-full bg-accent/[0.14] px-2.5 py-1 text-xs font-medium text-ink transition-shadow ${highlight === c.id ? 'ring-2 ring-accent' : ''}`}>
                  {CHALLENGE_SHORT[c.id]}
                </li>
              ))}
            </ul>
          ) : pending}
        </div>

        {/* Os rótulos do anel são o único resumo por dimensão (sem "Leitura atual"
            repetindo os estágios, regra da matriz revisada). */}
        <div className={section('descoberta')}>
          <p className={title(Boolean(insight))}>Principal descoberta</p>
          {insight ? <p className="mt-1">{insight}</p> : <p className="mt-1 text-ink-soft">Sai das 4 perguntas do retrato</p>}
        </div>

        <div className={section('interesses')}>
          <p className={title(state.capabilities.length > 0)}>Interesses no mapa</p>
          {state.capabilities.length > 0
            ? <p className="mt-1">{state.capabilities.map((id) => CAPABILITY_SHORT[id]).join(' · ')}</p>
            : noCapabilities ? <p className="mt-1 text-ink-soft">Nenhum em especial</p> : pending}
        </div>

        <div className={section('objetivo')}>
          <p className={title(Boolean(goal))}>Objetivo</p>
          {goal ? <p className="mt-1">{stripDot(goal.label)}</p> : pending}
        </div>

        <div className={section('caminho')}>
          <p className={title(path.length > 0)}>Caminho inicial</p>
          {path.length > 0 ? (
            <ul className="mt-1.5 space-y-1">
              {path.map((p) => <li key={p.k}><span className="font-semibold text-ink">{p.k}:</span> {p.v}</li>)}
            </ul>
          ) : pending}
        </div>

        <div className={section('foco')}>
          <p className={title(true)}>Próximo foco</p>
          <p className="mt-1">{NEXT_FOCUS[final ? 7 : state.screen]}</p>
        </div>

      </figcaption>
    </figure>
  );
}
