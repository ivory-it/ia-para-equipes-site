/**
 * Preços dos planos.
 *
 * No HTML de origem o par Mensal/Anual eram dois botões sem nenhum JavaScript:
 * o toggle nunca funcionou, e por isso o plano anual nunca teve valores definidos
 * em lugar nenhum. Os números anuais abaixo aplicam a convenção mais comum do
 * mercado — **dois meses grátis**, ou seja, o mensal × 10 ÷ 12.
 *
 * >> Se a política comercial for outra, é aqui que se muda, e só aqui. <<
 */

export type BillingPeriod = 'monthly' | 'annual';

export interface Plan {
  /** casa com o `data-plan` no markup de Pricing.astro */
  id: string;
  price: Record<BillingPeriod, string>;
  /** sufixo ao lado do preço, que muda junto para explicar a cobrança */
  period: Record<BillingPeriod, string>;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'starter',
    price: { monthly: 'R$0', annual: 'R$0' },
    period: { monthly: '/ mês', annual: '/ mês' },
  },
  {
    id: 'pro',
    price: { monthly: 'R$12', annual: 'R$10' },
    period: { monthly: '/ usuário / mês', annual: '/ usuário / mês, no anual' },
  },
  {
    id: 'business',
    price: { monthly: 'R$29', annual: 'R$24' },
    period: { monthly: '/ usuário / mês', annual: '/ usuário / mês, no anual' },
  },
] as const;

export const BILLING_LABELS: Record<BillingPeriod, string> = {
  monthly: 'Mensal',
  annual: 'Anual',
};
