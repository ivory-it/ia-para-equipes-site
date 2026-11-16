// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Domínio do site (11/11/2026). É daqui que saem as URLs absolutas do sitemap, das
// tags Open Graph e do link/QR do vídeo no PDF do Radar. `SITE_URL` sobrescreve.
const SITE = process.env.SITE_URL ?? 'https://iaparaequipes.com.br';

export default defineConfig({
  site: SITE,

  // O site continua estático: toda página é pré-renderizada. O adapter existe só
  // para a rota `/api/radar/verify-access`, que valida o token de acesso do
  // Radar IA com um segredo do servidor (`export const prerender = false`).
  output: 'static',
  adapter: vercel(),

  // A ferramenta saiu de /radar para /diagnostico-ia (11/11/2026). O /radar em
  // si é uma página (src/pages/radar/index.astro) que repassa a query: este
  // redirect descartaria o ?access= dos links já divulgados.
  redirects: {
    '/radar/video': '/diagnostico-ia/video',
  },

  integrations: [
    react(),

    // `include` restringe o que entra no build: só os ícones que a página usa de
    // verdade, inlinados como SVG. Sem essa lista, o astro-icon ficaria livre para
    // puxar qualquer coisa do conjunto Solar. Ícone novo precisa entrar aqui.
    icon({
      include: {
        solar: [
          'arrow-right-linear',
          'checklist-minimalistic-linear',
          'hamburger-menu-linear',
          'close-circle-linear',
          // Fatos da oferta na Hero
          'users-group-rounded-linear',
          'monitor-camera-linear',
          'wallet-money-linear',
          // Seção "Por que esta capacitação": uso individual → prática corporativa
          'question-circle-linear',
          'shield-warning-linear',
          'widget-linear',
          'square-academic-cap-linear',
          'book-2-linear',
          'shield-check-linear',
          'chart-2-linear',
          'check-circle-linear',
          // Seção "Como funciona": cards de formato e jornada
          'calendar-linear',
          'laptop-linear',
          'settings-minimalistic-linear',
          // Erro de envio do formulário de contato
          'danger-circle-linear',
          // Material gratuito: Radar de Pendências (/materiais/...)
          'copy-linear',
          'alt-arrow-down-linear',
          'arrow-down-linear',
          'arrow-left-linear',
          'magnifier-zoom-in-linear',
          'lightbulb-linear',
          'letter-linear',
          'checklist-linear',
        ],
      },
    }),

    // /radar/ é só o redirecionamento para /diagnostico-ia: fica fora do sitemap.
    sitemap({ filter: (page) => !page.endsWith('/radar/') }),
  ],

  // Tailwind 4 entra como plugin do Vite. O `@astrojs/tailwind` virou legado,
  // reservado a quem ainda está no Tailwind 3.
  vite: {
    plugins: [tailwindcss()],
    // Dependências do Radar IA. O PDF importa as duas primeiras só no clique; as
    // demais vêm do AI Elements e do Motion. Sem pré-otimizar na partida, o Vite
    // as descobre no meio da sessão, refaz as dependências e a página fica com
    // dois Reacts (504 "Outdated Optimize Dep" e as ilhas somem).
    optimizeDeps: {
      include: [
        '@react-pdf/renderer', 'qrcode',
        'motion/react', 'use-stick-to-bottom', 'radix-ui', 'class-variance-authority', 'clsx', 'tailwind-merge',
      ],
    },
  },
});
