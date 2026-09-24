// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Troque por seu domínio antes de publicar — é daqui que saem as URLs absolutas
// do sitemap e das tags Open Graph.
const SITE = process.env.SITE_URL ?? 'https://pulsedesk.vercel.app';

export default defineConfig({
  site: SITE,

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
        ],
      },
    }),

    sitemap(),
  ],

  // Tailwind 4 entra como plugin do Vite. O `@astrojs/tailwind` virou legado,
  // reservado a quem ainda está no Tailwind 3.
  vite: {
    plugins: [tailwindcss()],
  },
});
