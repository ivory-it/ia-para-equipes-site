/**
 * Ritmo de chat de IA para o Radar (pedido do Thiago depois da v1.6: "está muito
 * seco"). A fala chega em três tempos: pontos de digitação, texto palavra a
 * palavra e, para cartões, entrada suave. É só ritmo: o conteúdo é o roteiro
 * fixo, sem fingir análise.
 *
 * Tempos: digitação de ~450 ms + 6 ms por caractere (até 1,1 s); escrita de
 * ~30 ms por palavra. Com movimento reduzido, nada disso roda (quem decide é o
 * RadarApp, que nem monta estes componentes nesse caso).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

export const typingDelay = (chars: number) => Math.min(1100, 450 + chars * 6);
const WORD_MS = 30;

/** Três pontos ao lado do avatar, enquanto a IA "digita". */
export function TypingDots() {
  return (
    <span className="inline-flex h-6 items-center gap-1" role="status" aria-label="Digitando">
      {[0, 160, 320].map((d) => (
        <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-ink/35 [animation-duration:900ms]" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}

/**
 * Escreve as partes em sequência (título, depois texto), palavra a palavra.
 * `parts` são strings já na ordem de exibição; `render` desenha cada parte com o
 * trecho escrito até agora.
 */
export function Typewriter({ parts, render, onDone }: {
  parts: string[];
  render: (written: string[]) => ReactNode;
  onDone: () => void;
}) {
  const words = parts.map((p) => p.split(/(\s+)/));
  const total = words.reduce((n, w) => n + w.length, 0);
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (count >= total) {
      if (!done.current) { done.current = true; onDone(); }
      return;
    }
    // Espaços entram junto com a palavra seguinte, sem gastar um tique.
    const id = window.setTimeout(() => setCount((c) => c + 2), WORD_MS);
    return () => window.clearTimeout(id);
  }, [count, total, onDone]);

  let left = count;
  const written = words.map((w) => {
    const take = Math.max(0, Math.min(w.length, left));
    left -= take;
    return w.slice(0, take).join('');
  });
  return <>{render(written)}</>;
}
