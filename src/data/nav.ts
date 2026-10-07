/** Itens da navegação principal. Compartilhados entre o header em telas largas
 *  (Astro estático), o drawer mobile (ilha React) e a coluna Páginas do rodapé, para que não possam divergir. */
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  // Por enquanto, âncoras das seções desta página. As páginas Corporativa,
  // Desenvolvedores, Jornada IA e Blog voltam ao menu quando existirem.
  { label: 'Por que capacitar', href: '#contexto' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Investimento', href: '#investimento' },
] as const;
