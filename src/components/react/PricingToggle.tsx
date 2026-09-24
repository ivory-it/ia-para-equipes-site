import { useEffect, useState } from 'react';
import { BILLING_LABELS, PLANS, type BillingPeriod } from '../../data/pricing';

/**
 * Alterna os preços entre cobrança mensal e anual.
 *
 * No HTML de origem estes eram dois botões decorativos, sem nenhum comportamento.
 *
 * A ilha controla **só o par de botões**. Os três cards de preço continuam sendo
 * HTML estático renderizado pelo Astro, e esta ilha atualiza o texto deles pelos
 * atributos `data-plan` / `data-price-*`. Não é um contorno: mover os cards para
 * dentro do React empacotaria ~100 linhas de markup puramente estático no bundle
 * do cliente, para hidratar conteúdo que nunca muda de forma. O que muda é o
 * preço — e é só isso que o JavaScript precisa tocar.
 *
 * Contrato com `Pricing.astro`:
 *   <span data-plan="pro" data-price-monthly="R$12" data-price-annual="R$10">
 *   <span data-plan="pro" data-period-monthly="/ mês" data-period-annual="…">
 */
export default function PricingToggle() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  useEffect(() => {
    for (const plan of PLANS) {
      const nodes = document.querySelectorAll<HTMLElement>(`[data-plan="${plan.id}"]`);
      for (const node of nodes) {
        const next = node.dataset[period === 'monthly' ? 'priceMonthly' : 'priceAnnual']
          ?? node.dataset[period === 'monthly' ? 'periodMonthly' : 'periodAnnual'];
        if (next !== undefined) node.textContent = next;
      }
    }
  }, [period]);

  return (
    <div
      className="mt-7 inline-flex rounded-full border border-ink/[0.15] bg-paper/[0.65] p-1 backdrop-blur-xl"
      role="group"
      aria-label="Periodicidade da cobrança"
    >
      {(Object.keys(BILLING_LABELS) as BillingPeriod[]).map((value) => {
        const active = period === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => setPeriod(value)}
            className={
              active
                ? 'h-10 rounded-full bg-accent-ink px-5 text-sm font-medium text-paper shadow-[0_12px_35px_rgba(10,37,64,0.08)] transition'
                : 'h-10 rounded-full px-5 text-sm font-medium text-ink-2 transition hover:text-ink'
            }
          >
            {BILLING_LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}
