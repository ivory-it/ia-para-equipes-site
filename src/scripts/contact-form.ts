/**
 * Formulário da seção de contato (`Contact.astro`). Campos, validação e envio
 * são os do formulário compartilhado (`LeadForm.astro` + `lead-form.ts`), os
 * mesmos do Radar IA. Aqui fica só o que é da home:
 *
 * - Botões com `data-contact-plan` (os cards de investimento) marcam o formato
 *   no formulário antes do scroll até `#contato`. `?formato=` na URL faz o mesmo
 *   para links externos.
 */
import { initLeadForm } from './lead-form';

const root = document.querySelector<HTMLElement>('[data-lead-root="contato"]');

if (root) {
  const selectFormat = (value: string | null) => {
    const radio = root.querySelector<HTMLInputElement>(`input[name="formato"][value="${value}"]`);
    if (radio) radio.checked = true;
  };

  document.addEventListener('click', (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-contact-plan]');
    if (trigger) selectFormat(trigger.dataset.contactPlan ?? null);
  });
  selectFormat(new URLSearchParams(location.search).get('formato'));

  initLeadForm(root);
}
