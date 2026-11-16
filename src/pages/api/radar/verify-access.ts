import type { APIRoute } from 'astro';
import { verifyRadarToken } from '../../../lib/radar-token';

// Única rota sob demanda do site (ver `astro.config.mjs`). Responde só
// `{ valid }`: o front nunca vê o segredo nem o conteúdo do token.
export const prerender = false;

const json = (valid: boolean) =>
  new Response(JSON.stringify({ valid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = (await request.json()) as { token?: unknown };
    // O token não é registrado em log: funciona como credencial de portador.
    return json(verifyRadarToken(token, import.meta.env.RADAR_ACCESS_SECRET ?? process.env.RADAR_ACCESS_SECRET));
  } catch {
    return json(false);
  }
};
