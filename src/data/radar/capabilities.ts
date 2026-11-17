/**
 * Telas 03 e 04 — a animação única das possibilidades (§5 do documento do
 * Radar IA v1.4). O vídeo é um só, igual para todos; o site só mostra o que vem
 * antes (Tela 03) e a pergunta depois (Tela 04).
 */
export type CapabilityId = 'sistemas' | 'agendadas' | 'arquivos' | 'entregas';

export interface Capability {
  id: CapabilityId;
  /** Nome do eixo no vídeo e no radar. */
  label: string;
  /** Opção da pergunta após o vídeo (§5.3). */
  option: string;
  /** Exemplo aplicável, usado no plano e no PDF. */
  example: string;
  /** Cuidado de precisão técnica (§5.5), usado no PDF. */
  caveat: string;
  /** Experimentação sugerida na Tela 05, sem pressupor integração pronta. */
  experiment: string;
  /** Início do capítulo no vídeo, em segundos (capitulos.txt do render v1, 2min56). */
  chapterStart: number;
  /** Mini fluxo "de onde vem → o que a IA entrega", no slide das possibilidades do PDF. */
  flow: { from: string; to: string };
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'sistemas',
    label: 'IA que conversa com sistemas',
    option: 'Conectar a IA aos sistemas corporativos e interagir com eles.',
    example: 'Consultar pedidos e chamados em sistemas autorizados e receber um resumo do que precisa de atenção.',
    caveat: 'Depende de conectores, permissões e compatibilidade. Consulta e escrita são operações diferentes, e alterações técnicas exigem validação profissional.',
    experiment: 'experimentar a consulta e a consolidação de informações em sistemas autorizados, sem pressupor que a integração já existe',
    chapterStart: 17,
    flow: { from: 'Pedidos e chamados', to: 'Resumo do que pede atenção' },
  },
  {
    id: 'agendadas',
    label: 'IA em tarefas programadas',
    option: 'Programar atividades recorrentes e receber resultados automaticamente.',
    example: 'Agendar uma análise semanal que identifica pendências e entrega um resumo toda segunda-feira.',
    caveat: 'Agendamento e acesso às fontes dependem da plataforma, do licenciamento, das autorizações e da configuração.',
    experiment: 'experimentar uma tarefa recorrente agendada, como um resumo semanal de pendências',
    chapterStart: 88,
    flow: { from: 'Toda segunda-feira', to: 'Resumo das pendências' },
  },
  {
    id: 'arquivos',
    label: 'IA que trabalha com arquivos',
    option: 'Trabalhar com documentos e arquivos diretamente do computador.',
    example: 'Consolidar planilhas mensais de uma pasta autorizada e gerar um relatório com as principais variações.',
    caveat: 'Acessar arquivos locais não significa processar tudo localmente. Requisitos de segurança e permissões precisam estar claros.',
    experiment: 'experimentar a consolidação de documentos e planilhas de uma pasta autorizada',
    chapterStart: 108,
    flow: { from: 'Planilhas da pasta', to: 'Relatório com as variações' },
  },
  {
    id: 'entregas',
    label: 'IA que produz entregas profissionais',
    option: 'Criar relatórios, apresentações e dashboards seguindo os padrões da empresa.',
    example: 'Ensinar à IA a identidade da empresa e gerar apresentações executivas com gráficos e recomendações.',
    caveat: 'Gerar relatórios e arquivos não equivale a implantar um dashboard interativo persistente, que pode exigir ferramentas e infraestrutura complementares.',
    experiment: 'experimentar um modelo reutilizável para relatórios ou apresentações no padrão da empresa',
    chapterStart: 128,
    flow: { from: 'Padrões da empresa', to: 'Apresentação executiva' },
  },
];

export const capabilityById = (id: CapabilityId) => CAPABILITIES.find((c) => c.id === id)!;

export const INTRO = {
  eyebrow: 'Tela 3 de 7 · A descoberta começa',
  title: 'E se a IA pudesse fazer muito mais do que responder perguntas?',
  dialogue: [
    { who: 'Profissional', text: 'Eu já uso IA para escrever e-mails, fazer resumos e tirar dúvidas. Mas o que mais ela consegue fazer?' },
    { who: 'IA', text: 'Bem mais do que você imagina. Posso te mostrar algumas possibilidades?' },
  ],
  next: 'Quero descobrir',
};

export const VIDEO_SCREEN = {
  eyebrow: 'Tela 4 de 7 · Possibilidades',
  title: 'A IA pode fazer muito mais do que você imagina.',
  /** Prepara a pergunta que vem depois do vídeo. */
  intro: 'Veja no vídeo quatro formas de usar IA no trabalho. Depois, me conte qual chamou mais sua atenção.',
  pending: 'Vídeo em produção',
  pendingText: 'A animação com as quatro possibilidades entra aqui em breve. Enquanto isso, conheça os quatro eixos abaixo e siga a jornada.',
  chaptersTitle: 'Capítulos',
  question: 'Qual dessas possibilidades mais chamou sua atenção?',
  hint: 'Selecione uma ou mais opções.',
  next: 'Adicionar essas possibilidades ao meu plano',
  finalTitle: 'E se sua equipe também soubesse trabalhar assim?',
};
