/**
 * PDF executivo do Radar IA ("Kit do Patrocinador de IA"). Gerado no navegador
 * com @react-pdf/renderer a partir do `planModel`.
 *
 * Redesenho de 11/11/2026 (pedido do Thiago: "monótono, muito texto, é algo
 * executivo"): blocos visuais no lugar de parágrafos. Segue a marca:
 * - fundo claro com malha sutil; Navy como tinta e Turquesa como acento único;
 * - Navy sólido só na capa, na contracapa e no card da descoberta;
 * - a onda oficial aparece uma vez, na capa;
 * - Sora em títulos, Poppins no resto, ícones Solar de linha em Navy.
 *
 * Páginas: capa · onde vocês estão · oportunidades · plano de ação ·
 * proposta para discussão · apêndice de recomendações · contracapa institucional.
 *
 * Fontes em WOFF em `public/fonts/radar/` (o react-pdf não lê WOFF2). Logos e
 * onda: PNG da skill da marca, sem edição além do corte da margem transparente.
 */
import { Document, Page, View, Text, Image, Link, StyleSheet, Font, Svg, Path, Circle, Line, Rect, Ellipse, G } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import type { PlanModel } from '../../../scripts/radar/engine.ts';
import type { DimensionId, QualState } from '../../../data/radar/mirror.ts';
import { ACTIONS } from '../../../data/radar/actions.ts';
import { PDF, NEXT_STEPS, CONDITIONS } from '../../../data/radar/story.ts';
import { TECH_BOUNDARY } from '../../../data/radar/path.ts';
import { CHALLENGE_ICON, CAPABILITY_ICON } from '../../../data/radar/reactions.ts';
import { SOLAR, type SolarName } from '../icons.ts';

const NAVY = '#0a2540';
const INK2 = '#33404e';
const SOFT = '#5a6672';
const ACCENT = '#00a88e';
const ACCENT_INK = '#00735f';
const SURFACE = '#f2f2f2';
const MIST = '#e4e4e4';
const TINT = '#e6f6f3'; // turquesa a ~10% sobre branco

let registered = false;
export function registerFonts(origin: string) {
  if (registered) return;
  const f = (name: string) => `${origin}/fonts/radar/${name}`;
  Font.register({ family: 'Sora', fonts: [
    { src: f('sora-latin-400-normal.woff'), fontWeight: 400 },
    { src: f('sora-latin-500-normal.woff'), fontWeight: 500 },
    { src: f('sora-latin-600-normal.woff'), fontWeight: 600 },
  ] });
  Font.register({ family: 'Poppins', fonts: [
    { src: f('poppins-latin-400-normal.woff'), fontWeight: 400 },
    { src: f('poppins-latin-500-normal.woff'), fontWeight: 500 },
    { src: f('poppins-latin-600-normal.woff'), fontWeight: 600 },
  ] });
  // Sem hifenização automática: quebra só entre palavras.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}

const M = 48; // margem lateral
const s = StyleSheet.create({
  page: { fontFamily: 'Poppins', fontSize: 9.5, color: INK2, paddingTop: 78, paddingBottom: 60, paddingHorizontal: M, lineHeight: 1.45, backgroundColor: '#ffffff' },
  header: { position: 'absolute', top: 26, left: M, right: M, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 7, fontWeight: 600, color: ACCENT_INK, letterSpacing: 1.6, textTransform: 'uppercase' },
  footer: { position: 'absolute', bottom: 24, left: M, right: M, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: MIST, paddingTop: 7 },
  footerText: { fontSize: 7, color: SOFT },
  eyebrow: { fontSize: 7.5, fontWeight: 600, color: ACCENT_INK, letterSpacing: 1.6, textTransform: 'uppercase' },
  h1: { fontFamily: 'Sora', fontSize: 21, fontWeight: 600, color: NAVY, marginTop: 6, lineHeight: 1.2 },
  h2: { fontFamily: 'Sora', fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 8 },
  lead: { fontSize: 9.5, color: SOFT, marginTop: 6, lineHeight: 1.5 },
  label: { fontSize: 6.8, fontWeight: 600, color: SOFT, letterSpacing: 1.2, textTransform: 'uppercase' },
  card: { borderWidth: 0.75, borderColor: MIST, borderRadius: 12, padding: 12, backgroundColor: '#ffffff' },
  soft: { backgroundColor: SURFACE, borderRadius: 12, padding: 12 },
  row: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  chip: { fontSize: 7.5, fontWeight: 500, color: NAVY, backgroundColor: TINT, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 },
});

// ------------------------------------------------------------------ peças

/** Ícone Solar (linear) a partir do `icons.ts`, desenhado com primitivas do react-pdf. */
function SolarIcon({ name, size = 14, color = NAVY }: { name: SolarName; size?: number; color?: string }) {
  const svg = SOLAR[name] ?? '';
  const attr = (tag: string, key: string) => tag.match(new RegExp(`\\s${key}="([^"]+)"`))?.[1];
  const els: ReactNode[] = [];
  const re = /<(path|circle|ellipse|rect)\b([^>]*)\/?>/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(svg))) {
    const [, tag, a] = m;
    const sw = Number(attr(a!, 'stroke-width') ?? 1.5);
    const common = { stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeOpacity: Number(attr(a!, 'opacity') ?? 1) };
    if (tag === 'path') els.push(<Path key={i++} d={attr(a!, 'd') ?? ''} {...common} />);
    if (tag === 'circle') els.push(<Circle key={i++} cx={attr(a!, 'cx') ?? '0'} cy={attr(a!, 'cy') ?? '0'} r={attr(a!, 'r') ?? '0'} {...common} />);
    if (tag === 'ellipse') els.push(<Ellipse key={i++} cx={attr(a!, 'cx') ?? '0'} cy={attr(a!, 'cy') ?? '0'} rx={attr(a!, 'rx') ?? '0'} ry={attr(a!, 'ry') ?? '0'} {...common} />);
    if (tag === 'rect') els.push(<Rect key={i++} x={attr(a!, 'x') ?? '0'} y={attr(a!, 'y') ?? '0'} width={attr(a!, 'width') ?? '0'} height={attr(a!, 'height') ?? '0'} rx={attr(a!, 'rx') ?? '0'} {...common} />);
  }
  return <Svg width={size} height={size} viewBox="0 0 24 24"><G>{els}</G></Svg>;
}

