/**
 * Perguntas de contato do Radar, feitas dentro do chat depois do cenário, no
 * lugar do modal com formulário (decisão do Thiago, 11/11/2026: na conversa a
 * pessoa já está no ritmo de responder, e cada pergunta é pequena).
 *
 * Quem chega com o token de acesso (`?access=`) pula estas perguntas.
 */
export type RoleId = 'diretoria' | 'gestao' | 'rh' | 'ti' | 'outro';

/** Cargo em opções: mais rápido no toque e padronizado no CRM. "Outro" abre o texto. */
export const ROLES: { id: RoleId; label: string }[] = [
  { id: 'diretoria', label: 'Diretoria ou C-level' },
  { id: 'gestao', label: 'Gestão de área' },
  { id: 'rh', label: 'RH ou T&D' },
  { id: 'ti', label: 'TI' },
  { id: 'outro', label: 'Outro' },
];

export const CONTACT = {
  nameTitle: 'Seu plano está quase pronto. Como posso te chamar?',
  privacy: 'Usamos seus dados só para enviar o plano e responder ao seu contato. As respostas do diagnóstico vão junto.',
  namePlaceholder: 'Seu nome',
  roleTitle: (first: string) => `Prazer, ${first}. Qual é o seu cargo?`,
  roleOtherTitle: 'Qual é o seu cargo?',
  roleOtherPlaceholder: 'Seu cargo',
  emailTitle: 'Qual é o seu e-mail corporativo?',
  emailPlaceholder: 'voce@empresa.com.br',
  phoneTitle: 'E o seu WhatsApp, com DDD?',
  phonePlaceholder: '(00) 00000-0000',
  delivery: (first: string) => `Obrigado, ${first}. Estou gerando o seu plano em PDF.`,
  nameError: 'Escreva seu nome para continuar.',
  roleError: 'Escreva seu cargo para continuar.',
};

/** Primeiro nome, para as falas do Radar. */
export const firstName = (nome: string) => nome.trim().split(/\s+/)[0] ?? '';
