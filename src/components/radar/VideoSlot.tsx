/**
 * Vídeo único do Radar IA ("A IA pode fazer muito mais do que você imagina"),
 * na Tela 04 do chat e na página pública `/diagnostico-ia/video`. A casca é a do
 * `[data-journey-frame]` do `Structure.astro`.
 *
 * Duas versões (`VIDEO_SOURCES` em `config.ts`): reels (9:16) para celular em pé
 * e desktop (16:9) para o resto. A escolha acontece depois da hidratação (o
 * servidor sempre desenha a do desktop) e acompanha a orientação até o primeiro
 * play; depois do play, não troca, para não reiniciar o vídeo.
 *
 * Começa com um toque: capa (`poster`) e `preload="none"`, porque tem narração e
 * nada deve ser baixado antes. A legenda já vem gravada na imagem; a faixa .vtt
 * fica disponível no player, desligada, para leitores de tela e quem quiser.
 * Sem `VIDEO_READY`, mostra a moldura vazia. Só o player, sem atalhos de
 * capítulo (pedido do Thiago, 16/11/2026).
 */
import { useEffect, useRef, useState } from 'react';
import { VIDEO_SCREEN as T } from '../../data/radar/capabilities.ts';
import { VIDEO_READY, VIDEO_SOURCES, VIDEO_CAPTIONS, VIDEO_MOBILE_QUERY } from '../../data/radar/config.ts';
import { Icon } from './ui';

type Variant = keyof typeof VIDEO_SOURCES;

export default function VideoSlot({ onPlay }: { onPlay?: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant>('desktop');
  const started = useRef(false);
  const [playing, setPlaying] = useState(false);

  // Celular: no player nativo do Android, a tela cheia fica no menu de três
  // pontinhos. O botão deixa à mão (17/11/2026, pedido do Thiago).
  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.(); // iOS: o <video> só aceita este
    void v.play().catch(() => {});
  };

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_MOBILE_QUERY);
    const pick = () => { if (!started.current) setVariant(mq.matches ? 'mobile' : 'desktop'); };
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, []);

  const source = VIDEO_SOURCES[variant];
  const mobile = variant === 'mobile';
  const frame = 'relative isolate overflow-hidden rounded-3xl border border-ink-2/20 bg-linear-to-br from-paper via-paper/[0.92] to-accent/[0.12] shadow-[0_0_0_1px_rgba(10,37,64,0.08),0_18px_55px_rgba(10,37,64,0.08),inset_0_1px_0_rgba(255,255,255,0.70)]';

  return (
    <div>
      <div className={`${frame} ${mobile ? 'mx-auto aspect-[9/16] max-h-[max(16rem,calc(100dvh-30rem))]' : 'mx-auto aspect-video max-w-[calc((100dvh-27rem)*16/9)]'}`}>
        <div className="pointer-events-none absolute inset-x-5 top-0 z-10 h-px bg-linear-to-r from-transparent via-ink-2/60 to-transparent" aria-hidden="true" />
        {VIDEO_READY ? (
          <video
            key={variant}
            ref={video}
            src={source.src}
            poster={source.poster}
            controls
            playsInline
            preload="none"
            onPlay={() => { started.current = true; setPlaying(true); onPlay?.(); }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            className="block h-full w-full bg-paper object-contain"
          >
            {VIDEO_CAPTIONS && <track kind="captions" src={VIDEO_CAPTIONS} srcLang="pt-BR" label="Português" />}
          </video>
        ) : null}
        {VIDEO_READY && !playing && (
          <button type="button" onClick={fullscreen} aria-label="Assistir em tela cheia"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper shadow-md backdrop-blur-sm transition-colors hover:bg-ink/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:hidden">
            <Icon name="full-screen" size={20} />
          </button>
        )}
        {!VIDEO_READY && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/[0.14] bg-paper/80 text-ink-soft" aria-hidden="true">
              <Icon name="play" size={22} />
            </span>
            <p className="font-display text-lg font-medium text-ink sm:text-xl">{T.pending}</p>
            <p className="hidden max-w-md text-sm leading-6 text-ink-soft sm:block">{T.pendingText}</p>
          </div>
        )}
      </div>
      {!VIDEO_READY && <p className="mt-3 text-sm leading-6 text-ink-soft sm:hidden">{T.pendingText}</p>}

    </div>
  );
}
