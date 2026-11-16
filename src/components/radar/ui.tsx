/**
 * Peças de interface do Radar IA.
 *
 * Ícones: os do conteúdo (desafios, pílulas, opções) são Solar, como no resto
 * do site, copiados para `icons.ts` por `scripts/radar-icons.mjs` (o astro-icon
 * não funciona dentro de uma ilha React). Os traços pequenos de interface
 * (check, mais, fechar) ficam aqui, desenhados no mesmo peso.
 */
import type { ReactNode } from 'react';
import { SOLAR, type SolarName } from './icons';

const paths = {
  check: 'm5 12.5 4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
} as const;

// Nomes curtos usados desde a primeira versão, apontando para o Solar.
const ALIAS = {
  arrowRight: 'arrow-right',
  arrowLeft: 'arrow-left',
  download: 'download-minimalistic',
  list: 'list',
  play: 'play',
  radar: 'radar-2',
} as const satisfies Record<string, SolarName>;

export type IconName = keyof typeof paths | keyof typeof ALIAS | SolarName;

export function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  const cls = `shrink-0 ${className}`;
  if (name in paths) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
        <path d={paths[name as keyof typeof paths]} />
      </svg>
    );
  }
  const solar = (ALIAS as Record<string, SolarName>)[name] ?? (name as SolarName);
  return <svg width={size} height={size} viewBox="0 0 24 24" className={cls} aria-hidden="true" dangerouslySetInnerHTML={{ __html: SOLAR[solar] }} />;
}

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] ${
      tone === 'accent' ? 'border-accent-ink/25 bg-accent/[0.1] text-accent-ink' : 'border-ink-soft/20 bg-ink/[0.06] text-ink'
    }`}>{children}</span>
  );
}

/** Selo com ícone num quadrado suave, usado em opções e pílulas. */
export function IconBadge({ name, size = 'md' }: { name: SolarName; size?: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'h-8 w-8 rounded-xl', md: 'h-10 w-10 rounded-2xl', lg: 'h-12 w-12 rounded-2xl' }[size];
  const icon = { sm: 16, md: 20, lg: 24 }[size];
  return (
    <span className={`flex shrink-0 items-center justify-center border border-accent-ink/15 bg-accent/[0.08] text-accent-ink ${box}`} aria-hidden="true">
      <Icon name={name} size={icon} />
    </span>
  );
}
