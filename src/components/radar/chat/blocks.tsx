/**
 * Composições do Radar IA que não são mensagens (documento v1.6, "Anatomia de
 * um chat premium"): a dica curta, o retrato, o vídeo e a síntese do caminho.
 * O PDF fica no compositor, depois do cenário e das perguntas de contato.
 *
 * Um único estilo para a dica e poucos cartões. Nada aqui salva, remove ou
 * expande ações: o plano é derivado das respostas.
 */
import type { ReactNode } from 'react';
import { TIPS } from '../../../data/radar/reactions.ts';
import { PATH_LABEL } from '../../../data/radar/path.ts';
import { scenarioCard, tipChallenge, type RadarState } from '../../../scripts/radar/engine.ts';
import type { Dispatch } from '../state';
import { mirrorReady, type Block } from './script';
import { Icon } from '../ui';
import RadarVivo from '../RadarVivo';
import VideoSlot from '../VideoSlot';

export interface PdfControls {
  onDownload: () => void;
  busy: boolean;
  message: string;
  /** "Baixar meu plano em PDF", "Baixar de novo" ou "Tentar de novo". */
  label: string;
}

export interface BlockContext {
  state: RadarState;
  dispatch: Dispatch;
  pdf: PdfControls;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`w-full rounded-3xl border border-ink/[0.1] bg-paper p-5 shadow-lg shadow-ink/[0.05] sm:p-6 ${className}`}>{children}</div>;
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{children}</p>;
}

/** Superfície leve da dica e da confirmação: o único estilo de "descoberta" do chat (v1.6). */
function Note({ label, title, children }: { label: string; title?: string; children: ReactNode }) {
  return (
    <aside aria-label={label} className="flex gap-3 rounded-2xl border border-accent-ink/15 bg-accent/[0.06] px-4 py-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-accent-ink shadow-sm" aria-hidden="true"><Icon name="lightbulb" size={16} /></span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{label}</p>
        {title && <p className="mt-1 font-display text-[17px] font-medium leading-snug text-ink">{title}</p>}
        <div className="mt-1 text-sm leading-6 text-ink-2">{children}</div>
      </div>
    </aside>
  );
}

export function renderBlock(block: Block, ctx: BlockContext): ReactNode {
  const { state } = ctx;
  switch (block.type) {
    case 'say':
      return null; // falas viram mensagens no RadarApp

    // A dica curta (v1.6, §3.6): título de até ~12 palavras e uma ou duas frases. Sem botões.
    case 'tip': {
      const tip = state.tipPill ? TIPS[state.tipPill] : undefined;
      const challenge = tipChallenge(state.tipPill);
      if (!tip || !challenge) return null;
      return <Note label={`Dica · ${challenge.label}`} title={tip.title}>{tip.text}</Note>;
    }

    // Retrato consultivo (matriz revisada pelo Thiago): o anel com rótulos é o
    // único resumo por dimensão; ao lado, a descoberta e o porquê; embaixo, o
    // que aproveitar, o próximo passo com a entrega e a nota de atenção. As duas
    // ações complementares vão só para o PDF.
    case 'portrait': {
      const r = mirrorReady(state);
      if (!r) return null;
      return (
        // Em `lg` o anel sai do cartão: o painel ao lado já o mostra, e o texto
        // ganha a largura toda. Abaixo de `lg` o painel fica escondido, e o anel
        // continua aqui. O "Próximo passo" leva o filete turquesa: é o que a
        // pessoa leva da conversa.
        <Card className="border-accent-ink/15">
          <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:grid-cols-1">
            <div className="mx-auto w-full max-w-[340px] lg:hidden"><RadarVivo state={state} variant="portrait" /></div>
            <div>
              <Label>Principal descoberta</Label>
              <p className="mt-2 font-display text-xl font-medium leading-snug tracking-tight text-ink lg:text-[1.4rem]">“{r.rule.insight}”</p>
              <p className="mt-3 text-sm font-semibold text-ink">Por que essa leitura?</p>
              <p className="mt-1 text-sm leading-6 text-ink-2">{r.rule.why}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-ink/[0.08] pt-5 sm:grid-cols-2">
            <div className={`rounded-2xl p-4 ${r.value.kind === 'favor' ? 'bg-accent/[0.06]' : 'bg-surface/70'}`}>
              <p className={`text-sm font-semibold ${r.value.kind === 'favor' ? 'text-accent-ink' : 'text-ink'}`}>{r.value.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink">{r.value.text}</p>
            </div>
            <div className="rounded-2xl border border-ink/[0.08] border-l-[3px] border-l-accent bg-paper p-4 shadow-sm shadow-ink/[0.04]">
              <p className="text-sm font-semibold text-ink">Próximo passo</p>
              <p className="mt-1 text-sm leading-6 text-ink">{r.rule.step}</p>
              <p className="mt-2 text-[13px] leading-5 text-ink-2"><span className="font-semibold text-ink">Entrega:</span> {r.rule.deliverable}</p>
            </div>
          </div>
          {/* A nota de atenção saiu do cartão (pedido do Thiago); continua no PDF. */}
        </Card>
      );
    }

    case 'video':
      return <Card className="p-3 sm:p-4"><VideoSlot onPlay={() => ctx.dispatch({ type: 'videoStarted' })} /></Card>;

    case 'scenario': {
      const c = scenarioCard(state);
      return (
        <Card>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {([[PATH_LABEL.goal, c.goal], [PATH_LABEL.group, c.group], [PATH_LABEL.tools, c.tools], [PATH_LABEL.indicator, c.indicator]] as const).map(([k, v]) => (
              <div key={k}><dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{k}</dt><dd className="mt-1 text-ink">{v}</dd></div>
            ))}
          </dl>
          {/* O roteiro (Preparar → Expandir) e o "Como o IA para Equipes se encaixa"
              saíram do chat (pedido do Thiago); seguem no PDF. */}
        </Card>
      );
    }

  }
}
