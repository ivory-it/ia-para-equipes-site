/**
 * Textos fixos do PDF executivo (§8 do documento do Radar IA v1.4). A Tela 07
 * saiu da conversa: o PDF é oferecido logo depois do cenário.
 */

/** Bloco 6 — próximos passos (§8.2). */
export const NEXT_STEPS = [
  'Validar o objetivo e as atividades candidatas com uma liderança ou área de negócio.',
  'Confirmar políticas de uso de IA, licenças e ferramentas disponíveis com TI/Segurança quando necessário.',
  'Definir o primeiro grupo de participantes.',
  'Realizar a capacitação e uma experimentação controlada.',
  'Avaliar resultados observados e próximos passos.',
];

/** Condições a validar (Bloco 4). */
export const CONDITIONS = [
  'Ferramentas aprovadas e licenças disponíveis para o grupo.',
  'Permissões de acesso às informações usadas na experimentação.',
  'Processo escolhido e forma de medir o antes e o depois.',
];

export const PDF = {
  fileName: 'Plano_de_Evolucao_IA',
  title: 'Plano de Evolução com IA',
  subtitle: 'Primeiros passos',
  defaultOrg: 'Sua organização',
  purpose: 'Um ponto de partida para desenvolver a equipe no uso de IA com propósito, segurança e aplicação prática.',
  footer: 'Plano inicial baseado nas informações declaradas pelo participante',
  brand: 'IA para Equipes by Ivory',
  basedOn: 'Este retrato se baseia em autodeclarações. Não é uma medição nem uma comparação de mercado.',
  videoCta: 'Assista novamente “A IA pode fazer muito mais do que você imagina”',
  ivorySupport: [
    'Capacitação IA para Equipes: diagnóstico prévio e duas sessões online de 2 horas, com até 50 pessoas por turma.',
    'Exemplos e atividades ligados à realidade das equipes.',
    'Apoio pós-capacitação, conforme contratação.',
  ],
  /** Contracapa institucional. Os endereços são os do rodapé do site. */
  backTitle: 'Vamos dar o próximo passo com a sua equipe.',
  backText: 'Capacitação corporativa em IA com segurança, governança e aplicação prática.',
  social: [
    { label: 'Site', text: 'iaparaequipes.com.br', href: 'https://iaparaequipes.com.br' },
    { label: 'LinkedIn', text: 'linkedin.com/company/iaparaequipes', href: 'https://www.linkedin.com/company/iaparaequipes/' },
    { label: 'Instagram', text: '@ia_paraequipes', href: 'https://www.instagram.com/ia_paraequipes/' },
  ],
};
