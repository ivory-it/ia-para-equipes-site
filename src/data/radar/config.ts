/**
 * Configuração do Radar IA.
 *
 * Vídeo "A IA pode fazer muito mais do que você imagina" (16/11/2026), em duas
 * versões recomprimidas para a web a partir dos renders de
 * `ivory-videos/projects/2026-11-ia-possibilidades/renders/` (ver AGENTS.md):
 * - `desktop`: 1920×1080, para desktop, tablet e celular deitado;
 * - `mobile`: o reels, 720×1280, para celular em pé (`VIDEO_MOBILE_QUERY`).
 * Os arquivos ficam em `public/radar/video/`, servidos como estão.
 */
export const VIDEO_PATH = '/diagnostico-ia/video';
export const VIDEO_READY = true;
export const VIDEO_SOURCES = {
  desktop: { src: '/radar/video/ia-possibilidades-desktop.mp4', poster: '/radar/video/ia-possibilidades-desktop.jpg' },
  mobile: { src: '/radar/video/ia-possibilidades-reels.mp4', poster: '/radar/video/ia-possibilidades-reels.jpg' },
} as const;
export const VIDEO_MOBILE_QUERY = '(orientation: portrait) and (max-width: 767px)';
/** A legenda já está gravada na imagem; a faixa fica disponível, desligada. */
export const VIDEO_CAPTIONS = '/radar/video/ia-possibilidades.vtt';

export const ORIGEM_LEAD = 'Radar IA';
