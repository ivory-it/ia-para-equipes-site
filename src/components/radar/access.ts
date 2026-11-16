/**
 * Modo de acesso ao PDF (§8.5 e §9.4 do documento do Radar IA).
 *
 * - Começa sempre em `cadastro_exigido`.
 * - Só um `?access=` validado pelo servidor muda para `download_direto_autorizado`.
 * - Token ausente, inválido, expirado ou falha de rede: continua exigindo cadastro
 *   (fail closed). UTMs e qualquer outro parâmetro não liberam nada.
 * - O token sai da URL visível logo na leitura, para não ir para analytics,
 *   favoritos ou capturas de tela.
 */
import { useEffect, useState } from 'react';

export type AccessMode = 'cadastro_exigido' | 'download_direto_autorizado';

export function useAccessMode(): AccessMode {
  const [mode, setMode] = useState<AccessMode>('cadastro_exigido');

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('access');
    if (!token) return;

    url.searchParams.delete('access');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);

    fetch('/api/radar/verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    })
      .then((res) => (res.ok ? res.json() : { valid: false }))
      .then((data: { valid?: unknown }) => {
        if (data.valid === true) setMode('download_direto_autorizado');
      })
      .catch(() => {});
  }, []);

  return mode;
}
