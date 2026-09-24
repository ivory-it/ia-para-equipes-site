import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Passagem animada da seção "Por que esta capacitação" (`Context.astro`): o uso
 * individual chega disperso, converge para a capacitação e sai do outro lado
 * como prática corporativa.
 *
 * O mesmo contrato do `reveal.ts`: nada é escondido fora do `matchMedia`. Quem
 * pede menos movimento, ou fica sem JavaScript, recebe o diagrama completo e
 * estático, porque o markup já nasce no estado final.
 */

const root = document.querySelector<HTMLElement>('[data-flow-root]');

if (root) {
  const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

  const headingBefore = q('[data-flow-heading="before"]');
  const headingAfter = q('[data-flow-heading="after"]');
  const before = q('[data-flow-before]');
  const after = q('[data-flow-after]');
  const chips = q('[data-flow-chip]');
  const hub = q('[data-flow-hub]');
  const rings = q('[data-flow-ring]');
  const drawBefore = q<SVGPathElement>('[data-flow-draw="before"]');
  const drawAfter = q<SVGPathElement>('[data-flow-draw="after"]');
  const dotsBefore = q<SVGCircleElement>('[data-flow-dot="before"]');
  const dotsAfter = q<SVGCircleElement>('[data-flow-dot="after"]');

  // Posições espalhadas de onde os cards da esquerda partem. Fixas por índice,
  // não aleatórias: a animação é a mesma em toda visita.
  const scatter = [
    { x: -28, y: -10, rotation: -3 },
    { x: 18, y: 8, rotation: 2.5 },
    { x: -14, y: 14, rotation: -2 },
    { x: 24, y: -6, rotation: 3.5 },
  ];

  // Os chips da direita começam no tom neutro dos da esquerda e ganham o turquesa
  // quando o card chega: a mudança de cor é a própria passagem.
  const neutralChip = {
    backgroundColor: 'rgba(228, 228, 228, 0.6)',
    borderColor: 'rgba(10, 37, 64, 0.08)',
    color: '#5a6672',
  };

  const enterBefore = (tl: gsap.core.Timeline) =>
    tl
      .from(headingBefore, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' })
      .from(
        before,
        {
          opacity: 0,
          x: (i) => scatter[i]?.x ?? 0,
          y: (i) => (scatter[i]?.y ?? 0) + 10,
          rotation: (i) => scatter[i]?.rotation ?? 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
        },
        '<0.1',
      );

  const enterHub = (tl: gsap.core.Timeline, at: gsap.Position) =>
    tl
      .from(hub, { opacity: 0, scale: 0.88, duration: 0.7, ease: 'back.out(1.6)' }, at)
      .from(
        rings,
        { scale: 0.7, opacity: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 },
        '<0.1',
      );

  const enterAfter = (tl: gsap.core.Timeline, at: gsap.Position) =>
    tl
      .from(headingAfter, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, at)
      .from(
        after,
        { opacity: 0, x: -16, duration: 0.6, ease: 'power2.out', stagger: 0.12 },
        '<0.1',
      )
      .from(chips, { ...neutralChip, duration: 0.5, ease: 'none', stagger: 0.12 }, '<0.25');

  const mm = gsap.matchMedia();

  // Desktop: uma linha do tempo só, com os conectores se desenhando entre as
  // etapas. É aqui que a passagem da esquerda para a direita fica legível.
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1280px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 70%', once: true },
    });

    // Total perto de 3s: os conectores começam enquanto os últimos cards da
    // esquerda ainda se acomodam, para a leitura não parar entre as etapas.
    enterBefore(tl);
    tl.from(dotsBefore, { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.3, stagger: 0.06 }, '-=0.8');
    tl.from(drawBefore, { strokeDashoffset: 1, duration: 0.7, ease: 'power1.inOut', stagger: 0.06 }, '<');
    enterHub(tl, '-=0.4');
    tl.from(drawAfter, { strokeDashoffset: 1, duration: 0.7, ease: 'power1.inOut', stagger: 0.06 }, '-=0.5');
    tl.from(dotsAfter, { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.3, stagger: 0.06 }, '-=0.4');
    enterAfter(tl, '-=0.55');

    // Um pulso leve do anel externo quando o lado da direita termina: o método
    // é o que fica ativo depois da passagem.
    tl.to(rings[0] ?? [], { scale: 1.06, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.2');
  });

  // Mobile e tablet: as colunas estão empilhadas e os conectores ficam ocultos.
  // Cada bloco tem seu próprio gatilho e entra quando chega à tela, em vez de
  // tocar tudo de uma vez enquanto a coluna da direita ainda está fora da vista.
  mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1279.98px)', () => {
    const trigger = (el: Element | undefined) => ({
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    enterBefore(gsap.timeline(trigger(headingBefore[0])));
    enterHub(gsap.timeline(trigger(hub[0])), 0);
    enterAfter(gsap.timeline(trigger(headingAfter[0])), 0);
  });
}
