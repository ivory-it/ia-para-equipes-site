import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Revelação das seções ao rolar, e o efeito de elevação do header.
 *
 * Substitui o `reveal-and-parallax.js` do HTML original, que tinha uma falha de
 * acessibilidade concreta: ele aplicava `opacity: 0` em TODO h1/h2/h3/p/li da
 * página antes de qualquer verificação, e só devolvia a opacidade quando o
 * IntersectionObserver disparasse. Quem navega com `prefers-reduced-motion`
 * recebia uma página em branco até o observer decidir agir — e se o JavaScript
 * falhasse, para sempre.
 *
 * Aqui quem decide é o `gsap.matchMedia()`: a animação só é registrada para quem
 * não pediu menos movimento. Para os demais, o conteúdo simplesmente nasce
 * visível, porque nada o escondeu.
 */

const SELECTOR = [
  'main section :is(h1, h2, h3, h4, p, li)',
  'footer :is(h2, h3, h4, p, li)',
  '.reveal',
].join(', ');

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // `data-reveal-skip` tira um bloco do gatilho por elemento. Serve para o que
  // fica colado na dobra dentro de um contêiner que já é `.reveal`: sozinho, o
  // item só passaria dos 88% depois de rolar e nasceria invisível na primeira
  // tela. Assim ele entra junto com o contêiner.
  const targets = gsap.utils
    .toArray<HTMLElement>(SELECTOR)
    .filter((el) => !el.closest('[data-reveal-skip]'));
  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y: 18 });

  // `batch` agrupa os elementos que entram juntos na viewport num único tween
  // escalonado, em vez de criar um ScrollTrigger por elemento — com ~400 alvos,
  // a diferença é entre uma dúzia de gatilhos e quatrocentos.
  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        // `amount` distribui 0,4s por TODO o lote; `each` daria 0,4s por elemento.
        // A diferença importa: o mockup do herói sozinho tem mais de cem nós de
        // texto, e um atraso por elemento faria o último aparecer dez segundos
        // depois — a seção ficaria fantasma enquanto o visitante já está lendo.
        stagger: { amount: 0.4 },
        overwrite: true,
      }),
  });

  // O header ganha sombra ao sair do topo — sinaliza que a página rolou.
  const header = document.querySelector<HTMLElement>('#site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: ({ progress }) =>
        header.classList.toggle('shadow-[0_10px_30px_-12px_rgba(10,37,64,0.14)]', progress > 0),
      onToggle: ({ isActive }) =>
        header.classList.toggle('shadow-[0_10px_30px_-12px_rgba(10,37,64,0.14)]', isActive),
    });
  }

  return () => {
    // Se a preferência mudar no meio da sessão, o matchMedia reverte o tween e
    // devolve os elementos ao estado natural.
    gsap.set(targets, { clearProps: 'opacity,transform' });
  };
});
