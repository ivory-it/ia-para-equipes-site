/**
 * Formulário da seção de contato (`Contact.astro`).
 *
 * - Botões com `data-contact-plan` (os cards de investimento) marcam o formato
 *   no formulário antes do scroll até `#contato`. `?formato=` na URL faz o mesmo
 *   para links externos.
 * - Todos os campos são obrigatórios. O e-mail precisa ser corporativo:
 *   domínios pessoais são recusados.
 * - O envio vai para o receptor de leads da Ivory, o mesmo da página de
 *   capacitação descontinuada, com o mesmo `campaign_id`. O backend é dinâmico:
 *   aceita campos além de nome e e-mail. Sucesso é o status 202.
 */
const BACKEND_URL = 'https://func-ivory-lead-receiver-processor-prd-dpf5hgc2f5ddbff3.westus2-01.azurewebsites.net';
const CAMPAIGN_ID = 'capacitacao_ia';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.br', 'hotmail.com', 'outlook.com',
  'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br', 'r7.com', 'r7.com.br',
]);

const MSG_INVALID = 'Revise os campos e tente de novo.';
const MSG_FAILED = 'Não conseguimos enviar agora. Tente novamente em instantes.';

const form = document.querySelector<HTMLFormElement>('#contact-form');
const success = document.querySelector<HTMLElement>('#contact-success');
const error = document.querySelector<HTMLElement>('#contact-error');

if (form && success && error) {
  const email = form.elements.namedItem('email') as HTMLInputElement;
  const whatsapp = form.elements.namedItem('whatsapp') as HTMLInputElement;
  const otherTool = form.querySelector<HTMLInputElement>('input[name="ferramentas"][value="Outra"]');
  const otherWrap = form.querySelector<HTMLElement>('#contato-outra-wrap');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const submitLabel = submit.querySelector<HTMLElement>('[data-label]')!;
  const idleLabel = submitLabel.textContent;

  const selectFormat = (value: string | null) => {
    const radio = form.querySelector<HTMLInputElement>(`input[name="formato"][value="${value}"]`);
    if (radio) radio.checked = true;
  };

  document.addEventListener('click', (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-contact-plan]');
    if (trigger) selectFormat(trigger.dataset.contactPlan ?? null);
  });
  selectFormat(new URLSearchParams(location.search).get('formato'));

  email.addEventListener('input', () => {
    const domain = email.value.split('@')[1]?.trim().toLowerCase();
    email.setCustomValidity(domain && PERSONAL_DOMAINS.has(domain) ? 'Use seu e-mail corporativo.' : '');
  });

  // Máscara leve: (00) 0000-0000 ou (00) 00000-0000. Vazio cai no `required`.
  whatsapp.addEventListener('input', () => {
    const d = whatsapp.value.replace(/\D/g, '').slice(0, 11);
    const split = d.length > 10 ? 7 : 6;
    whatsapp.value =
      d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`
      : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
      : d.length ? `(${d}` : '';
    whatsapp.setCustomValidity(d.length === 0 || d.length >= 10 ? '' : 'Informe o WhatsApp com DDD.');
  });

  // Checkbox não tem `required` de grupo: a validade fica no primeiro, que é
  // onde o navegador mostra o balão. "Outra" abre o campo para digitar qual,
  // obrigatório enquanto estiver marcada.
  const tools = [...form.querySelectorAll<HTMLInputElement>('input[name="ferramentas"]')];
  const otherText = form.elements.namedItem('ferramenta_outra') as HTMLInputElement;
  const checkTools = () => {
    tools[0]?.setCustomValidity(tools.some((tool) => tool.checked) ? '' : 'Marque pelo menos uma ferramenta.');
    const other = otherTool?.checked ?? false;
    if (otherWrap) otherWrap.hidden = !other;
    otherText.required = other;
  };
  tools.forEach((tool) => tool.addEventListener('change', checkTools));
  checkTools();

  // Mantém os nomes do contrato da página antiga (`funcionarios`, `curso`).
  // Campo vazio não vai no payload.
  const buildPayload = (): Record<string, string> => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const format = form.querySelector<HTMLInputElement>('input[name="formato"]:checked');
    const other = text('ferramenta_outra');
    const tools = data.getAll('ferramentas').map((tool) => (tool === 'Outra' && other ? other : String(tool)));

    const payload: Record<string, string> = {
      campaign_id: CAMPAIGN_ID,
      nome: text('nome'),
      email: text('email'),
      cargo: text('cargo'),
      whatsapp: text('whatsapp'),
      funcionarios: text('colaboradores'),
      curso: format?.dataset.label ?? '',
      ferramentas: tools.join(', '),
    };
    const params = new URLSearchParams(location.search);
    for (const key of UTM_KEYS) payload[key] = params.get(key) ?? '';

    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value));
  };

  const showError = (message: string | null) => {
    error.hidden = !message;
    error.querySelector('[data-message]')!.textContent = message ?? '';
  };

  const setSending = (sending: boolean) => {
    submit.disabled = sending;
    submitLabel.textContent = sending ? 'Enviando…' : idleLabel;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    showError(null);
    if (!form.reportValidity()) return;

    setSending(true);
    const res = await fetch(`${BACKEND_URL}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    }).catch(() => null);

    if (res?.status !== 202) {
      setSending(false);
      showError(res?.status === 400 ? MSG_INVALID : MSG_FAILED);
      return;
    }

    // A página antiga disparava aqui o evento Lead do pixel da Meta (`fbq`).
    // Este site não tem o pixel; se entrar, o disparo vem neste ponto.
    form.hidden = true;
    success.classList.replace('hidden', 'flex');
    success.focus();
  });
}
