/**
 * Compositor do Radar IA: a caixa fixa no pé do chat, com a cara do campo de
 * mensagem de um chat de IA (decisão do Thiago depois da v1.6). Não há texto
 * livre: as respostas da vez aparecem como sugestões, e só depois que o Radar
 * termina de "digitar".
 *
 * - resposta única: tocar na sugestão envia;
 * - múltipla escolha: as sugestões marcam e desmarcam, e o botão redondo de
 *   enviar (seta para cima) confirma; desabilitado sem seleção;
 * - continuar: uma sugestão só, que envia;
 * - texto: só nas perguntas de contato (nome, cargo "Outro", e-mail e
 *   WhatsApp), com validação e o erro na linha de status;
 * - fechamento: o download do PDF é a ação principal.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Reply } from './script';
import type { PdfControls } from './blocks';
import { Icon } from '../ui';

interface Props {
  /** Muda a cada passo; o foco vai para a primeira sugestão nova. */
  stepKey: number;
  reply: Reply;
  /** Falso enquanto o Radar "digita": a caixa fica inativa. */
  ready: boolean;
  animate: boolean;
  onPick: (id: string) => void;
  onToggle: (id: string) => void;
  onSubmit: () => void;
  /** Resposta digitada (perguntas de contato), já validada. */
  onText: (value: string) => void;
  pdf: PdfControls;
}

const pill = 'inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-left text-sm leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

