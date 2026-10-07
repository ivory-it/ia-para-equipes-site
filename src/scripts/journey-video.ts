import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animação da jornada na seção "Como funciona" (`Structure.astro`): troca os três
 * cards de etapa por um vídeo sem player, que toca uma vez e para no quadro final.
 *
 * O markup nasce com os cards, e o vídeo só entra se tudo der certo:
 * - largura de lg para cima (no celular, o texto do vídeo ficaria com uns 4 px);
 * - sem pedido de menos movimento;
 * - o autoplay é aceito (economia de dados ou bloqueio fazem o `play()` rejeitar).
 *
 * O `src` só é atribuído quando a seção chega a uma tela de distância, então quem
 * fica nos cards não baixa os 6 MB.
 */

// O arquivo tem 44 s, mas a partir de ~43,2 s tudo some num fade até o quadro vazio.
// O vídeo para aqui, no quadro "A capacitação termina. O conhecimento fica.".
// Se o vídeo for trocado, confira o novo ponto (brilho médio por instante, com ffmpeg).
const HOLD_AT = 43;

const root = document.querySelector<HTMLElement>('[data-journey]');
const steps = root?.querySelector<HTMLElement>('[data-journey-steps]');
const frame = root?.querySelector<HTMLElement>('[data-journey-frame]');
const video = root?.querySelector<HTMLVideoElement>('[data-journey-video]');

if (root && steps && frame && video) {
  const src = video.dataset.src ?? '';
  const done = () => video.currentTime >= HOLD_AT;

  // O `timeupdate` dispara só a cada ~250 ms e passaria do ponto, já no fade.
  // O laço por quadro para no instante certo.
  const holdAtEnd = () => {
    if (video.paused) return;
    if (done()) {
      video.pause();
      video.currentTime = HOLD_AT;
      return;
    }
    requestAnimationFrame(holdAtEnd);
  };
  video.addEventListener('playing', holdAtEnd);

  const showVideo = () => {
    steps.classList.add('sr-only');
    frame.hidden = false;
    ScrollTrigger.refresh();
  };

  const showSteps = () => {
    video.pause();
    frame.hidden = true;
    steps.classList.remove('sr-only');
    ScrollTrigger.refresh();
  };

  const waitFor = (event: string) =>
    new Promise<void>((resolve, reject) => {
      video.addEventListener(event, () => resolve(), { once: true });
      video.addEventListener('error', () => reject(new Error('video error')), { once: true });
    });

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    let active = true;
    let playback: IntersectionObserver | undefined;

    const prepare = async () => {
      try {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          if (!video.getAttribute('src')) video.src = src;
          video.load();
          await waitFor('loadeddata');
        }
        if (!active) return;

        // Teste de autoplay ainda fora da tela. Se o vídeo já terminou numa
        // ativação anterior, fica no quadro final.
        if (!done()) {
          const at = video.currentTime;
          await video.play();
          video.pause();
          video.currentTime = at;
        }
        if (!active) return;

        showVideo();
        if (done()) return;

        // Toca enquanto a seção está à vista; ao sair, pausa e retoma na volta.
        playback = new IntersectionObserver(
          ([entry]) => {
            if (done()) playback?.disconnect();
            else if (entry?.isIntersecting) video.play().catch(showSteps);
            else video.pause();
          },
          { threshold: 0.4 },
        );
        playback.observe(video);
      } catch {
        if (active) showSteps();
      }
    };

    // Pré-carga uma tela antes de a seção chegar.
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        preload.disconnect();
        prepare();
      },
      { rootMargin: '0px 0px 100% 0px' },
    );
    preload.observe(root);

    const onError = () => showSteps();
    video.addEventListener('error', onError);

    // Janela abaixo de lg ou preferência alterada: voltam os cards.
    return () => {
      active = false;
      preload.disconnect();
      playback?.disconnect();
      video.removeEventListener('error', onError);
      if (!frame.hidden) showSteps();
    };
  });
}
