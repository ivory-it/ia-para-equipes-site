/** Itens da navegação principal. Compartilhados entre o header em telas largas
 *  (Astro estático), o drawer mobile (ilha React) e a coluna Páginas do rodapé, para que não possam divergir. */
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  // Por enquanto, âncoras das seções da home. As páginas Corporativa,
  // Desenvolvedores, Jornada IA e Blog voltam ao menu quando existirem.
  // Com `/` na frente porque o header também aparece nos materiais
  // (/materiais/...). Na home, mesmo caminho com hash continua sendo rolagem.
  { label: 'Por que capacitar', href: '/#contexto' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Experiência', href: '/#experiencia' },
  { label: 'Investimento', href: '/#investimento' },
  // Página própria: o diagnóstico (src/pages/diagnostico-ia/). Para o visitante,
  // "Diagnóstico IA"; "Radar IA" ficou só no código e na origem do CRM.
  { label: 'Diagnóstico IA', href: '/diagnostico-ia' },
  // Página própria: o índice dos materiais gratuitos (src/data/materiais/index.ts).
  { label: 'Materiais', href: '/materiais' },
] as const;
