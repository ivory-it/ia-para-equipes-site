/**
 * Gera um link de acesso do Radar IA que dispensa o formulário antes do PDF.
 * Uso interno da Ivory, para leads já conhecidos.
 *
 *   RADAR_ACCESS_SECRET=... node scripts/radar-token.ts --dias 30 --label relacionamento
 *
 * O segredo precisa ser o mesmo configurado na Vercel. O link vale para quem o
 * tiver até expirar: prefira validades curtas. Não use dado pessoal no label.
 */
import { createRadarToken } from '../src/lib/radar-token.ts';

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};

const secret = process.env.RADAR_ACCESS_SECRET ?? '';
if (!secret) {
  console.error('Defina RADAR_ACCESS_SECRET (o mesmo da Vercel).');
  process.exit(1);
}

const days = Number(arg('dias') ?? 30);
const label = arg('label');
const site = (process.env.SITE_URL ?? 'https://iaparaequipes.com.br').replace(/\/$/, '');
const token = createRadarToken(secret, days, label);

console.log(token);
console.log(`${site}/diagnostico-ia?access=${token}&utm_medium=dm&utm_campaign=relacionamento`);