/** Ícone num círculo turquesa claro (tiles e listas). */
function IconBadge({ name, size = 26 }: { name: SolarName; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: TINT, alignItems: 'center', justifyContent: 'center' }}>
      <SolarIcon name={name} size={size * 0.56} />
    </View>
  );
}

/** Anel de 4 arcos do site (Radar Vivo), com os mesmos degraus por estágio. */
const DIM_ANGLE: Record<DimensionId, number> = { pessoas: 225, processos: 315, seguranca: 45, disseminacao: 135 };
const STAGE: Partial<Record<QualState, { fill: number; opacity: number }>> = {
  'Primeiros passos': { fill: 0.25, opacity: 0.4 },
  'Em desenvolvimento': { fill: 0.5, opacity: 0.65 },
  'Em estruturação': { fill: 0.75, opacity: 0.85 },
  'Mais estruturado': { fill: 1, opacity: 1 },
};
function Ring({ dims, size, center }: { dims: { id: DimensionId; state: QualState }[]; size: number; center: string[] }) {
  const C = 100;
  const R = 70;
  const SPAN = 38;
  const at = (deg: number) => ({ x: C + R * Math.cos((deg * Math.PI) / 180), y: C + R * Math.sin((deg * Math.PI) / 180) });
  const arc = (from: number, to: number) => { const a = at(from); const b = at(to); return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`; };
  // O texto do centro fica numa View por cima do SVG: mais previsível que <Text> dentro do Svg.
  return (
    <View style={{ width: size, height: size }}>
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {dims.map((d) => {
        const a = DIM_ANGLE[d.id];
        const st = STAGE[d.state];
        return (
          <G key={d.id}>
            <Path d={arc(a - SPAN, a + SPAN)} stroke={ACCENT} strokeOpacity={0.14} strokeWidth={17} fill="none" strokeLinecap="round"
              strokeDasharray={d.state === 'Não identificado' ? '3 6' : undefined} />
            {st && <Path d={arc(a - SPAN, a - SPAN + 2 * SPAN * st.fill)} stroke={ACCENT} strokeOpacity={st.opacity} strokeWidth={17} fill="none" strokeLinecap="round" />}
          </G>
        );
      })}
      <Circle cx={C} cy={C} r={46} fill={NAVY} />
    </Svg>
    <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {center.map((t) => (
        <Text key={t} style={{ fontFamily: 'Sora', fontSize: size * 0.065, fontWeight: 600, color: '#ffffff', lineHeight: 1.15 }}>{t}</Text>
      ))}
    </View>
    </View>
  );
}

function Checklist({ items, size = 8.8 }: { items: string[]; size?: number }) {
  return (
    <View>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', marginTop: 5 }} wrap={false}>
          <View style={{ width: 8, height: 8, borderWidth: 0.9, borderColor: ACCENT_INK, borderRadius: 2, marginTop: 2.5, marginRight: 7 }} />
          <Text style={{ flex: 1, fontSize: size, lineHeight: 1.35 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function Stepper({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 }} wrap={false}>
          <View style={{ width: 15, height: 15, borderRadius: 7.5, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <Text style={{ color: '#ffffff', fontSize: 7, fontWeight: 600, lineHeight: 1 }}>{i + 1}</Text>
          </View>
          <Text style={{ flex: 1, marginTop: 1.5, fontSize: 8.8, lineHeight: 1.35 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function Tile({ icon, label, value }: { icon: SolarName; label: string; value?: string }) {
  return (
    <View style={[s.card, s.col, { flexDirection: 'row', gap: 9, alignItems: 'flex-start' }]}>
      <IconBadge name={icon} />
      <View style={{ flex: 1 }}>
        <Text style={s.label}>{label}</Text>
        <Text style={{ fontSize: 9.3, color: NAVY, fontWeight: 500, marginTop: 3, lineHeight: 1.3 }}>{value || 'A definir'}</Text>
      </View>
    </View>
  );
}

/** Malha muito sutil no topo das páginas claras (textura da marca). */
function Mesh() {
  const w = 595;
  const h = 64;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0 }} fixed>
      <Svg width={w} height={h}>
        {Array.from({ length: Math.ceil(w / 16) }, (_, i) => <Line key={`v${i}`} x1={i * 16} y1={0} x2={i * 16} y2={h} stroke={NAVY} strokeOpacity={0.045} strokeWidth={0.4} />)}
        {Array.from({ length: Math.ceil(h / 16) }, (_, i) => <Line key={`h${i}`} x1={0} y1={i * 16} x2={w} y2={i * 16} stroke={NAVY} strokeOpacity={0.045} strokeWidth={0.4} />)}
      </Svg>
    </View>
  );
}

function Frame({ origin, children, section }: { origin: string; children: ReactNode; section: string }) {
  return (
    <Page size="A4" style={s.page}>
      <Mesh />
      <View style={s.header} fixed>
        <Text style={s.headerText}>{section}</Text>
        <Image src={`${origin}/radar/logo-horizontal-navy.png`} style={{ width: 104 }} />
      </View>
      {children}
      <View style={s.footer} fixed>
        <Text style={s.footerText}>{PDF.footer}</Text>
        <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${PDF.brand} · ${pageNumber}/${totalPages}`} />
      </View>
    </Page>
  );
}