export default function Composer({ stepKey, reply, ready, animate, onPick, onToggle, onSubmit, onText, pdf }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isText = reply.kind === 'text';

  // Campo novo a cada pergunta de contato, com o foco nele.
  useEffect(() => { setValue(''); setError(null); }, [stepKey]);
  useEffect(() => {
    if (ready && isText) input.current?.focus({ preventScroll: true });
  }, [ready, isText, stepKey]);

  const sendText = (e: FormEvent) => {
    e.preventDefault();
    if (!ready || reply.kind !== 'text') return;
    const problem = reply.validate(value);
    setError(problem);
    if (problem) { input.current?.focus(); return; }
    onText(value);
  };
  const reduce = useReducedMotion();
  const seen = useRef(-1);

  // Foco na primeira sugestão quando as opções de um passo novo aparecem e o
  // foco se perdeu (o botão clicado saiu). Nunca na abertura da página.
  useEffect(() => {
    if (!ready || seen.current === stepKey) return;
    const first = seen.current === -1;
    seen.current = stepKey;
    if (first || document.activeElement !== document.body) return;
    box.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  }, [ready, stepKey]);

  const multi = reply.kind === 'multi';
  const canSend = multi && (reply.selected.length > 0 || Boolean(reply.empty));
  const enter = animate && !reduce ? { opacity: 0, y: 6 } : false;

  let options = null;
  const cards = (reply.kind === 'single' || reply.kind === 'multi') && reply.options.every((o) => o.desc);
  if (cards && (reply.kind === 'single' || reply.kind === 'multi')) {
    // Cartões com ícone, título, descrição e caixa de seleção (referência do
    // Thiago para a Tela 01). Quatro lado a lado a partir de `sm`; no celular, um
    // por linha, com o ícone à esquerda.
    options = (
      <div role="group" aria-label={multi ? 'Marque uma ou mais respostas' : 'Escolha uma resposta'} className="grid gap-2 sm:grid-cols-2 sm:gap-2.5 xl:grid-cols-4">
        {reply.options.map((o) => {
          const on = multi && reply.selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              role={multi ? 'checkbox' : undefined}
              aria-checked={multi ? on : undefined}
              onClick={() => (multi ? onToggle(o.id) : onPick(o.id))}
              className={`relative flex items-start gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:flex-col sm:gap-2.5 sm:p-3.5 ${on ? 'border-accent-ink bg-accent/[0.08] shadow-[0_6px_20px_rgba(0,168,142,0.12)]' : 'border-ink/[0.12] bg-paper hover:border-accent-ink/50 hover:bg-accent/[0.04]'}`}
            >
              {o.icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/[0.12] text-ink" aria-hidden="true">
                  <Icon name={o.icon} size={20} />
                </span>
              )}
              <span className="min-w-0 flex-1 pr-7 sm:pr-0">
                <span className="block font-display text-[15px] font-semibold leading-5 text-ink">{o.label}</span>
                <span className="mt-1 block text-[13px] leading-[1.15rem] text-ink-2">{o.desc}</span>
              </span>
              {multi && (
                <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-md border ${on ? 'border-accent-ink bg-accent-ink text-paper' : 'border-ink/25 bg-paper'}`} aria-hidden="true">
                  {on && <Icon name="check" size={14} />}
                </span>
              )}
            </button>
          );
        })}
        {multi && reply.empty && reply.selected.length === 0 && (
          <button type="button" onClick={onSubmit} className={`${pill} justify-center border-dashed border-ink/[0.2] bg-transparent text-ink-2 hover:border-ink/40 sm:col-span-2 xl:col-span-4`}>{reply.empty}</button>
        )}
      </div>
    );
  } else if (reply.kind === 'single' || reply.kind === 'multi') {
    // Respostas longas (as do retrato) empilham; as curtas, com ícone, fluem lado a lado.
    const stacked = reply.options.some((o) => o.label.length > 48);
    options = (
      <div role="group" aria-label={multi ? 'Marque uma ou mais respostas' : 'Escolha uma resposta'} className={stacked ? 'grid gap-2' : 'flex flex-wrap gap-2'}>
        {reply.options.map((o) => {
          const on = multi && reply.selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              role={multi ? 'checkbox' : undefined}
              aria-checked={multi ? on : undefined}
              onClick={() => (multi ? onToggle(o.id) : onPick(o.id))}
              className={`${pill} ${stacked ? 'w-full' : ''} ${on ? 'border-accent-ink bg-accent/[0.1] text-ink' : 'border-ink/[0.14] bg-paper text-ink hover:border-accent-ink/60 hover:bg-accent/[0.05]'}`}
            >
              {o.logo ? (
                <svg viewBox={o.logo.viewBox} width={16} height={16} aria-hidden="true" className={`shrink-0 ${on ? 'text-accent-ink' : 'text-ink-soft'}`}><path fill="currentColor" d={o.logo.d} /></svg>
              ) : o.icon && <Icon name={o.icon} size={18} className={on ? 'text-accent-ink' : 'text-ink-soft'} />}
              {o.letter && !o.icon && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-[11px] font-semibold text-ink" aria-hidden="true">{o.letter}</span>}
              <span>{o.label}</span>
              {multi && on && <Icon name="check" size={14} className="text-accent-ink" />}
            </button>
          );
        })}
        {multi && reply.empty && reply.selected.length === 0 && (
          <button type="button" onClick={onSubmit} className={`${pill} border-dashed border-ink/[0.2] bg-transparent text-ink-2 hover:border-ink/40`}>{reply.empty}</button>
        )}
      </div>
    );
  } else if (reply.kind === 'continue') {
    options = (
      <button type="button" onClick={() => onPick('go')} className={`${pill} border-accent-ink bg-accent/[0.08] font-semibold text-ink hover:bg-accent/[0.14]`}>
        {reply.label}
      </button>
    );
  } else if (reply.kind === 'text') {
    options = null;
  } else {
    // Fechamento: o download é a ação principal.
    options = (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button type="button" disabled={pdf.busy} onClick={pdf.onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-ink px-5 py-3 text-sm font-semibold text-paper shadow-lg shadow-ink/15 transition-colors hover:bg-accent-ink-strong disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
          <Icon name="download" size={16} />
          {pdf.busy ? 'Gerando seu PDF…' : pdf.label}
        </button>
      </div>
    );
  }

  // Sem texto de apoio ("Escolha uma resposta" saiu): só os avisos do PDF.
  const status = ready && reply.kind === 'none' ? pdf.message : '';

  return (
    <div ref={box} data-composer className="rounded-[1.75rem] border border-ink/[0.12] bg-paper p-3 shadow-[0_8px_30px_rgba(10,37,64,0.10)] transition-colors focus-within:border-accent-ink/40 sm:p-3.5">
      {/* Opções e botão de enviar na mesma linha, sem faixa embaixo (pedido do
          Thiago): o botão fica ao pé das opções, à direita. */}
      {!isText && (
        <div className="flex items-end gap-3">
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {ready && (
                <motion.div key={stepKey} data-options initial={enter} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className={`${cards ? 'max-h-[50vh]' : 'max-h-[36vh]'} overflow-x-hidden overflow-y-auto`}>
                  {options}
                </motion.div>
              )}
            </AnimatePresence>
            {!ready && <p className="flex h-10 items-center pl-2 text-sm text-ink-soft/80">Digitando…</p>}
          </div>
          {(multi || reply.kind === 'continue') && (
            <button
              type="button"
              aria-label={multi ? reply.submit : (reply.kind === 'continue' ? reply.label : 'Enviar')}
              disabled={!ready || (multi && !canSend)}
              onClick={() => (multi ? onSubmit() : onPick('go'))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-ink text-paper shadow-md transition-colors hover:bg-accent-ink-strong disabled:bg-ink/15 disabled:text-paper disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Icon name="arrow-up" size={20} />
            </button>
          )}
        </div>
      )}
      {/* Status só quando há o que dizer (avisos do PDF). Sempre no DOM, vazio sem
          altura, para o aria-live anunciar a mudança. */}
      {!isText && (
        <p className={`truncate pl-2 text-[13px] text-ink-soft ${status ? 'pt-2' : ''}`} role="status" aria-live="polite">{status}</p>
      )}
      {isText ? (
        // Pergunta de contato: campo de uma linha com o botão de enviar.
        <form onSubmit={sendText} noValidate className="flex items-center gap-2 pl-1">
          <input
            ref={input}
            type={reply.type}
            name={reply.autoComplete}
            autoComplete={reply.autoComplete}
            inputMode={reply.type === 'tel' ? 'tel' : reply.type === 'email' ? 'email' : 'text'}
            aria-label={reply.label}
            aria-invalid={Boolean(error)}
            aria-describedby={`composer-status-${stepKey}`}
            placeholder={ready ? reply.placeholder : 'Digitando…'}
            disabled={!ready}
            maxLength={reply.type === 'tel' ? 15 : 120}
            value={value}
            onChange={(e) => { setValue(reply.mask ? reply.mask(e.target.value) : e.target.value); if (error) setError(null); }}
            className="h-11 min-w-0 flex-1 rounded-2xl bg-transparent px-2 text-[15px] text-ink placeholder:text-ink-soft focus:outline-none disabled:cursor-wait"
          />
          <button type="submit" aria-label="Enviar" disabled={!ready || !value.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-ink text-paper shadow-md transition-colors hover:bg-accent-ink-strong disabled:bg-ink/15 disabled:text-paper disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            <Icon name="arrow-up" size={20} />
          </button>
        </form>
      ) : null}
      {isText && (
        // Sem altura quando não há erro: antes ficava uma faixa vazia embaixo do campo.
        <p id={`composer-status-${stepKey}`} className={`px-3 text-[13px] ${error ? 'pt-1 font-medium text-ink' : ''}`} role="status" aria-live="polite">
          {error ? <span className="inline-flex items-center gap-1.5"><Icon name="info-circle" size={14} />{error}</span> : ''}
        </p>
      )}
    </div>
  );
}
