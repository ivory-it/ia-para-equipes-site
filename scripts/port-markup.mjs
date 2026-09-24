/**
 * Transforma o markup do `design-system.html` (Tailwind 3 + paletas remapeadas em
 * runtime) no markup que o projeto Astro usa (Tailwind 4 + tokens semânticos).
 *
 * Não é um utilitário de produção — roda uma vez, na migração, e fica no repositório
 * como registro auditável de COMO cada classe foi traduzida. O mapa abaixo é o mesmo
 * que vivia no bloco `tailwind.config` do HTML antigo, só que agora com nomes que
 * dizem o que a cor é.
 *
 *   node scripts/port-markup.mjs ../design-system.html src/_ported.html
 */
import { readFile, writeFile } from 'node:fs/promises';

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('uso: node scripts/port-markup.mjs <entrada.html> <saida.html>');
  process.exit(1);
}

/** Famílias do Tailwind → tokens da marca, por tom.
 *  A ordem dentro de cada família importa: os tons são aplicados do maior para o
 *  menor para que `cyan-500` seja substituído antes de `cyan-50`, que é seu prefixo. */
const PALETTE = {
  // rampa neutra, que no tema escuro era clara-sobre-escura e foi invertida
  slate: {
    950: 'paper', 900: 'ink', 800: 'mist', 700: 'placeholder', 600: 'marker',
    500: 'ink-soft', 400: 'ink-soft', 300: 'ink-2', 200: 'ink', 100: 'ink', 50: 'ink',
  },
  // eixo verde-turquesa: o acento da marca
  cyan: {
    950: 'ink', 900: 'ink', 800: 'accent-ink', 700: 'accent-ink', 600: 'accent-ink',
    500: 'accent', 400: 'accent', 300: 'accent-ink', 200: 'accent-ink',
    100: 'accent-ink', 50: 'accent-ink-strong',
  },
  emerald: {
    950: 'ink', 900: 'ink', 800: 'accent-ink', 700: 'accent-ink', 600: 'accent-ink',
    500: 'accent-ink', 400: 'accent', 300: 'accent-ink', 200: 'accent-ink',
    100: 'accent-ink', 50: 'accent-ink-strong',
  },
  teal: {
    950: 'ink', 900: 'ink', 800: 'accent-ink', 700: 'accent-ink', 600: 'accent-ink',
    500: 'accent', 400: 'accent', 300: 'accent-ink', 200: 'accent-ink',
    100: 'accent-ink', 50: 'accent-ink-strong',
  },
  // tudo que era outro matiz vira tinta e cinza — anti-rainbow (§11)
  blue: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink-soft', 300: 'ink-2', 200: 'ink', 100: 'ink', 50: 'ink',
  },
  sky: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink', 300: 'ink-2', 200: 'ink', 100: 'ink', 50: 'ink',
  },
  indigo: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink-2', 300: 'ink-2', 200: 'ink', 100: 'ink', 50: 'ink',
  },
  violet: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink-2', 300: 'ink-2', 200: 'ink', 100: 'ink', 50: 'ink',
  },
  amber: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink-soft', 500: 'ink-soft',
    400: 'ink-soft', 300: 'ink-soft', 200: 'ink-soft', 100: 'marker', 50: 'marker',
  },
  rose: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink', 300: 'ink', 200: 'ink-2', 100: 'marker', 50: 'marker',
  },
  orange: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink-soft',
    400: 'ink-soft', 300: 'ink-soft', 200: 'marker', 100: 'marker', 50: 'marker',
  },
  red: {
    950: 'ink', 900: 'ink', 800: 'ink', 700: 'ink', 600: 'ink', 500: 'ink',
    400: 'ink-2', 300: 'ink-2', 200: 'ink-2', 100: 'marker', 50: 'marker',
  },
};

/** Tokens que o HTML antigo já declarava com prefixo `iae-`. */
const IAE = {
  'iae-navy': 'ink',
  'iae-turquoise': 'accent',
  'iae-green': 'accent-ink',
  'iae-gray-base': 'surface',
  'iae-gray-mist': 'mist',
  'iae-gray-text': 'ink-soft',
  'iae-white': 'paper',
};

/** Utilitárias que o Tailwind 4 renomeou na escala padrão. */
const V4_RENAMES = [
  [/\bshadow-sm\b/g, 'shadow-xs'],
  [/\bblur-sm\b/g, 'blur-xs'],
  [/\bbg-gradient-to-/g, 'bg-linear-to-'],
];

