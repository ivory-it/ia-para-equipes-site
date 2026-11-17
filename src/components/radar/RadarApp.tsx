/**
 * Radar IA — conversa guiada com cara de chat de IA.
 *
 * Ilha React única em `src/pages/diagnostico-ia/index.astro`. O Radar segue um roteiro
 * fixo (`chat/script.ts`, documento v1.6) e o plano sai das respostas
 * (`engine.ts`). Depois do teste da v1.6 ("está muito seco, joga tudo de uma
 * vez"), o Thiago pediu o ritmo de um chat de IA:
 *
 * - uma mensagem por vez: pontos de digitação → texto palavra a palavra →
 *   próxima mensagem (`chat/Typewriter.tsx`); a rolagem acompanha;
 * - as respostas ficam num compositor fixo no rodapé (`chat/Composer.tsx`), e
 *   as opções só aparecem quando o Radar termina de "digitar";
 * - tocar na conversa durante a digitação mostra tudo de uma vez;
 * - sem "Alterar" nem "Minha jornada".
 *
 * Com movimento reduzido, tudo aparece completo, sem pontos nem espera.
 *
 * Base do chat: shadcn/ui AI Elements (`Conversation`, `Message`). Captação:
 * depois do cenário, o Radar pede nome, cargo, e-mail e WhatsApp no próprio chat
 * (sem modal); na entrega, o lead vai ao receptor (`lead-api.ts`) com as
 * respostas da jornada e o PDF é gerado sozinho. Com o token, nada disso.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useStickToBottomContext } from 'use-stick-to-bottom';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import type { ChallengeId } from '../../data/radar/challenges.ts';
import type { CapabilityId } from '../../data/radar/capabilities.ts';
import type { ToolEnv } from '../../data/radar/path.ts';
import { leadFields, tipChallenge } from '../../scripts/radar/engine.ts';
import { useRadar } from './state';
import { useAccessMode } from './access';
import { sendLead, isLocalHost, MSG_FAILED, MSG_INVALID, MSG_LOCAL } from '../../scripts/lead-api';
import { ORIGEM_LEAD } from '../../data/radar/config';
import { Icon } from './ui';
import RadarVivo from './RadarVivo';
import Composer from './chat/Composer';
import { TypingDots, Typewriter, typingDelay } from './chat/Typewriter';
import { renderBlock, type BlockContext } from './chat/blocks';
import { answer, getStep, progressWithin, FIRST_STEP, DISPLAY_STEP, STEP_NAMES, TOTAL_STEPS, type Block, type Say, type StepId } from './chat/script';

type PdfStatus = 'idle' | 'sending' | 'lead-error' | 'lead-invalid' | 'generating' | 'done' | 'error';

interface Entry { key: number; step: StepId; answer?: string; after?: Block[] }

/** A conversa em ordem: falas do passo, resposta do visitante, o que vem depois. */
type Item =
  | { key: string; step: StepId; kind: 'ia'; block: Block }
  | { key: string; step: StepId; kind: 'user'; text: string };

const sayLength = (b: Block) => (b.type === 'say' ? `${b.title ?? ''} ${b.text ?? ''}`.length : 60);

