/**
 * Modo de acesso ao PDF do Radar IA.
 *
 * - Começa sempre em `cadastro_exigido`.
 * - Com `?access` na URL (qualquer valor, por exemplo `?access=1`), muda para
 *   `download_direto_autorizado`: o chat pula as perguntas de contato e nenhum
 *   lead é enviado. Decisão do Thiago (16/11/2026): basta o parâmetro, sem token
 *   nem servidor. Quem conhecer o parâmetro baixa o PDF sem deixar contato; o
 *   cadastro é convenção comercial, não proteção.
 * - O parâmetro sai da barra de endereço logo na leitura, para o link ficar limpo.
 *
 * Fica no `useEffect` (e não no primeiro render) para o HTML do servidor e o da
 * hidratação serem iguais.
 */
import { useEffect, useState } from 'react';

export type AccessMode = 'cadastro_exigido' | 'download_direto_autorizado';

export function useAccessMode(): AccessMode {
  const [mode, setMode] = useState<AccessMode>('cadastro_exigido');

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('access')) return;
    url.searchParams.delete('access');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    setMode('download_direto_autorizado');
  }, []);

  return mode;
}
