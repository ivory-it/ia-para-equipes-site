/**
 * Extrai do @iconify-json/solar só os ícones que o Radar IA usa e grava
 * src/components/radar/icons.ts. O site usa Solar (via astro-icon); dentro da
 * ilha React o astro-icon não funciona, por isso a cópia.
 *
 *   node scripts/radar-icons.mjs
 *
 * Ícone novo: acrescente o nome (sem "-linear") em NAMES e rode de novo.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const set = JSON.parse(readFileSync(require.resolve('@iconify-json/solar/icons.json'), 'utf8'));

const NAMES = [
  // interface
  'arrow-right', 'arrow-left', 'arrow-down', 'arrow-up', 'download-minimalistic', 'list', 'radar-2', 'play',
  'alt-arrow-down', 'lightbulb', 'star-shine', 'info-circle',
  // desafios
  'users-group-rounded', 'widget-4', 'shield-warning', 'compass',
  // possibilidades, objetivos, caminho
  'server-square', 'alarm', 'folder-with-files', 'presentation-graph', 'bolt', 'medal-star', 'chart-2', 'share',
  'shield-check', 'layers', 'user', 'users-group-two-rounded', 'buildings-2', 'user-check', 'medal-ribbon',
  'checklist-minimalistic', 'stopwatch',
  // apresentação em PDF (deck 16:9)
  'check-circle', 'danger-triangle', 'flag', 'target', 'rocket-2', 'square-academic-cap', 'test-tube', 'graph-up',
  'clipboard-check', 'play-circle', 'hand-shake', 'filter', 'document-text', 'chat-round-dots', 'question-circle',
  'close-circle', 'refresh', 'calendar', 'pen-new-square', 'database', 'letter', 'chart-square', 'magic-stick-3',
  'user-speak', 'archive', 'lock-keyhole', 'eye', 'monitor',
];

const out = {};
for (const name of NAMES) {
  // Alguns nomes são apelidos (`aliases`) de outro ícone do conjunto.
  const key = `${name}-linear`;
  const icon = set.icons[key] ?? set.icons[set.aliases?.[key]?.parent];
  if (!icon) throw new Error(`Ícone Solar não encontrado: ${name}-linear`);
  out[name] = icon.body;
}

const body = `/* Gerado por scripts/radar-icons.mjs. Não edite à mão. Ícones Solar (linear), viewBox 0 0 24 24. */
export const SOLAR = ${JSON.stringify(out, null, 2)} as const;

export type SolarName = keyof typeof SOLAR;
`;
writeFileSync(new URL('../src/components/radar/icons.ts', import.meta.url), body);
console.log(`${NAMES.length} ícones gravados em src/components/radar/icons.ts`);
