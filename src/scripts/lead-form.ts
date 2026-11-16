/**
 * Comportamento do formulário de lead compartilhado (`LeadForm.astro`), usado
 * pela seção de contato da home. O Radar pede os dados dentro do chat.
 *
 * - Todos os campos são obrigatórios. O e-mail precisa ser corporativo:
 *   domínios pessoais são recusados.
 * - O envio (backend, `campaign_id`, UTMs) e as validações moram em
 *   `lead-api.ts`, compartilhado com as perguntas de contato do Radar.
 * - `origem` identifica de onde veio o lead. Sem formato no formulário, o campo
 *   `curso` não vai.
 */
import { MSG_FAILED, MSG_INVALID, isPersonalEmail, maskPhone, phoneDigits, sendLead } from './lead-api';

export interface LeadFormOptions {
  /** Origem do lead no CRM. */
  origem?: string;
  /** Chamado depois do 202. */
  onSuccess?: () => void;
}

export function initLeadForm(root: HTMLElement, options: LeadFormOptions = {}) {
  const form = root.querySelector<HTMLFormElement>('[data-lead-form]');
  const success = root.querySelector<HTMLElement>('[data-lead-success]');
  const error = root.querySelector<HTMLElement>('[data-lead-error]');
  if (!form || !success || !error) return;

  const email = form.elements.namedItem('email') as HTMLInputElement;
  const whatsapp = form.elements.namedItem('whatsapp') as HTMLInputElement;
  const otherTool = form.querySelector<HTMLInputElement>('input[name="ferramentas"][value="Outra"]');
  const otherWrap = form.querySelector<HTMLElement>('[data-other-wrap]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const submitLabel = submit.querySelector<HTMLElement>('[data-label]')!;
  // Lido a cada envio: quem usa o formulário pode trocar o texto do botão.
  let idleLabel = submitLabel.textContent;

  email.addEventListener('input', () => {
    email.setCustomValidity(isPersonalEmail(email.value) ? 'Use seu e-mail corporativo.' : '');
  });

  // Máscara leve: (00) 0000-0000 ou (00) 00000-0000. Vazio cai no `required`.
  whatsapp.addEventListener('input', () => {
    const d = phoneDigits(whatsapp.value);
    whatsapp.value = maskPhone(whatsapp.value);
    whatsapp.setCustomValidity(d.length === 0 || d.length >= 10 ? '' : 'Informe o WhatsApp com DDD.');
  });

  // Checkbox não tem `required` de grupo: a validade fica no primeiro, que é
  // onde o navegador mostra o balão. "Outra" abre o campo para digitar qual,
  // obrigatório enquanto estiver marcada.
  const tools = [...form.querySelectorAll<HTMLInputElement>('input[name="ferramentas"]')];
  const otherText = form.elements.namedItem('ferramenta_outra') as HTMLInputElement | null;
  const checkTools = () => {
    tools[0]?.setCustomValidity(tools.some((tool) => tool.checked) ? '' : 'Marque pelo menos uma ferramenta.');
    const other = otherTool?.checked ?? false;
    if (otherWrap) otherWrap.hidden = !other;
    if (otherText) otherText.required = other;
  };
  tools.forEach((tool) => tool.addEventListener('change', checkTools));
  checkTools();

  // Mantém os nomes do contrato da página antiga (`funcionarios`, `curso`).
  // Campo vazio não vai no payload (quem filtra é o `sendLead`).
  const buildPayload = (): Record<string, string> => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const format = form.querySelector<HTMLInputElement>('input[name="formato"]:checked');
    const other = text('ferramenta_outra');
    const chosen = data.getAll('ferramentas').map((tool) => (tool === 'Outra' && other ? other : String(tool)));

    return {
      nome: text('nome'),
      email: text('email'),
      cargo: text('cargo'),
      whatsapp: text('whatsapp'),
      funcionarios: text('colaboradores'),
      curso: format?.dataset.label ?? '',
      ferramentas: chosen.join(', '),
      origem: options.origem ?? '',
    };
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

    idleLabel = submitLabel.textContent;
    setSending(true);
    const status = await sendLead(buildPayload());

    if (status !== 202) {
      setSending(false);
      showError(status === 400 ? MSG_INVALID : MSG_FAILED);
      return;
    }

    // A página antiga disparava aqui o evento Lead do pixel da Meta (`fbq`).
    // Este site não tem o pixel; se entrar, o disparo vem neste ponto.
    form.hidden = true;
    success.classList.replace('hidden', 'flex');
    success.focus();
    options.onSuccess?.();
  });
}
