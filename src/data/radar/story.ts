/**
 * Textos fixos do plano em PDF, uma apresentação 16:9 (desde 16/11/2026).
 *
 * Voz de consultoria (pedido do Thiago, 16/11/2026): a IA para Equipes entrega à
 * empresa a leitura e a recomendação ("identificamos", "recomendamos", "a
 * empresa"). Não é mais a pessoa apresentando em nome da empresa. Um slide por
 * mensagem, o título já é a conclusão e a régua do topo mostra a jornada.
 */

/** As quatro etapas da régua do topo dos slides. */
export const DECK_STAGES = ['Onde a empresa está', 'O que identificamos', 'O que é possível', 'O que recomendamos'] as const;

const COUNT = ['', 'um', 'dois', 'três', 'quatro'];

export const DECK = {
  preparedFor: 'Preparado para',
  preparedBy: 'por IA para Equipes by Ivory',
  challengesTitle: (n: number) => n === 1 ? 'A empresa reconhece um desafio no uso de IA' : `A empresa reconhece ${COUNT[n] ?? n} desafios no uso de IA`,
  portraitTitle: 'O retrato da empresa em quatro dimensões',
  portraitCenter: ['Retrato', 'atual'],
  portraitNote: 'Baseado nas respostas do diagnóstico. Não é uma medição.',
  insightLabel: 'Nossa leitura',
  insightTheme: 'Tema',
  balanceTitle: { favor: 'O que joga a favor e o que pede atenção', descobrir: 'O que falta descobrir e o que pede atenção' },
  favorLabel: 'Joga a favor',
  discoverLabel: 'Falta descobrir',
  attentionLabel: 'Pede atenção',
  capabilitiesTitle: 'O que a IA já pode fazer no trabalho da empresa',
  capabilityPicked: 'Chamou a atenção',
  capabilitiesNote: 'Cada possibilidade depende de licença, configuração e permissões.',
  videoLabel: 'Assista ao vídeo',
  videoTitle: 'A IA pode fazer muito mais do que você imagina',
  goalTitle: 'Aonde a empresa quer chegar',
  goalLabel: 'Objetivo',
  signalLabel: 'Como perceber que deu certo',
  groupLabel: 'Primeiro grupo a capacitar',
  toolsLabel: 'Ferramenta de IA',
  // "O que recomendamos": a capacitação como o site apresenta (Structure.astro,
  // seção "Como funciona"). Se o site mudar, mude aqui também.
  recommendTitle: 'Recomendamos a capacitação IA para Equipes',
  facts: [
    { icon: 'calendar', title: 'Formato', lead: [[['2 encontros', true], [' ao vivo', false]], [['de ', false], ['2 horas', true], [' cada', false]]], detail: 'Formato enxuto e de baixa fricção para a agenda das equipes.' },
    { icon: 'users-group-rounded', title: 'Turma', lead: [[['Até 50 participantes', true]], [['por turma', false]]], detail: 'Ideal para formar uma referência comum entre áreas e equipes.' },
    { icon: 'monitor', title: 'Modalidade', lead: [[['Online', true], [' (via Teams)', false]]], detail: 'Facilita a adesão, elimina deslocamentos e permite participação de diferentes unidades e localidades.' },
    { icon: 'layers', title: 'Ferramentas', lead: [[['Nas ferramentas ', false], ['oficiais', true]], [['da empresa', false]]], detail: '' },
  ] as { icon: string; title: string; lead: [string, boolean][][]; detail: string }[],
  otherTools: 'ou outras soluções homologadas',
  groupNote: (_group: string) => 'Para vocês: 1 turma',
  groupNoteLarge: 'Para vocês: turmas de até 50, definidas juntos',
  competenciesLabel: 'Para o objetivo de vocês, a equipe desenvolve',
  journeyTitle: 'Como a capacitação se estrutura',
  journeyLead: 'Um formato corporativo, enxuto e aplicável, desenhado para criar base comum e orientar o uso das ferramentas oficiais da empresa.',
  journey: [
    { label: 'Etapa 01', when: 'Após a contratação', title: 'Diagnóstico de maturidade', detail: 'Os participantes respondem a uma pesquisa antes das sessões.', prep: true, examples: false },
    { label: 'Etapa 02', when: '2 horas', title: 'Sessão 1 · Fundamentos', detail: 'Como a IA funciona, onde ela agrega valor e como usá-la com segurança, geração de bons contextos/prompts e validação das respostas.', prep: false, examples: false },
    { label: 'Etapa 03', when: '2 horas', title: 'Sessão 2 · Aplicação', detail: 'Demonstração de um fluxo de trabalho simulado explorando funcionalidades básicas/avançadas das ferramentas.', prep: false, examples: true },
  ],
  withYourExamples: 'Com exemplos de vocês:',
  appendixLabel: 'Apêndice · Como colocar em prática',
  appendixTitle: 'Como colocar em prática',
  appendixIntro: (n: number) => `Reunimos ${n} práticas para os desafios que a empresa reconheceu. Cada uma traz um modelo pronto para aplicar e a ação que entra no plano.`,
  appendixHowTo: ['A etapa e a ideia central', 'O modelo pronto para usar', 'O resultado e a ação do plano'],
  appendixAction: 'Entra no plano',
} as const;

export const PDF = {
  fileName: 'Plano_de_Evolucao_IA',
  title: 'Plano de Evolução com IA',
  subtitle: 'Primeiros passos',
  defaultOrg: 'Sua organização',
  purpose: 'Um ponto de partida para desenvolver a equipe no uso de IA com propósito, segurança e aplicação prática.',
  footer: 'Plano inicial baseado nas informações declaradas pelo participante',
  brand: 'IA para Equipes by Ivory',
  basedOn: 'Este retrato se baseia em autodeclarações. Não é uma medição nem uma comparação de mercado.',
  /** Contracapa institucional. Os endereços são os do rodapé do site. */
  backTitle: 'Vamos dar o próximo passo com a sua equipe.',
  backText: 'Capacitação corporativa em IA com segurança, governança e aplicação prática.',
  social: [
    { label: 'Site', text: 'iaparaequipes.com.br', href: 'https://iaparaequipes.com.br' },
    { label: 'LinkedIn', text: 'linkedin.com/company/iaparaequipes', href: 'https://www.linkedin.com/company/iaparaequipes/' },
    { label: 'Instagram', text: '@ia_paraequipes', href: 'https://www.instagram.com/ia_paraequipes/' },
  ],
};
