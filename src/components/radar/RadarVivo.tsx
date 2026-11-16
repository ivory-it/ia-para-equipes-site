/**
 * Radar Vivo: o mapa que cresce com a conversa (§10.1 do documento, redesenhado
 * a partir da referência do Thiago depois da v1.6). Modelo híbrido:
 *
 * - em cima, um círculo segmentado com quatro arcos nomeados (Pessoas,
 *   Processos, Segurança, Disseminação). Cada arco ganha cor e estágio quando a
 *   pergunta da dimensão é respondida;
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
import { useId } from 'react';
import { CHALLENGES, type ChallengeId } from '../../data/radar/challenges.ts';
import { QUESTIONS, type DimensionId, type QualState } from '../../data/radar/mirror.ts';
import { GOALS } from '../../data/radar/goals.ts';
import { GROUP_SIZES, TOOL_ENVS, INDICATORS } from '../../data/radar/path.ts';
import { CHALLENGE_SHORT, CAPABILITY_SHORT, NEXT_FOCUS } from '../../data/radar/reactions.ts';
import { mirrorResult, isMirrorComplete, isPathComplete, type RadarState } from '../../scripts/radar/engine.ts';

const C = 200;
const R = 128;
const SPAN = 38; // meia abertura de cada arco, em graus
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
  const center = final ? ['Síntese'] : state.screen >= 2 ? ['Retrato', 'atual'] : ['Sua', 'organização'];

  const ring = (
    <svg viewBox={variant === 'mini' ? '50 50 300 300' : '0 0 400 400'} className="h-full w-full" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Sua jornada: quatro temas do retrato da sua organização. O texto ao lado descreve cada um.</title>
      {QUESTIONS.map((q) => {
        const { angle } = DIM[q.id];
        const st = states[q.id];
        const d = arc(R, angle - SPAN, angle + SPAN);
        const stage = st && st !== 'Não identificado' ? STAGE[st] : null;
        return (
          <g key={q.id}>
            {/* Trilha: cinza antes da resposta, turquesa claro depois. */}
            <path d={d} fill="none" stroke={st ? '#00a88e' : '#0a2540'} strokeOpacity={st ? 0.14 : 0.07} strokeWidth={30} strokeLinecap="round"
              strokeDasharray={st === 'Não identificado' ? '4 9' : undefined} className="motion-safe:transition-all motion-safe:duration-700" />
            {stage && (
              <path d={d} pathLength={100} fill="none" stroke="#00a88e" strokeOpacity={stage.opacity} strokeWidth={30} strokeLinecap="round"
                strokeDasharray={`${stage.fill} 100`} className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-700" />
            )}
            {stage && variant !== 'mini' && (
              <circle key={`h-${st}`} cx={at(R, angle).x} cy={at(R, angle).y} r={24} fill="none" stroke="#00a88e" strokeWidth={2} className={halo} />
            )}
            {variant !== 'mini' && (() => {
              // Fio-guia do arco até o canto do rótulo.
              const a = at(R + 18, angle);
              const b = at(R + 52, angle);
              const right = b.x > C;
              return <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${b.x + (right ? 22 : -22)} ${b.y}`} fill="none" stroke="#0a2540" strokeOpacity={st ? 0.35 : 0.15} strokeWidth={1.5} />;
            })()}
          </g>
        );
      })}
      <circle cx={C} cy={C} r={84} fill="#0a2540" />
      <text x={C} y={center.length === 1 ? C : C - 15} textAnchor="middle" dominantBaseline="middle" fontSize={center.some((t) => t.length > 8) ? 24 : 30} fontWeight={600} fill="#ffffff" className="font-display">
        {center.map((t, i) => <tspan key={t} x={C} dy={i ? 32 : 0}>{t}</tspan>)}
      </text>
    </svg>
  );

  if (variant === 'mini') return ring;

  const labelRow = (ids: DimensionId[]) => (
    <div className="flex justify-between gap-3">
      {ids.map((id) => {
        const st = states[id];
        return (
          <p key={id} className={`max-w-[48%] text-[13px] leading-[1.15rem] ${DIM[id].align}`}>
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
      <div className={`mx-auto -my-2 aspect-square ${variant === 'full' ? 'w-[54%]' : 'w-[66%]'}`}>{ring}</div>
      {labelRow(['disseminacao', 'seguranca'])}
    </div>
  );

  if (variant === 'portrait') return <figure className="w-full">{labelled}</figure>;

  // ------------------------------------------------------- bloco de texto
  const challenges = CHALLENGES.filter((c) => state.challenges.includes(c.id));
  const insight = isMirrorComplete(state.mirror) ? mirrorResult(state.mirror).rule.insight : null;
  const goal = GOALS.find((g) => g.id === state.goal);
  const path = [
    state.group && { k: 'Grupo inicial', v: GROUP_SIZES.find((g) => g.id === state.group)!.label },
    state.tools.length > 0 && { k: 'Ambiente', v: TOOL_ENVS.filter((t) => state.tools.includes(t.id)).map((t) => t.label).join(', ') },
    state.indicator && { k: 'Sinal de sucesso', v: stripDot(INDICATORS.find((i) => i.id === state.indicator)!.label) },
  ].filter(Boolean) as { k: string; v: string }[];

  const section = 'border-t border-ink/[0.08] pt-2.5';
  const title = 'font-display text-[15px] font-semibold text-ink';

  return (
    <figure className="w-full">
      {heading && <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">Sua jornada</p>}
      {labelled}

      <figcaption className="mt-3 space-y-2.5 text-[13px] leading-5 text-ink-2">
        <div className={section}>
          <p className={title}>Desafios identificados</p>
          {challenges.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {challenges.map((c) => (
                <li key={c.id} className={`rounded-full bg-accent/[0.14] px-2.5 py-1 text-xs font-medium text-ink transition-shadow ${highlight === c.id ? 'ring-2 ring-accent' : ''}`}>
                  {CHALLENGE_SHORT[c.id]}
                </li>
              ))}
            </ul>
          ) : <p className="mt-1 text-ink-soft">Nenhum marcado ainda.</p>}
        </div>

        {/* Os rótulos do anel são o único resumo por dimensão (sem "Leitura atual"
            repetindo os estágios, regra da matriz revisada). */}
        {insight && (
          <div className={section}>
            <p className={title}>Principal descoberta</p>
            <p className="mt-1">{insight}</p>
          </div>
        )}

        {state.screen >= 3 && state.capabilities.length > 0 && (
          <div className={section}>
            <p className={title}>Interesses no mapa</p>
            <p className="mt-1">{state.capabilities.map((id) => CAPABILITY_SHORT[id]).join(' · ')}</p>
          </div>
        )}

        {goal && (
          <div className={section}>
            <p className={title}>Objetivo</p>
            <p className="mt-1">{stripDot(goal.label)}</p>
          </div>
        )}

        {path.length > 0 && (
          <div className={section}>
            <p className={title}>Caminho inicial</p>
            <ul className="mt-1.5 space-y-1">
              {path.map((p) => <li key={p.k}><span className="font-semibold text-ink">{p.k}:</span> {p.v}</li>)}
            </ul>
          </div>
        )}

        <div className={section}>
          <p className={title}>Próximo foco</p>
          <p className="mt-1">{NEXT_FOCUS[final ? 7 : state.screen]}</p>
        </div>

      </figcaption>
    </figure>
  );
}