/** Classes que não fazem nada e não sobrevivem à migração. */
const DEAD_CLASSES = [
  // Nunca foi definida em CSS nenhum: três elementos carregam essa classe e ela
  // não produz animação alguma.
  'animate-float-3d',
  // Só existia para o loop requestAnimationFrame pintar uma sombra preta dura,
  // herdada do tema escuro. O GSAP assumiu, e a sombra agora vem do Tailwind.
  'floating-panel',
  // Entrada em CSS, substituída pelo scroll-reveal do GSAP — manter as duas
  // faria o elemento animar duas vezes.
  '[animation:animationIn_0.8s_ease-out_0.1s_both]',
  // Apelidos de fonte herdados: Poppins agora é o padrão do documento.
  'font-geist',
  'font-sans',
];

let html = await readFile(inputPath, 'utf8');

// Só interessa o conteúdo do <body>; o <head> é reconstruído pelo layout Astro.
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
if (!bodyMatch?.[1]) throw new Error('não encontrei o <body> no arquivo de entrada');
let out = bodyMatch[1];

const report = [];
const swap = (pattern, replacement, label) => {
  const before = out;
  out = out.replace(pattern, replacement);
  const count = (before.match(pattern) ?? []).length;
  if (count) report.push(`${String(count).padStart(4)}  ${label}`);
};

// 1. paletas → tokens semânticos, do tom maior para o menor
for (const [family, shades] of Object.entries(PALETTE)) {
  for (const shade of Object.keys(shades).sort((a, b) => Number(b) - Number(a))) {
    swap(
      new RegExp(`-${family}-${shade}\\b`, 'g'),
      `-${shades[shade]}`,
      `${family}-${shade} → ${shades[shade]}`
    );
  }
}

// 2. tokens iae-* → nomes semânticos
for (const [from, to] of Object.entries(IAE)) {
  swap(new RegExp(`-${from}\\b`, 'g'), `-${to}`, `${from} → ${to}`);
}

// 3. branco → papel (é a mesma cor; o nome é que passa a dizer o papel dela)
for (const prefix of ['bg', 'border', 'text', 'from', 'via', 'to', 'divide', 'ring']) {
  swap(new RegExp(`\\b${prefix}-white\\b`, 'g'), `${prefix}-paper`, `${prefix}-white → ${prefix}-paper`);
}

// 4. renomeações do Tailwind 4
for (const [pattern, replacement] of V4_RENAMES) {
  swap(pattern, replacement, `v4: ${pattern.source} → ${replacement}`);
}
// `rounded` pelado virou `rounded-sm` no v4. Precisa de borda de palavra dos dois
// lados para não pegar `rounded-full`, `rounded-xl` e companhia.
swap(/\brounded(?=[\s"])/g, 'rounded-sm', 'v4: rounded → rounded-sm');

// 5. a fonte de título deixa de ser um apelido herdado
swap(/\bfont-jakarta\b/g, 'font-display', 'font-jakarta → font-display');

// 6. classes mortas.
// Delimitamos por lookbehind/lookahead de aspas ou espaço em vez de `\b`: a classe
// `[animation:...]` começa com colchete, e entre um espaço e um colchete não existe
// borda de palavra nenhuma — `\b` simplesmente nunca casaria ali.
for (const cls of DEAD_CLASSES) {
  const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  swap(new RegExp(`(?<=["\\s])${escaped}(?=[\\s"])`, 'g'), '', `remove: ${cls}`);
}
// A remoção deixa espaços duplos dentro dos atributos class; normaliza.
out = out.replace(/class="([^"]*)"/g, (_, value) => `class="${value.replace(/\s+/g, ' ').trim()}"`);

// 7. o <meta preview-ready-after-ms> e os <script> do HTML antigo não vêm junto
out = out.replace(/<!--\s*js\s*-->[\s\S]*$/, '').trimEnd();
out = out.replace(/<script[\s\S]*?<\/script>/g, '');

console.log('--- substituições ---');
console.log(report.join('\n'));

// 8. asserção: nada da paleta antiga pode ter sobrado
const families = [...Object.keys(PALETTE), 'iae'].join('|');
const leftovers = out.match(new RegExp(`-(?:${families})-[a-z0-9-]+`, 'g'));
if (leftovers) {
  const unique = [...new Set(leftovers)];
  console.error(`\nFALHOU: ${unique.length} classe(s) da paleta antiga sobraram:`);
  console.error(unique.join(' '));
  process.exit(1);
}
for (const cls of [...DEAD_CLASSES, 'font-geist']) {
  if (out.includes(cls)) {
    console.error(`\nFALHOU: a classe morta "${cls}" ainda está no markup`);
    process.exit(1);
  }
}

await writeFile(outputPath, out, 'utf8');
console.log(`\nOK — nenhuma classe da paleta antiga sobrou.`);
console.log(`escrito: ${outputPath} (${out.length} bytes)`);
