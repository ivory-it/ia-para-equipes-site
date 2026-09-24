/**
 * Formulário da seção de contato (`Contact.astro`).
 *
 * - Botões com `data-contact-plan` (os cards de investimento) marcam o formato
 *   no formulário antes do scroll até `#contato`. `?formato=` na URL faz o mesmo
 *   para links externos.
 * - O e-mail precisa ser corporativo: domínios gratuitos são recusados.
 * - O envio ainda é simulado.
 *
 * >> Para integrar, troque CONTACT_ENDPOINT pela URL do serviço (Web3Forms,
 *    Formspree, uma Vercel Function...). O corpo sai como FormData. <<
 */
const CONTACT_ENDPOINT: string | null = null;

const FREE_DOMAINS = [
  'gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com',
  'yahoo.com', 'yahoo.com.br', 'icloud.com', 'bol.com.br', 'uol.com.br', 'terra.com.br',
];

const form = document.querySelector<HTMLFormElement>('#contact-form');
const success = document.querySelector<HTMLElement>('#contact-success');

if (form && success) {
  const email = form.elements.namedItem('email') as HTMLInputElement;
  const phone = form.elements.namedItem('telefone') as HTMLInputElement;

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
    email.setCustomValidity(domain && FREE_DOMAINS.includes(domain) ? 'Use seu e-mail corporativo.' : '');
  });

  // Máscara leve: (00) 0000-0000 ou (00) 00000-0000.
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 11);
    const split = d.length > 10 ? 7 : 6;
    phone.value =
      d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`
      : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
      : d.length ? `(${d}` : '';
    phone.setCustomValidity(d.length >= 10 ? '' : 'Informe o telefone com DDD.');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (CONTACT_ENDPOINT) {
      const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', body: new FormData(form) }).catch(() => null);
      if (!res?.ok) {
        alert('Não foi possível enviar agora. Tente de novo em alguns minutos.');
        return;
      }
    }

    form.hidden = true;
    success.classList.replace('hidden', 'flex');
    success.focus();
  });
}