/** Título da página. A sobrelinha da seção já está no cabeçalho fixo. */
function Title({ title, lead }: { title: string; lead?: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.h1}>{title}</Text>
      {lead && <Text style={s.lead}>{lead}</Text>}
    </View>
  );
}

// ------------------------------------------------------------------ documento

export interface PlanDocumentProps {
  plan: PlanModel;
  origin: string;
  videoUrl: string;
  qr: string;
  /** QR do site, para a contracapa. */
  siteQr: string;
  /** Data por extenso ("novembro de 2026"). */
  date: string;
}

export function PlanDocument({ plan, origin, videoUrl, qr, siteQr, date }: PlanDocumentProps) {
  const org = plan.org || PDF.defaultOrg;
  const m = plan.mirror;
  const declared = plan.actions.filter((a) => a.source === 'declarado');
  const suggested = plan.actions.filter((a) => a.source === 'sugerido');
  const dims = m?.portrait.map((d) => ({ id: d.id, state: d.state })) ?? [];
  const short: Record<DimensionId, string> = { pessoas: 'Pessoas', processos: 'Processos', seguranca: 'Segurança', disseminacao: 'Disseminação' };
  const stateOf = (id: DimensionId) => m?.portrait.find((d) => d.id === id)?.state ?? '';

  return (
    <Document title={`${PDF.title} — ${org}`} author={PDF.brand} subject={PDF.subtitle} language="pt-BR" creator={PDF.brand} producer={PDF.brand}>
      {/* Capa: Navy (exceção prevista na marca) e a única onda do documento. */}
      <Page size="A4" style={{ ...s.page, backgroundColor: NAVY, color: '#ffffff', padding: 0 }}>
        <Image src={`${origin}/radar/onda-capa.png`} style={{ position: 'absolute', width: 470, height: 470, right: -190, top: 250, opacity: 0.95 }} />
        <View style={{ padding: 54 }}>
          <Image src={`${origin}/radar/logo-horizontal-branco.png`} style={{ width: 168 }} />
          <View style={{ marginTop: 150, width: 330 }}>
            <Text style={{ fontFamily: 'Sora', fontSize: 36, fontWeight: 600, color: '#ffffff', lineHeight: 1.1 }}>{PDF.title}</Text>
            <Text style={{ fontFamily: 'Sora', fontSize: 14, color: '#ffffff', opacity: 0.8, marginTop: 10 }}>{PDF.subtitle}</Text>
          </View>
          {plan.contact.nome ? (
            <View style={{ marginTop: 56, borderLeftWidth: 2, borderLeftColor: ACCENT, paddingLeft: 12, width: 300 }}>
              <Text style={{ fontSize: 7, fontWeight: 600, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>Preparado para</Text>
              <Text style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 500, color: '#ffffff', marginTop: 4 }}>{plan.contact.nome}</Text>
              {plan.contact.cargo ? <Text style={{ fontSize: 9.5, color: '#ffffff', opacity: 0.75, marginTop: 1 }}>{plan.contact.cargo}</Text> : null}
              <Text style={{ fontSize: 8.5, color: '#ffffff', opacity: 0.6, marginTop: 6 }}>{date}</Text>
            </View>
          ) : (
            <Text style={{ marginTop: 56, fontSize: 9, color: '#ffffff', opacity: 0.6 }}>{date}</Text>
          )}
        </View>
        <Text style={{ position: 'absolute', left: 54, bottom: 48, width: 250, fontSize: 9, color: '#ffffff', opacity: 0.7, lineHeight: 1.5 }}>{PDF.purpose}</Text>
      </Page>

      {/* Onde vocês estão: descoberta, estágios, fatos, temas, valor e atenção numa página. */}
      <Frame origin={origin} section="Resumo executivo">
        <Title title="Onde vocês estão" />
        {m && (
          <View style={{ ...s.row, alignItems: 'stretch' }}>
            <View style={{ flex: 1.65, backgroundColor: NAVY, borderRadius: 14, padding: 18 }}>
              <Text style={{ ...s.label, color: ACCENT }}>Principal descoberta</Text>
              <Text style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 500, color: '#ffffff', marginTop: 8, lineHeight: 1.35 }}>“{m.rule.insight}”</Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', opacity: 0.75, marginTop: 10, lineHeight: 1.45 }}>{m.rule.why}</Text>
            </View>
            <View style={[s.card, { flex: 1, alignItems: 'center' }]}>
              <Ring dims={dims} size={118} center={['Retrato', 'atual']} />
              <View style={{ alignSelf: 'stretch', marginTop: 4 }}>
                {(['pessoas', 'processos', 'seguranca', 'disseminacao'] as DimensionId[]).map((id) => (
                  <View key={id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2.5 }}>
                    <Text style={{ fontSize: 7.8, fontWeight: 600, color: NAVY }}>{short[id]}</Text>
                    <Text style={{ fontSize: 7.8, color: ACCENT_INK }}>{stateOf(id)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ ...s.row, marginTop: 12 }}>
          <Tile icon="medal-star" label="Objetivo" value={plan.goal?.label} />
          <Tile icon="users-group-rounded" label="Primeiro grupo a capacitar" value={plan.scenario.group} />
          <Tile icon="chart-2" label="Sinal de sucesso" value={plan.scenario.indicator} />
        </View>

        {/* Temas, o que já existe a favor e a atenção (antes na página do retrato,
            que saiu: o anel pequeno acima já mostra os 4 estágios). */}
        {m && (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {m.portrait.map((d) => (
                <View key={d.id} style={[s.card, { width: '48.8%', paddingVertical: 10 }]} wrap={false}>
                  <Text style={s.label}>{d.dimension}</Text>
                  <Text style={{ fontSize: 9.3, color: NAVY, marginTop: 3 }}>{d.summary}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 7.3, color: SOFT, marginTop: 6 }}>{PDF.basedOn}</Text>

            <View style={{ ...s.row, marginTop: 10 }} wrap={false}>
              <View style={{ flex: 1, backgroundColor: m.value.kind === 'favor' ? TINT : SURFACE, borderRadius: 12, padding: 14 }}>
                <Text style={{ ...s.label, color: m.value.kind === 'favor' ? ACCENT_INK : SOFT }}>{m.value.title}</Text>
                <Text style={{ fontSize: 9.5, color: NAVY, marginTop: 5, lineHeight: 1.4 }}>{m.value.text}</Text>
              </View>
              <View style={[s.card, { flex: 1, flexDirection: 'row', gap: 9 }]}>
                <SolarIcon name="info-circle" size={16} color={SOFT} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Atenção</Text>
                  <Text style={{ fontSize: 9, color: INK2, marginTop: 5, lineHeight: 1.4 }}>{m.attention}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ marginTop: 16 }}>
          <Text style={s.label}>Desafios reconhecidos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {plan.challenges.length ? plan.challenges.map((c) => (
              <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: TINT, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9 }}>
                <SolarIcon name={CHALLENGE_ICON[c.id]} size={10} />
                <Text style={{ fontSize: 8, color: NAVY, fontWeight: 500 }}>{c.label}</Text>
              </View>
            )) : <Text style={{ fontSize: 8.5, color: SOFT }}>Nenhum desafio marcado.</Text>}
          </View>
        </View>
      </Frame>

      {/* Oportunidades: grade de cards e o vídeo em destaque. */}
      <Frame origin={origin} section="Oportunidades descobertas">
        <Title title="O que a IA já pode fazer no trabalho"
          lead="Capacidades que chamaram sua atenção. Dependem de produto, licença, configuração e permissões." />
        {plan.capabilities.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {plan.capabilities.map((c) => (
              <View key={c.id} style={[s.card, { width: '48.6%', padding: 14 }]} wrap={false}>
                <IconBadge name={CAPABILITY_ICON[c.id]} size={30} />
                <Text style={{ fontFamily: 'Sora', fontSize: 11, fontWeight: 600, color: NAVY, marginTop: 9 }}>{c.label}</Text>
                <Text style={{ fontSize: 8.8, marginTop: 5, lineHeight: 1.4 }}>{c.example}</Text>
                <Text style={{ fontSize: 7.5, color: SOFT, marginTop: 7, lineHeight: 1.35 }}>Cuidado: {c.caveat}</Text>
              </View>
            ))}
          </View>
        ) : <Text style={{ ...s.lead, marginTop: 0 }}>Nenhuma possibilidade foi marcada. O vídeo apresenta as quatro.</Text>}
        <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, borderRadius: 14, padding: 16 }} wrap={false}>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 6, marginRight: 16 }}>
            <Image src={qr} style={{ width: 74, height: 74 }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...s.label, color: ACCENT }}>Para compartilhar com outros decisores</Text>
            <Text style={{ fontFamily: 'Sora', fontSize: 12, fontWeight: 500, color: '#ffffff', marginTop: 5, lineHeight: 1.35 }}>{PDF.videoCta}</Text>
            <Link src={videoUrl} style={{ color: '#ffffff', opacity: 0.8, marginTop: 6, fontSize: 8.5, textDecoration: 'underline' }}>{videoUrl.replace(/^https?:\/\//, '')}</Link>
          </View>
        </View>
      </Frame>

      {/* Plano de ação: roteiro em linha do tempo e as ações em checklist. */}
      <Frame origin={origin} section="Plano de ação">
        <Title title="Dos desafios aos próximos passos" />
        <View style={{ ...s.soft, paddingVertical: 16 }} wrap={false}>
          <View style={{ position: 'absolute', top: 29, left: 52, right: 52, height: 2, backgroundColor: ACCENT, opacity: 0.5 }} />
          <View style={{ flexDirection: 'row' }}>
            {plan.track.map((t, i) => (
              <View key={t.id} style={{ flex: 1, alignItems: 'center', paddingHorizontal: 4 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: i === 1 ? ACCENT_INK : '#ffffff', borderWidth: 1.5, borderColor: ACCENT_INK, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 9, fontWeight: 600, color: i === 1 ? '#ffffff' : ACCENT_INK, lineHeight: 1 }}>{i + 1}</Text>
                </View>
                <Text style={{ fontFamily: 'Sora', fontSize: 9.5, fontWeight: 600, color: NAVY, marginTop: 6 }}>{t.label}</Text>
                <Text style={{ fontSize: 7.2, color: SOFT, marginTop: 3, textAlign: 'center', lineHeight: 1.35 }}>{t.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ ...s.row, marginTop: 14, alignItems: 'flex-start' }}>
          <View style={{ flex: 1.15 }}>
            <Text style={s.h2}>Você indicou</Text>
            <Text style={{ fontSize: 7.8, color: SOFT, marginTop: -4 }}>Ligadas aos desafios reconhecidos. O passo a passo está no apêndice.</Text>
            <Checklist items={declared.length ? declared.map((a) => a.text) : ['Nenhum desafio foi indicado.']} size={8.4} />
          </View>
          {suggested.length > 0 && (
            <View style={{ flex: 1, borderWidth: 1.2, borderColor: ACCENT, borderRadius: 14, padding: 14 }}>
              <Text style={{ ...s.label, color: ACCENT_INK }}>O Radar sugere</Text>
              <Text style={{ fontSize: 7.8, color: SOFT, marginTop: 3 }}>A partir do retrato e do objetivo escolhido.</Text>
              {suggested.map((a, i) => (
                <View key={a.id} style={{ flexDirection: 'row', gap: 7, marginTop: 8 }} wrap={false}>
                  <SolarIcon name={i === 0 ? 'star-shine' : 'arrow-right'} size={11} color={ACCENT_INK} />
                  <Text style={{ flex: 1, fontSize: 8.6, color: i === 0 ? NAVY : INK2, fontWeight: i === 0 ? 500 : 400, lineHeight: 1.35 }}>{a.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Frame>

      {/* Proposta para discussão interna: campos em tiles, condições e decisões. */}
      <Frame origin={origin} section="Proposta para discussão interna">
        <Title title="Um primeiro caminho para a equipe" />
        <View style={s.row}>
          <Tile icon="users-group-rounded" label="Primeiro grupo a capacitar" value={plan.scenario.group} />
          <Tile icon="layers" label="Ambiente de IA" value={plan.scenario.tools} />
        </View>
        <View style={{ ...s.row, marginTop: 10 }}>
          <Tile icon="chart-2" label="Indicador de acompanhamento" value={plan.scenario.indicator} />
          <Tile icon="checklist-minimalistic" label="Atividades candidatas" value={plan.scenario.candidates.join(' · ')} />
        </View>
        {plan.goal && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.label}>Competências a desenvolver</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {plan.goal.competencies.map((c) => <Text key={c} style={s.chip}>{c}</Text>)}
            </View>
          </View>
        )}
        {plan.scenario.largeGroupNote && <Text style={{ fontSize: 7.8, color: SOFT, marginTop: 8 }}>{plan.scenario.largeGroupNote}</Text>}

        <View style={{ ...s.row, marginTop: 16, alignItems: 'flex-start' }}>
          <View style={[s.soft, s.col]}>
            <Text style={s.h2}>Condições a validar</Text>
            <Checklist items={CONDITIONS} />
          </View>
          <View style={[s.soft, s.col]}>
            <Text style={s.h2}>Decisões com TI, RH e liderança</Text>
            <Stepper items={NEXT_STEPS} />
          </View>
        </View>

        <View style={{ marginTop: 16 }} wrap={false}>
          <Text style={s.h2}>Como a Ivory pode apoiar</Text>
          <View style={s.row}>
            {PDF.ivorySupport.map((t, i) => (
              <View key={t} style={[s.card, s.col]}>
                <IconBadge name={(['presentation-graph', 'widget-4', 'user-check'] as SolarName[])[i]!} size={24} />
                <Text style={{ fontSize: 8.3, color: NAVY, marginTop: 7, lineHeight: 1.35 }}>{t}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 7.3, color: SOFT, marginTop: 8, lineHeight: 1.4 }}>{TECH_BOUNDARY}</Text>
        </View>
      </Frame>

      {/* Apêndice: as três recomendações de cada desafio marcado, com texto integral. */}
      {plan.appendix.length > 0 && (
        <Frame origin={origin} section="Apêndice · Recomendações">
          <Title title="Recomendações para os desafios indicados"
            lead="Três orientações práticas para cada desafio reconhecido, para usar nas conversas internas." />
          {plan.appendix.map((c, ci) => (
            // Em fluxo contínuo (sem quebra por desafio): com quebra, sobravam páginas
            // quase vazias. A faixa do desafio nunca fica sozinha no pé da página.
            <View key={c.id} style={{ marginTop: ci > 0 ? 14 : 0 }}>
              <View minPresenceAhead={120} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: NAVY, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12, marginBottom: 4 }}>
                <SolarIcon name={CHALLENGE_ICON[c.id]} size={14} color="#ffffff" />
                <Text style={{ fontFamily: 'Sora', fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{c.label}</Text>
              </View>
              {c.pills.map((p, pi) => (
                <View key={p.id} style={[s.card, { marginTop: 8 }]} wrap={false}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={s.chip}>{p.stage}</Text>
                    <Text style={{ fontSize: 7, color: SOFT }}>{`${pi + 1} de 3`}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Sora', fontSize: 11, fontWeight: 600, color: NAVY, marginTop: 7 }}>{p.title}</Text>
                  {p.body.map((b, bi) => <Text key={bi} style={{ fontSize: 8.6, marginTop: 4, lineHeight: 1.4 }}>{b}</Text>)}
                  <View style={{ backgroundColor: SURFACE, borderRadius: 8, padding: 8, marginTop: 7 }}>
                    <Text style={{ fontSize: 8.4, lineHeight: 1.4 }}><Text style={{ fontWeight: 600, color: NAVY }}>Coloque em prática: </Text>{p.practice}</Text>
                    {p.steps && <Stepper items={p.steps} />}
                    {p.bullets && <Checklist items={p.bullets} size={8.4} />}
                    {p.closing && <Text style={{ fontSize: 8.4, marginTop: 5, lineHeight: 1.4 }}>{p.closing.label ? <Text style={{ fontWeight: 600, color: NAVY }}>{`${p.closing.label}: `}</Text> : null}{p.closing.text}</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 7, alignItems: 'flex-start' }}>
                    <SolarIcon name="arrow-right" size={10} color={ACCENT_INK} />
                    <Text style={{ flex: 1, fontSize: 8.4, color: ACCENT_INK, fontWeight: 600 }}>{ACTIONS[p.action]}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </Frame>
      )}

      {/* Contracapa institucional: site e redes. Sem onda (ela fica só na capa). */}
      <Page size="A4" style={{ ...s.page, backgroundColor: NAVY, color: '#ffffff', padding: 54, justifyContent: 'space-between' }}>
        <View style={{ marginTop: 40 }}>
          <Image src={`${origin}/radar/logo-empilhado-branco.png`} style={{ width: 210 }} />
          <Text style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 600, color: '#ffffff', marginTop: 70, lineHeight: 1.2, width: 380 }}>{PDF.backTitle}</Text>
          <Text style={{ fontSize: 10.5, color: '#ffffff', opacity: 0.75, marginTop: 12, width: 340, lineHeight: 1.5 }}>{PDF.backText}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ gap: 14 }}>
            {PDF.social.map((n) => (
              <View key={n.label}>
                <Text style={{ fontSize: 7, fontWeight: 600, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>{n.label}</Text>
                <Link src={n.href} style={{ fontSize: 11.5, color: '#ffffff', textDecoration: 'none', marginTop: 2 }}>{n.text}</Link>
              </View>
            ))}
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 7 }}>
              <Image src={siteQr} style={{ width: 84, height: 84 }} />
            </View>
            <Text style={{ fontSize: 7.5, color: '#ffffff', opacity: 0.7, marginTop: 6 }}>Acesse o site</Text>
          </View>
        </View>
        <Text style={{ fontSize: 7.5, color: '#ffffff', opacity: 0.55, borderTopWidth: 0.5, borderTopColor: '#ffffff', paddingTop: 10 }}>{PDF.brand}</Text>
      </Page>
    </Document>
  );
}
