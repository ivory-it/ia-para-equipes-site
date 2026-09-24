/**
 * Corta o markup já traduzido (`src/_ported.html`) nos componentes Astro, usando
 * como fronteira os comentários de seção que o próprio HTML já trazia.
 *
 * Roda uma vez, na migração. Fica no repositório como registro de qual trecho do
 * arquivo original virou qual componente.
 *
 *   node scripts/split-sections.mjs src/_ported.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const [, , inputPath] = process.argv;
const ROOT = 'src/components';

/** comentário no HTML → caminho do componente gerado */
const SECTIONS = [
  ['<!-- background-layers -->', 'BackgroundLayers.astro'],
  ['<!-- header -->', 'Header.astro'],
  ['<!-- hero -->', 'sections/Hero.astro'],
  ['<!-- product-preview -->', 'sections/ProductPreview.astro'],
  ['<!-- problem -->', 'sections/Problem.astro'],
  ['<!-- how-it-works -->', 'sections/HowItWorks.astro'],
  ['<!-- benefits -->', 'sections/Benefits.astro'],
  ['<!-- reviews -->', 'sections/Reviews.astro'],
  ['<!-- pricing -->', 'sections/Pricing.astro'],
  ['<!-- faq -->', 'sections/Faq.astro'],
  ['<!-- cta -->', 'sections/Cta.astro'],
  ['<!-- footer -->', 'Footer.astro'],
];

const raw = await readFile(inputPath, 'utf8');
const lines = raw.split('\n');

// CUIDADO: existem DOIS `<main>` no documento. Um envolve a página inteira e vira
// responsabilidade do layout — esse sai daqui. O outro é `<main class="p-5">`,
// parte do mockup de dashboard desenhado dentro do herói, e precisa ficar.
// Como os dois fecham com um `</main>` idêntico, filtrar por `</main>` remove o
// fechamento errado e deixa o mockup sem par. O corte é feito por posição: só o
// PRIMEIRO `<main>` (o da página) e o ÚLTIMO `</main>` saem.
const isOpen = (l) => l.trim() === '<main>';
const isClose = (l) => l.trim() === '</main>';
const pageOpen = lines.findIndex(isOpen);
const pageClose = lines.findLastIndex(isClose);
const drop = new Set([pageOpen, pageClose].filter((i) => i !== -1));
console.log(`removendo o <main> da página (linhas ${[...drop].join(', ')}); o <main class="p-5" do mockup fica`);

const index = new Map();
for (const [marker] of SECTIONS) {
  const at = lines.findIndex((l) => l.trim() === marker);
  if (at === -1) throw new Error(`marcador não encontrado: ${marker}`);
  index.set(marker, at);
}

for (const [i, [marker, file]] of SECTIONS.entries()) {
  const start = index.get(marker) + 1; // pula a própria linha do comentário
  const end = i + 1 < SECTIONS.length ? index.get(SECTIONS[i + 1][0]) : lines.length;

  const body = lines
    .slice(start, end)
    .filter((_, offset) => !drop.has(start + offset))
    .join('\n')
    .trim();

  const out = join(ROOT, file);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, body + '\n', 'utf8');
  console.log(`${String(body.split('\n').length).padStart(4)} linhas → ${out}`);
}
