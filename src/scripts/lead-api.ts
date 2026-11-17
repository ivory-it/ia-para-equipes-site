/**
 * Envio ao receptor de leads da Ivory (que repassa ao Pipedrive) e as regras de
 * validação dos campos de contato. Compartilhado pelo formulário da home
 * (`lead-form.ts`) e pelas perguntas de contato do Radar, feitas no chat.
 *
 * - Mesmo backend e `campaign_id` da página de capacitação descontinuada.
 * - O backend é dinâmico: aceita campos além de nome e e-mail.
 * - Sucesso é o status 202.
 *
 * Sem DOM além de `location` e `fetch` (só em `sendLead`), para a checagem
 * (`scripts/radar-engine-check.ts`) importar as validações com o `node`.
 */
export const BACKEND_URL = 'https://func-ivory-lead-receiver-processor-prd-dpf5hgc2f5ddbff3.westus2-01.azurewebsites.net';
export const CAMPAIGN_ID = 'capacitacao_ia';
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
/** Canal padrão quando a URL não traz nenhuma UTM (17/11/2026, decisão do Thiago). */
export const UTM_DEFAULT = { utm_source: 'LP', utm_medium: 'organico' };

export const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.br', 'hotmail.com', 'outlook.com',
  'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br', 'r7.com', 'r7.com.br',
]);

/**
 * Ambiente local (dev ou preview). O backend não libera `localhost` no CORS, e
 * o envio sempre falha: o Radar libera o PDF mesmo assim, só aqui, para testar.
 */
export const isLocalHost = (hostname: string) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);
export const MSG_LOCAL = 'Ambiente local: o envio do lead falhou (CORS) e o PDF foi liberado para teste.';

export const MSG_INVALID = 'Revise os campos e tente de novo.';
export const MSG_FAILED = 'Não conseguimos enviar agora. Tente novamente em instantes.';

export const isPersonalEmail = (email: string) =>
  PERSONAL_DOMAINS.has(email.split('@')[1]?.trim().toLowerCase() ?? '');

/** E-mail com formato válido e domínio corporativo. Devolve a mensagem de erro, ou null. */
export function emailError(email: string): string | null {
  const v = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Confira o e-mail: ele parece incompleto.';
  if (isPersonalEmail(v)) return 'Use seu e-mail corporativo.';
  return null;
}

export const phoneDigits = (value: string) => value.replace(/\D/g, '').slice(0, 11);

/** Máscara leve: (00) 0000-0000 ou (00) 00000-0000. */
export function maskPhone(value: string): string {
  const d = phoneDigits(value);
  const split = d.length > 10 ? 7 : 6;
  return d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`
    : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
      : d.length ? `(${d}` : '';
}

export function phoneError(value: string): string | null {
  const n = phoneDigits(value).length;
  return n >= 10 ? null : 'Informe o WhatsApp com DDD.';
}

/**
 * Envia o lead: junta o `campaign_id` e as UTMs da URL e tira os campos vazios.
 * Devolve o status HTTP, ou `null` em falha de rede.
 */
export async function sendLead(fields: Record<string, string>): Promise<number | null> {
  const payload: Record<string, string> = { campaign_id: CAMPAIGN_ID, ...fields };
  const params = new URLSearchParams(location.search);
  for (const key of UTM_KEYS) payload[key] = params.get(key) ?? '';
  // Sem nenhuma UTM na URL, o lead vai como LP / organico. Com ao menos uma, só a da URL.
  if (UTM_KEYS.every((key) => !payload[key]?.trim())) Object.assign(payload, UTM_DEFAULT);
  const body = Object.fromEntries(Object.entries(payload).filter(([, v]) => v && v.trim()));
  const res = await fetch(`${BACKEND_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => null);
  return res?.status ?? null;
}
