/** Itens da navegação principal. Compartilhados entre o header em telas largas
 *  (Astro estático), o drawer mobile (ilha React) e a coluna Páginas do rodapé, para que não possam divergir. */
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  // Destinos ainda não definidos: '#' até as URLs chegarem.
  { label: 'Corporativa', href: '#' },
  { label: 'Desenvolvedores', href: '#' },
  { label: 'Jornada IA', href: '#' },
  { label: 'Blog', href: '#' },
] as const;
