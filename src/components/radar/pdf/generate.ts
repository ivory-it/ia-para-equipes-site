/**
 * Gera e baixa o PDF no navegador. As bibliotecas (react-pdf e qrcode) entram
 * só no clique, por `import()`, para não pesar na página.
 *
 * Nada é enviado ao servidor: o arquivo nasce do estado em memória.
 */
import { createElement } from 'react';
import { planModel, pdfFileName, type RadarState } from '../../../scripts/radar/engine.ts';
import { PDF } from '../../../data/radar/story.ts';
import { VIDEO_PATH } from '../../../data/radar/config.ts';

export async function downloadPlanPdf(state: RadarState, siteUrl: string) {
  const [{ pdf }, { PlanDocument, registerFonts }, QR] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./PlanDocument'),
    import('qrcode'),
  ]);

  const origin = window.location.origin;
  registerFonts(origin);

  // O link do vídeo usa o domínio público do site, não o da prévia local.
  const videoUrl = new URL(VIDEO_PATH, siteUrl).href;
  const qrOpts = { margin: 0, width: 320, color: { dark: '#0a2540', light: '#ffffff' } };
  const qr = await QR.toDataURL(videoUrl, qrOpts);
  // Contracapa institucional: QR do site (endereço fixo da marca, em PDF.social).
  const siteQr = await QR.toDataURL(PDF.social[0]!.href, qrOpts);
  const date = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const plan = planModel(state);
  const element = createElement(PlanDocument, { plan, origin, videoUrl, qr, siteQr, date });
  // O tipo do `pdf()` espera um <Document> direto; o PlanDocument devolve um.
  const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = pdfFileName(PDF.fileName, plan.org);
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