export default function RadarApp({ siteUrl }: { siteUrl: string }) {
  const [state, dispatch] = useRadar();
  const access = useAccessMode();
  const reduce = useReducedMotion();
  const [history, setHistory] = useState<Entry[]>([{ key: 0, step: FIRST_STEP }]);
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>('idle');
  const [leadSent, setLeadSent] = useState(false);
  const [localBypass, setLocalBypass] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const nextKey = useRef(1);
  const radarSheet = useRef<HTMLDialogElement>(null);

  // No servidor e no 1º render do navegador, a conversa sai completa (HTML útil
  // e hidratação igual). Depois da hidratação, o ritmo começa do zero.
  const [hydrated, setHydrated] = useState(false);
  const [played, setPlayed] = useState(0);
  useEffect(() => setHydrated(true), []);

  const current = history[history.length - 1]!;
  const step = getStep(current.step);

  const items: Item[] = history.flatMap((e) => {
    const s = getStep(e.step);
    return [
      ...s.ia(state).map((block, j): Item => ({ key: `${e.key}-ia-${j}`, step: e.step, kind: 'ia', block })),
      ...(e.answer ? [{ key: `${e.key}-voce`, step: e.step, kind: 'user', text: e.answer } as Item] : []),
      ...(e.after ?? []).map((block, j): Item => ({ key: `${e.key}-depois-${j}`, step: e.step, kind: 'ia', block })),
    ];
  });

  const instant = !hydrated || reduce;
  const shown = instant ? items.length : Math.min(played, items.length);
  // As opções só aparecem depois da hidratação: antes disso não há como responder,
  // e mostrá-las para logo sumir (quando a digitação começa) seria um pisca.
  const ready = hydrated && shown >= items.length;
  const advance = useCallback(() => setPlayed((p) => p + 1), []);
  const showAll = () => setPlayed(items.length);

  // A resposta do visitante não "digita": entra e libera a próxima fala.
  const next = items[shown];
  // O cabeçalho acompanha a mensagem que está chegando, não o passo que vem depois.
  const onScreen = getStep((next ?? items[items.length - 1])!.step);
  useEffect(() => {
    if (!instant && next?.kind === 'user') advance();
  }, [instant, next?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // O Radar Vivo usa a "tela" do documento para saber o que desenhar.
  useEffect(() => {
    if (state.screen !== step.screen) dispatch({ type: 'go', screen: step.screen });
  }, [step.screen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sem persistência: avisa antes de sair quando já há respostas.
  const hasAnswers = history.length > 1;
  useEffect(() => {
    if (!hasAnswers) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasAnswers]);

  const respond = (value: string) => {
    if (!ready) return;
    const a = answer(current.step, value, stateRef.current);
    a.actions.forEach(dispatch);
    const key = nextKey.current++;
    // A página e o chat rolam: ao responder, a página volta ao topo, para o
    // compositor e a conversa ficarem inteiros na tela.
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setHistory((h) => [...h.slice(0, -1), { ...h[h.length - 1]!, answer: a.text, after: a.after }, { key, step: a.next }]);
  };

  const toggle = (id: string) => {
    if (current.step === 'desafios') dispatch({ type: 'toggleChallenge', id: id as ChallengeId });
    if (current.step === 'possibilidades') dispatch({ type: 'toggleCapability', id: id as CapabilityId });
    if (current.step === 'ferramentas') dispatch({ type: 'toggleTool', id: id as ToolEnv });
  };

  // ------------------------------------------------------------- PDF
  const generate = useCallback(async () => {
    setPdfStatus('generating');
    try {
      const { downloadPlanPdf } = await import('./pdf/generate');
      await downloadPlanPdf(stateRef.current, siteUrl);
      setPdfStatus('done');
    } catch (err) {
      console.error(err);
      setPdfStatus('error');
    }
  }, [siteUrl]);

  // ------------------------------------------------------------- lead
  // Sem modal: o contato é pedido no chat. Ao chegar na entrega, o lead vai ao
  // receptor com as respostas da jornada; com 202, o PDF é gerado sozinho.
  const sendAndGenerate = useCallback(async () => {
    setPdfStatus('sending');
    const s = stateRef.current;
    const status = await sendLead({ ...s.contact, origem: ORIGEM_LEAD, ...leadFields(s) });
    if (status !== 202) {
      // Em localhost o CORS bloqueia o envio: libera o PDF para teste. Em
      // produção, sem o lead não há PDF ("Tentar de novo").
      if (isLocalHost(location.hostname)) {
        setLocalBypass(true);
        setLeadSent(true);
        await generate();
        return;
      }
      setPdfStatus(status === 400 ? 'lead-invalid' : 'lead-error');
      return;
    }
    setLeadSent(true);
    await generate();
  }, [generate]);

  const delivered = useRef(false);
  useEffect(() => {
    if (current.step !== 'entrega' || delivered.current) return;
    delivered.current = true;
    void sendAndGenerate();
  }, [current.step, sendAndGenerate]);

  // O token liberado pelo servidor pula as perguntas de contato.
  useEffect(() => {
    dispatch({ type: 'access', direct: access === 'download_direto_autorizado' });
  }, [access]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDownload = () => {
    if (state.directPdf || leadSent) { void generate(); return; }
    void sendAndGenerate();
  };

  const ctx: BlockContext = {
    state,
    dispatch,
    pdf: {
      onDownload,
      busy: pdfStatus === 'generating' || pdfStatus === 'sending',
      label: pdfStatus === 'lead-error' || pdfStatus === 'lead-invalid' || pdfStatus === 'error' ? 'Tentar de novo'
        : pdfStatus === 'done' ? 'Baixar de novo' : 'Baixar meu plano em PDF',
      message: pdfStatus === 'done' ? (localBypass ? MSG_LOCAL : 'PDF gerado. Confira seus downloads.')
        : pdfStatus === 'sending' ? 'Enviando seus dados…'
        : pdfStatus === 'lead-invalid' ? MSG_INVALID
        : pdfStatus === 'lead-error' ? MSG_FAILED
        : pdfStatus === 'error' ? 'Não conseguimos gerar o PDF agora. Tente de novo.' : '',
    },
  };

  // O ponto do desafio da dica fica em destaque enquanto a dica é a novidade.
  const highlight = current.step === 'espelho-pessoas' ? (tipChallenge(state.tipPill)?.id ?? null) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
      {/* Coluna do chat: altura da tela; mensagens rolam, o compositor fica no pé. */}
      <div className="flex h-[calc(100dvh-5.5rem-1.5rem)] min-h-[32rem] min-w-0 flex-col">
        <header className="mx-auto w-full max-w-[860px] px-1 pb-3">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 text-balance font-display text-lg font-semibold leading-tight tracking-tight text-ink sm:text-xl">Descubra seu próximo passo com IA</p>
            {/* Celular: a pílula diz o que abre (antes, um mini-anel de 40 px sem nome). */}
            <button type="button" onClick={() => radarSheet.current?.showModal()}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ink/[0.12] bg-paper py-1 pl-1 pr-3.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink/40 lg:hidden">
              <span className="block h-8 w-8" aria-hidden="true"><RadarVivo state={state} variant="mini" /></span>
              Sua jornada
            </button>
          </div>
          <Progress step={DISPLAY_STEP[onScreen.screen]} within={progressWithin(onScreen.id)} />
        </header>

        <Conversation className="min-h-0 border-t border-ink/[0.06]" aria-label="Conversa: descubra seu próximo passo com IA">
          {/* `min-h-full justify-end`: a conversa cresce de baixo para cima, como nos
              apps de chat, e a pergunta da vez fica colada às opções do compositor. */}
          <ConversationContent
            className={`mx-auto min-h-full w-full max-w-[860px] justify-end gap-6 px-1 py-6 ${!hydrated ? 'motion-safe:invisible motion-safe:animate-radar-unhide' : ''}`}
            onClick={() => { if (!ready) showAll(); }}
          >
            {items.slice(0, shown).map((item) => <Done key={item.key} item={item} ctx={ctx} />)}
            {!ready && next && next.kind === 'ia' && <Current key={next.key} item={next} ctx={ctx} onDone={advance} />}
          </ConversationContent>
          <FollowLatest trigger={`${shown}-${ready}`} />
          <ConversationScrollButton aria-label="Ir para a mensagem mais recente" className="bg-paper" />
        </Conversation>

        <div className="mx-auto w-full max-w-[860px] pt-2">
          <Composer
            stepKey={current.key}
            reply={step.reply(state)}
            ready={ready}
            animate={hydrated}
            onPick={respond}
            onToggle={toggle}
            onSubmit={() => respond('')}
            onText={respond}
            pdf={ctx.pdf}
          />
        </div>
      </div>

      {/* Radar Vivo: a reação visual principal, fixo ao lado no desktop. */}
      <aside className="hidden lg:block" aria-label="Sua jornada">
        <div className="sticky top-[6rem] max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-3xl border border-ink-2/15 bg-paper/[0.7] p-4 shadow-[0_0_0_1px_rgba(10,37,64,0.05),0_18px_55px_rgba(10,37,64,0.06)] backdrop-blur-xl">
          <RadarVivo state={state} highlight={highlight} />
        </div>
      </aside>

      <Sheet refEl={radarSheet} title="Sua jornada">
        <div className="mx-auto max-w-sm"><RadarVivo state={state} highlight={highlight} heading={false} /></div>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------- progresso

/**
 * Régua das 5 etapas, o único indicador de avanço (antes havia "Etapa 2 de 5" no
 * cabeçalho e "1 de 4" nas perguntas do retrato). Etapas feitas em turquesa, a
 * atual enchendo em `accent-ink` (no retrato, em quartos), as próximas em cinza.
 * Os nomes aparecem a partir de `sm`; no celular, só o da etapa atual.
 */
function Progress({ step, within }: { step: number; within: number }) {
  const label = `Etapa ${step} de ${TOTAL_STEPS}: ${STEP_NAMES[step - 1]}`;
  return (
    <div className="mt-2.5" role="progressbar" aria-label="Progresso da conversa" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={step} aria-valuetext={label}>
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {STEP_NAMES.map((name, i) => {
          const n = i + 1;
          const fill = n < step ? 100 : n === step ? Math.max(12, Math.round(within * 100)) : 0;
          return (
            <div key={name}>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
                <div className={`h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 ${n < step ? 'bg-accent' : 'bg-accent-ink'}`} style={{ width: `${fill}%` }} />
              </div>
              <p className={`mt-1.5 hidden truncate text-[12px] sm:block ${n === step ? 'font-semibold text-ink' : n < step ? 'text-ink-2' : 'text-ink-soft/80'}`}>{name}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-[13px] text-ink-soft sm:hidden" aria-hidden="true">Etapa {step} de {TOTAL_STEPS} · <span className="font-semibold text-ink">{STEP_NAMES[step - 1]}</span></p>
    </div>
  );
}

// ---------------------------------------------------------------- mensagens

/**
 * Quando uma mensagem termina ou as opções aparecem, o compositor muda de altura
 * e a área da conversa encolhe. O use-stick-to-bottom acompanha o conteúdo, não
 * a caixa; sem isto, no celular a última pergunta ficava escondida acima.
 */
function FollowLatest({ trigger }: { trigger: string }) {
  const { scrollToBottom } = useStickToBottomContext();
  useEffect(() => {
    const id = window.requestAnimationFrame(() => { void scrollToBottom(); });
    return () => window.cancelAnimationFrame(id);
  }, [trigger, scrollToBottom]);
  return null;
}

/** Linha da IA: avatar da onda e conteúdo, sem balão (como nos chats de IA). */
function AssistantRow({ children }: { children: ReactNode }) {
  return (
    <Message from="assistant" className="max-w-full flex-row items-start gap-3">
      <Wave className="mt-0.5 h-8 w-8" />
      <MessageContent className="min-w-0 flex-1 gap-1.5 overflow-visible text-ink">{children}</MessageContent>
    </Message>
  );
}

function SayText({ say, title, text }: { say: Say; title?: string; text?: string }) {
  return (
    <>
      {say.eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{say.eyebrow}</p>}
      {say.title && <p className="font-display text-xl font-medium leading-snug tracking-tight text-ink sm:text-[1.35rem]">{title ?? say.title}</p>}
      {say.text && (text ?? say.text) !== '' && <p className="text-[15px] leading-7 text-ink-2">{text ?? say.text}</p>}
    </>
  );
}

/** Item já entregue: mostrado completo. */
function Done({ item, ctx }: { item: Item; ctx: BlockContext }) {
  if (item.kind === 'user') {
    return (
      <Message from="user">
        <MessageContent className="max-w-[85%] text-[15px] leading-6">{item.text}</MessageContent>
      </Message>
    );
  }
  if (item.block.type === 'say') return <AssistantRow><SayText say={item.block} /></AssistantRow>;
  return <div className="pl-11">{renderBlock(item.block, ctx)}</div>;
}

/** Item chegando: pontos de digitação, depois texto palavra a palavra (ou o cartão entrando). */
function Current({ item, ctx, onDone }: { item: Extract<Item, { kind: 'ia' }>; ctx: BlockContext; onDone: () => void }) {
  const [typing, setTyping] = useState(true);
  const block = item.block;

  // Só na montagem: o componente é recriado a cada item (key), e o bloco é um
  // objeto novo a cada render, o que reiniciaria o tempo.
  useEffect(() => {
    const id = window.setTimeout(() => setTyping(false), typingDelay(sayLength(block)));
    return () => window.clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (typing) return <AssistantRow><TypingDots /></AssistantRow>;

  if (block.type === 'say') {
    const parts = [block.title ?? '', block.text ?? ''];
    return (
      <AssistantRow>
        <Typewriter parts={parts} onDone={onDone} render={([title, text]) => <SayText say={block} title={title} text={text} />} />
      </AssistantRow>
    );
  }
  return (
    <motion.div className="pl-11" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} onAnimationComplete={onDone}>
      {renderBlock(block, ctx)}
    </motion.div>
  );
}

/** Avatar do Radar: a onda oficial do kit da marca sobre navy, não um ícone genérico. */
function Wave({ className = '' }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-ink ${className}`} aria-hidden="true">
      <img src="/radar/onda.png" alt="" width="96" height="96" className="h-[72%] w-[72%] object-contain" />
    </span>
  );
}

function Sheet({ refEl, title, children }: { refEl: RefObject<HTMLDialogElement | null>; title: string; children: ReactNode }) {
  return (
    <dialog
      ref={refEl}
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      className="m-auto w-[min(600px,calc(100vw-2rem))] max-h-[88vh] rounded-3xl border border-ink/[0.12] bg-paper p-0 text-ink shadow-2xl shadow-ink/30 backdrop:bg-ink/40 backdrop:backdrop-blur-sm max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
          <button type="button" onClick={() => refEl.current?.close()} className="rounded-full p-2 text-ink-soft hover:bg-ink/[0.05] hover:text-ink" aria-label="Fechar"><Icon name="close" /></button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
