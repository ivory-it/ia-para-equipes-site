/**
 * Botões de copiar o prompt do material.
 *
 * - `[data-copy-target]` (no bloco): copia o texto do elemento indicado pelo id
 *   e troca o rótulo para "Copiado!" por 2 s.
 * - `[data-copy-prompt]` (no topo): rola até a seção do prompt e copia no mesmo
 *   clique, porque o clipboard só aceita escrita dentro de um gesto do usuário.
 *
 * O texto sai do `textContent` do <code>, que preserva as quebras de linha do
 * <pre>. Sem contexto seguro (http fora do localhost), o `navigator.clipboard`
 * não existe e entra o caminho antigo, com textarea + execCommand.
 */

const FEEDBACK_MS = 2000;

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Cai para o caminho antigo abaixo.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

const timers = new WeakMap<HTMLElement, number>();

function showFeedback(button: HTMLButtonElement, ok: boolean) {
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  if (!label) return;
  const original = button.dataset.copyIdle ?? label.textContent ?? '';
  button.dataset.copyIdle = original;
  label.textContent = ok ? 'Copiado!' : 'Não deu para copiar';
  button.dataset.copied = ok ? 'true' : 'false';
  window.clearTimeout(timers.get(button));
  timers.set(
    button,
    window.setTimeout(() => {
      label.textContent = original;
      delete button.dataset.copied;
    }, FEEDBACK_MS),
  );
}

function textOf(targetId: string): string {
  return document.getElementById(targetId)?.textContent ?? '';
}

document.querySelectorAll<HTMLButtonElement>('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const ok = await writeClipboard(textOf(button.dataset.copyTarget!));
    showFeedback(button, ok);
  });
});

document.querySelectorAll<HTMLAnchorElement>('[data-copy-prompt]').forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const section = document.getElementById(link.getAttribute('href')!.slice(1));
    section?.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
    const blockButton = document.querySelector<HTMLButtonElement>('[data-copy-target]');
    if (!blockButton) return;
    const ok = await writeClipboard(textOf(blockButton.dataset.copyTarget!));
    showFeedback(blockButton, ok);
  });
});
