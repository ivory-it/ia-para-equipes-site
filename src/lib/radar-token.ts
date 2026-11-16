/**
 * Token de acesso do Radar IA: dispensa o formulário antes do PDF.
 *
 * Formato: `base64url(payload).base64url(hmac-sha256(payload))`. O payload é
 * JSON com `v` (versão), `scope` (só vale `radar:pdf:direct`), `exp` (segundos
 * Unix) e `label` opcional, não pessoal, para auditoria agregada.
 *
 * O segredo fica só no servidor (`RADAR_ACCESS_SECRET`). Quem tem o link usa o
 * token até expirar: é credencial de portador, não identifica a pessoa.
 *
 * Sem dependências além de `node:crypto`, para o gerador
 * (`scripts/radar-token.ts`) rodar com o `node` puro.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const RADAR_SCOPE = 'radar:pdf:direct';
const VERSION = 1;

export interface RadarTokenPayload {
  v: number;
  scope: string;
  exp: number;
  label?: string;
}

const b64url = (buf: Buffer) => buf.toString('base64url');
const sign = (body: string, secret: string) => createHmac('sha256', secret).update(body).digest();

export function createRadarToken(secret: string, days: number, label?: string, now = Date.now()): string {
  if (!secret) throw new Error('RADAR_ACCESS_SECRET vazio.');
  const payload: RadarTokenPayload = { v: VERSION, scope: RADAR_SCOPE, exp: Math.floor(now / 1000) + Math.round(days * 86400) };
  if (label) payload.label = label;
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  return `${body}.${b64url(sign(body, secret))}`;
}

/** Fail closed: qualquer problema devolve `false`. */
export function verifyRadarToken(token: unknown, secret: string | undefined, now = Date.now()): boolean {
  try {
    if (!secret || typeof token !== 'string' || token.length > 1024) return false;
    const [body, mac, extra] = token.split('.');
    if (!body || !mac || extra !== undefined) return false;

    const expected = sign(body, secret);
    const given = Buffer.from(mac, 'base64url');
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<RadarTokenPayload>;
    return payload.v === VERSION
      && payload.scope === RADAR_SCOPE
      && typeof payload.exp === 'number'
      && payload.exp * 1000 > now;
  } catch {
    return false;
  }
}
