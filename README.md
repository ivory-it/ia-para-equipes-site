# Pulsedesk — landing page

Landing page do Pulsedesk com a identidade visual **IA para Equipes by Ivory** aplicada.
Portada de um `design-system.html` de arquivo único para um projeto Astro.

> **Vai mexer no conteúdo?** Leia o [AGENTS.md](AGENTS.md) primeiro. Este README cobre como
> rodar e publicar; o AGENTS.md cobre onde o copy mora, quais são as fontes de conteúdo já
> escritas, e o que a marca e o contexto de prevenda proíbem afirmar.

## Stack

| | |
|---|---|
| **Astro 7** | site estático, zero JavaScript por padrão |
| **TypeScript** | modo estrito, com `noUncheckedIndexedAccess` |
| **Tailwind CSS 4** | configuração em CSS (`@theme`), pelo plugin do Vite |
| **React 19** | só nas duas ilhas que precisam de estado |
| **GSAP 3** | scroll-reveal |

## Comandos

```bash
npm install
npm run dev       # servidor de desenvolvimento em localhost:4321
npm run check     # type-check (tsc --noEmit)
npm run build     # check + build estático em dist/
npm run preview   # serve o dist/ localmente
```

## Deploy na Vercel

O site é **estático** — não precisa de adapter. A Vercel detecta o Astro sozinha, e o
`vercel.json` já traz os headers de cache e de segurança.

1. Crie um repositório e envie este diretório:
   ```bash
   git remote add origin git@github.com:SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. Framework: **Astro**.
3. Antes do primeiro deploy, defina a variável de ambiente `SITE_URL` com o domínio final
   (ex.: `https://pulsedesk.com.br`). É dela que saem as URLs absolutas do sitemap e das
   tags Open Graph. Sem ela, vale o valor padrão em `astro.config.mjs`.

Cada push na branch principal publica automaticamente.

## Estrutura

```
src/
├── layouts/Base.astro          <head>, fontes, header, footer
├── pages/index.astro           compõe as nove seções
├── components/
│   ├── Header.astro  Footer.astro  BackgroundLayers.astro
│   ├── sections/               uma seção por arquivo
│   └── react/                  as duas ilhas
├── scripts/
│   └── reveal.ts               scroll-reveal e header (GSAP)
├── data/                       nav.ts, pricing.ts
└── styles/global.css           tokens da marca em @theme
```

## Decisões que valem saber

**Tokens semânticos.** As cores da marca são nomes, não tons de paleta: `text-ink`,
`text-ink-soft`, `bg-accent-ink`, `bg-surface`, `bg-paper`. Estão definidas em
`src/styles/global.css`, dentro de `@theme`. O contraste de cada uma sobre o fundo está
anotado ali — em especial, **o turquesa (`accent`) nunca vai em texto**: ele dá 2,7:1 sobre
o cinza base e só serve para preenchimento, ponto, barra e brilho.

**Fundo do herói só em CSS.** Havia uma cena animada em Three.js atrás do herói. Saiu
porque chamava mais atenção que o título; com ela foram embora 158 KB comprimidos de
JavaScript. O fundo que fica é o do sistema da marca (§3): cinza, malha, grão, varredura
de luz diagonal e névoa turquesa.

**As duas ilhas React.** No HTML de origem o alternador Mensal/Anual e o botão de menu
eram decorativos: nenhum dos dois tinha JavaScript, e abaixo de `md` a página simplesmente
não tinha navegação. Agora funcionam. O React entra com `client:idle`, depois que a página
já está utilizável — mas custa cerca de 67 KB comprimidos de runtime para ~4 KB de
componente. Se esse peso incomodar, os dois se reescrevem sem framework.

**Preço anual.** Os valores do plano anual aplicam a convenção de **dois meses grátis**
(mensal × 10 ÷ 12), porque o toggle nunca funcionou e esses números não existiam em lugar
nenhum. Se a política comercial for outra, muda-se em `src/data/pricing.ts` — e só ali.

**Type-check.** `astro check` ainda não roda com TypeScript 7 (ele exige TS 6), então
`npm run check` usa `tsc --noEmit`: cobre `.ts` e `.tsx` em modo estrito, mas não o
frontmatter dos `.astro` — que aqui são imports e duas constantes. Quando o
`@astrojs/ts-content-mapper` sair do experimental (pede TS 7.1+), vale voltar a checar tudo.

## Migração

Os dois scripts em `scripts/` rodaram uma vez, na conversão do HTML original, e ficam no
repositório como registro auditável:

- `port-markup.mjs` — traduz as classes do Tailwind 3 com paletas remapeadas para o
  Tailwind 4 com tokens semânticos. Falha o build se sobrar qualquer classe da paleta antiga.
- `split-sections.mjs` — corta o HTML nos componentes, usando como fronteira os comentários
  de seção que o arquivo já trazia.
