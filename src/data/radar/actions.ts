/**
 * Catálogo das ações que podem entrar no plano do Radar IA.
 *
 * Cada ação tem um id estável. Desde a v1.6 nada é salvo à mão: o plano junta
 * as ações das pílulas dos desafios marcados, do retrato e do objetivo, e o id
 * igual impede duplicar (§9.2). Para sugerir uma ação, aponte para o id daqui,
 * nunca repita o texto.
 */
export const ACTIONS = {
  // Tela 01 — Uso individual
  'mapear-aplicacoes': 'Mapear aplicações de IA que já existem na organização.',
  'biblioteca-praticas': 'Criar uma biblioteca corporativa de aplicações de IA.',
  'encontros-quinzenais': 'Implantar encontros quinzenais para compartilhar aplicações práticas de IA.',
  // Tela 01 — Pouca aplicação prática
  'priorizar-tres-atividades': 'Mapear e priorizar três atividades para experimentação com IA.',
  'experimento-com-sem-ia': 'Realizar um experimento comparando uma tarefa com e sem IA.',
  'desafios-praticos': 'Criar desafios práticos de IA relacionados às atividades das equipes.',
  // Tela 01 — Preocupação com segurança (antes "Segurança e governança")
  'politica-uso-ia': 'Estruturar ou revisar uma Política Corporativa de Uso de IA.',
  'checklist-uso-responsavel': 'Criar um checklist de uso responsável de IA para os colaboradores.',
  'exercicios-cenarios-ficticios': 'Realizar exercícios de uso responsável de IA com cenários fictícios.',
  // Tela 01 — Falta de direcionamento
  'primeira-atividade': 'Selecionar uma primeira atividade para experimentação com IA.',
  'objetivo-30-dias': 'Definir um objetivo prático de evolução com IA para os próximos 30 dias.',
  'piloto-indicadores': 'Estruturar um piloto de IA com objetivos e indicadores de acompanhamento.',
  // A Tela 02 não usa o catálogo: o retrato consultivo traz o próximo passo e as
  // duas ações complementares por combinação (src/data/radar/portrait.ts).
} as const;

export type ActionId = keyof typeof ACTIONS;

export const actionText = (id: ActionId) => ACTIONS[id];
