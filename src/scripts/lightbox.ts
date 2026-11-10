/**
 * Lightbox dos prints, com um único <dialog> nativo por página.
 *
 * Cada gatilho é um `button[data-lightbox]` com `data-full` (a variante grande),
 * `data-alt`, `data-width` e `data-height`. O <dialog> já dá Esc, foco preso e
 * a devolução do foco ao gatilho ao fechar.
 *
 * O print tem 1920 px de largura, e caber na tela de um celular deixa o texto
 * pequeno. Por isso, um toque na imagem alterna entre "caber na tela" e
 * "tamanho real", com rolagem dentro do diálogo.
 */

const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');

if (dialog) {
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const stage = dialog.querySelector<HTMLElement>('[data-lightbox-stage]')!;
  const hint = dialog.querySelector<HTMLElement>('[data-lightbox-hint]');
  let zoomed = false;

  const setZoom = (value: boolean) => {
    zoomed = value;
    dialog.dataset.zoomed = String(value);
    if (hint) hint.textContent = value ? 'Toque para ver inteiro' : 'Toque para ampliar';
    img.setAttribute('aria-label', value ? 'Ver inteiro' : 'Ampliar');
  };

  document.querySelectorAll<HTMLButtonElement>('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      img.src = trigger.dataset.full!;
      img.alt = trigger.dataset.alt ?? '';
      img.width = Number(trigger.dataset.width);
      img.height = Number(trigger.dataset.height);
      setZoom(false);
      dialog.showModal();
      stage.scrollTo(0, 0);
    });
  });

  img.addEventListener('click', (event) => {
    event.stopPropagation();
    const rect = img.getBoundingClientRect();
    // Ao ampliar, mantém o ponto tocado no centro da tela.
    const rx = (event.clientX - rect.left) / rect.width;
    const ry = (event.clientY - rect.top) / rect.height;
    setZoom(!zoomed);
    if (zoomed) {
      requestAnimationFrame(() => {
        stage.scrollTo({
          left: img.offsetWidth * rx - stage.clientWidth / 2,
          top: img.offsetHeight * ry - stage.clientHeight / 2,
        });
      });
    }
  });

  // Clique fora da imagem (no fundo escuro) fecha.
  stage.addEventListener('click', (event) => {
    if (event.target === stage) dialog.close();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    setZoom(false);
  });
}
