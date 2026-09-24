import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../data/nav';

/**
 * Navegação em telas pequenas.
 *
 * No HTML de origem havia um botão com `aria-label="Abrir menu"` e nenhum
 * comportamento: abaixo de `md` a página simplesmente **não tinha navegação**.
 * Este componente fecha essa lacuna.
 *
 * Acessibilidade: `aria-expanded` no gatilho, foco devolvido a ele ao fechar,
 * `Esc` fecha, e o foco fica preso dentro do painel enquanto ele está aberto —
 * sem isso o Tab escaparia para o conteúdo atrás, que continua visível.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fechar SEMPRE devolve o foco ao gatilho. Se o Esc apenas mudasse o estado, o
  // foco ficaria no elemento que acabou de ser desmontado e o navegador o jogaria
  // no <body> — quem navega por teclado perderia o lugar e teria de tabular a
  // página inteira de novo.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // A página atrás não deve rolar enquanto o painel está aberto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusables?.length) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/[0.12] bg-paper/[0.65] text-ink-2 transition hover:border-ink/[0.22] hover:text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={close}
            className="absolute inset-0 bg-ink/20 backdrop-blur-xs"
          />

          <div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navegação"
            className="absolute inset-x-4 top-4 rounded-[2rem] border border-ink/[0.12] bg-paper/95 p-6 shadow-[0_30px_60px_-15px_rgba(10,37,64,0.18)] backdrop-blur-2xl"
          >
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition hover:bg-ink/[0.04] hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
