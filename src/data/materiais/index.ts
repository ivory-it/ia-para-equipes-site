/** Materiais gratuitos listados em /materiais. Material novo: crie a página em
 *  src/pages/materiais/<slug>.astro, a capa 1200×630 em public/og/<slug>.png e
 *  acrescente a entrada aqui. O mais recente vai primeiro. */
export interface Material {
  slug: string;
  title: string;
  description: string;
  /** Ferramenta ou tema, mostrado na pílula do card. */
  tag: string;
  /** Formato do material, mostrado ao lado da pílula. */
  format: string;
  cover: string;
  coverAlt: string;
}

export const MATERIAIS: readonly Material[] = [
  {
    slug: 'radar-de-pendencias-copilot',
    title: 'Radar de Pendências com Microsoft Copilot',
    description:
      'Prompt pronto e passo a passo para o Copilot listar todo dia útil o que depende de você no Teams e no Outlook, por prioridade.',
    tag: 'Microsoft 365 Copilot',
    format: 'Prompt + passo a passo',
    cover: '/og/radar-de-pendencias-copilot.png',
    coverAlt: 'Capa do material Radar de Pendências com Microsoft Copilot',
  },
];
