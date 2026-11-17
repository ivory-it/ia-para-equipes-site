/**
 * Plano do Radar IA em PDF, como apresentação 16:9 (960×540 pt, o 16:9 do
 * PowerPoint). Gerado no navegador com @react-pdf/renderer a partir do `planModel`.
 *
 * Desde 16/11/2026 (pedido do Thiago): quem fez o diagnóstico leva o arquivo para
 * a liderança e apresenta sem a Ivory na sala. Por isso:
 * - um slide, uma mensagem: o título já é a conclusão e o visual a prova;
 * - pouco texto, sem guia de apresentador: a régua do topo (4 etapas) mostra
 *   onde se está, como a régua do chat;
 * - voz da empresa ("nossos desafios"), não do visitante;
 * - só o que o chat produziu: desafios, retrato, possibilidades, objetivo, grupo,
 *   ferramenta, sinal de sucesso; da matriz, a atenção e as ações complementares;
 * - fecha num pedido de decisão, não num resumo; sem preço.
 *
 * Marca: Navy como tinta e Turquesa como acento; Navy sólido só na capa, na
 * descoberta e na contracapa; a onda uma vez, na capa; Sora nos títulos, Poppins
 * no resto, ícones Solar. Fontes em WOFF em `public/fonts/radar/` (o react-pdf não
 * lê WOFF2).
 */
import { Document, Page, View, Text, Image, Link, Font, Svg, Path, Circle, G } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import type { PlanModel } from '../../../scripts/radar/engine.ts';
import type { DimensionId, QualState } from '../../../data/radar/mirror.ts';
import { ACTIONS } from '../../../data/radar/actions.ts';
import { CHALLENGES } from '../../../data/radar/challenges.ts';
import { CAPABILITIES } from '../../../data/radar/capabilities.ts';
import { PDF, DECK, DECK_STAGES } from '../../../data/radar/story.ts';
import { TECH_BOUNDARY, TOOL_ENVS } from '../../../data/radar/path.ts';
import { TOOL_LOGO } from '../../../data/radar/tool-logos.ts';
import { CHALLENGE_ICON, CAPABILITY_ICON, GOAL_ICON, GROUP_ICON, TOOL_ICON, INDICATOR_ICON } from '../../../data/radar/reactions.ts';
import type { SolarName } from '../icons.ts';
import { NAVY, INK2, SOFT, ACCENT, ACCENT_INK, SURFACE, MIST, TINT, WHITE, SolarIcon, IconBadge, Label, Pill, ArrowRight, AiChip } from './kit';
import { PracticeDiagram } from './diagrams';

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

const W = 960;
const H = 540;
const MX = 56;
const stripDot = (t = '') => t.replace(/\.$/, '');

// ------------------------------------------------------------------ peças

/** Logo monocromático de uma ferramenta de IA (o mesmo cinza das opções do chat). */
function ToolMark({ id, size = 22 }: { id: PlanModel['ids']['tools'][number]; size?: number }) {
  const logo = TOOL_LOGO[id];
  if (!logo) return <SolarIcon name={TOOL_ICON[id]} size={size} color={SOFT} />;
  return <Svg width={size} height={size} viewBox={logo.viewBox}><Path d={logo.d} fill={SOFT} /></Svg>;
}

/** Anel de 4 arcos do site (Radar Vivo), com os mesmos degraus por estágio. */
const DIM_ANGLE: Record<DimensionId, number> = { pessoas: 225, processos: 315, seguranca: 45, disseminacao: 135 };
const STAGE: Partial<Record<QualState, { fill: number; opacity: number }>> = {
  'Primeiros passos': { fill: 0.25, opacity: 0.4 },
  'Em desenvolvimento': { fill: 0.5, opacity: 0.65 },
  'Em estruturação': { fill: 0.75, opacity: 0.85 },
  'Mais estruturado': { fill: 1, opacity: 1 },
};
const LEVEL: Record<QualState, number> = { 'Não identificado': 0, 'Primeiros passos': 1, 'Em desenvolvimento': 2, 'Em estruturação': 3, 'Mais estruturado': 4 };
const SHORT_DIM: Record<DimensionId, string> = { pessoas: 'Pessoas', processos: 'Processos', seguranca: 'Segurança', disseminacao: 'Disseminação' };

function Ring({ dims, size, center }: { dims: { id: DimensionId; state: QualState }[]; size: number; center: readonly string[] }) {
  const C = 100;
  // Traço fino, como o anel do chat (17/11/2026).
  const R = 75;
  const SPAN = 39;
  const at = (deg: number) => ({ x: C + R * Math.cos((deg * Math.PI) / 180), y: C + R * Math.sin((deg * Math.PI) / 180) });
  const arc = (from: number, to: number) => { const a = at(from); const b = at(to); return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`; };
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {dims.map((d) => {
          const a = DIM_ANGLE[d.id];
          const st = STAGE[d.state];
          return (
            <G key={d.id}>
              <Path d={arc(a - SPAN, a + SPAN)} stroke={ACCENT} strokeOpacity={0.14} strokeWidth={6} fill="none"
                strokeLinecap={d.state === 'Não identificado' ? 'butt' : 'round'}
                strokeDasharray={d.state === 'Não identificado' ? '2.5 3.5' : undefined} />
              {st && <Path d={arc(a - SPAN, a - SPAN + 2 * SPAN * st.fill)} stroke={ACCENT} strokeOpacity={st.opacity} strokeWidth={6} fill="none" strokeLinecap="round" />}
            </G>
          );
        })}
        <Circle cx={C} cy={C} r={42} fill={NAVY} />
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {center.map((t) => (
          <Text key={t} style={{ fontFamily: 'Sora', fontSize: size * 0.06, fontWeight: 600, color: WHITE, lineHeight: 1.15 }}>{t}</Text>
        ))}
      </View>
      {/* Rótulos das dimensões nos quatro cantos do anel. */}
      {dims.map((d) => {
        const left = d.id === 'pessoas' || d.id === 'disseminacao';
        const top = d.id === 'pessoas' || d.id === 'processos';
        return (
          <Text key={`l-${d.id}`} style={{ position: 'absolute', [top ? 'top' : 'bottom']: size * 0.02, [left ? 'left' : 'right']: 0, fontSize: 9.5, fontWeight: 600, color: NAVY }}>
            {SHORT_DIM[d.id]}
          </Text>
        );
      })}
    </View>
  );
}

/** Medidor de 4 degraus de uma dimensão ("Não identificado" fica tracejado). */
function Meter({ state }: { state: QualState }) {
  const n = LEVEL[state];
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: 22, height: 6, borderRadius: 3, backgroundColor: i <= n ? ACCENT : n === 0 ? WHITE : MIST,
          borderWidth: n === 0 ? 0.8 : 0, borderColor: MIST, borderStyle: 'dashed', opacity: i <= n ? 0.45 + 0.55 * (i / 4) : 1 }} />
      ))}
    </View>
  );
}

/** Régua das quatro etapas, no topo de cada slide (a mesma ideia da régua do chat). */
function Tracker({ current, dark = false }: { current: number; dark?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {DECK_STAGES.map((name, i) => (
        <View key={name} style={{ width: 112 }}>
          <View style={{ height: 3, borderRadius: 2, backgroundColor: i < current ? ACCENT : i === current ? (dark ? WHITE : ACCENT_INK) : dark ? '#33506b' : MIST }} />
          <Text style={{ fontSize: 8.5, marginTop: 5, color: dark ? WHITE : i === current ? NAVY : SOFT, opacity: dark && i !== current ? 0.55 : 1, fontWeight: i === current ? 600 : 400 }}>{name}</Text>
        </View>
      ))}
    </View>
  );
}

/** Régua do apêndice: o nome do desafio e em qual das três recomendações se está. */
function AppendixTracker({ label, index }: { label: string; index?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ fontSize: 8.5, fontWeight: 600, color: ACCENT_INK, letterSpacing: 1.2, textTransform: 'uppercase' }}>{DECK.appendixLabel}</Text>
      <Text style={{ fontSize: 8.5, color: SOFT }}>· {label}</Text>
      {index !== undefined && (
        <View style={{ flexDirection: 'row', gap: 3, marginLeft: 4 }}>
          {[0, 1, 2].map((i) => <View key={i} style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: i === index ? ACCENT_INK : i < index ? ACCENT : MIST }} />)}
        </View>
      )}
    </View>
  );
}

function Slide({ origin, children, stage, appendix, dark = false }: {
  origin: string; children: ReactNode; stage?: number; appendix?: { label: string; index?: number }; dark?: boolean;
}) {
  return (
    <Page size={{ width: W, height: H }} style={{ fontFamily: 'Poppins', color: dark ? WHITE : INK2, backgroundColor: dark ? NAVY : WHITE, paddingTop: 96, paddingBottom: 46, paddingHorizontal: MX, lineHeight: 1.4 }}>
      <View style={{ position: 'absolute', top: 30, left: MX, right: MX, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {stage !== undefined ? <Tracker current={stage} dark={dark} /> : appendix ? <AppendixTracker {...appendix} /> : <View />}
        <Image src={`${origin}/radar/logo-horizontal-${dark ? 'branco' : 'navy'}.png`} style={{ width: 92 }} />
      </View>
      {children}
      <Text style={{ position: 'absolute', bottom: 22, right: MX, fontSize: 8, color: dark ? WHITE : SOFT, opacity: dark ? 0.6 : 1 }}
        render={({ pageNumber }) => `${pageNumber}`} />
    </Page>
  );
}

function Headline({ children, color = NAVY, width = 780 }: { children: ReactNode; color?: string; width?: number }) {
  return <Text style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 600, color, lineHeight: 1.18, maxWidth: width, marginBottom: 24 }}>{children}</Text>;
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
  const dims = m?.portrait.map((d) => ({ id: d.id, state: d.state })) ?? [];
  const picked = plan.capabilities.map((c) => c.id);
  const tools = plan.ids.tools;
  // Cartão "Ferramentas": os logos do que a empresa marcou; sem ferramenta concreta,
  // os 3 logos do site e "ou outras soluções homologadas", como no site.
  const marked = tools.filter((t) => TOOL_LOGO[t]);
  const cardLogos = marked.length ? marked : (['copilot', 'claude', 'chatgpt'] as const);
  const otherTools = !marked.length || tools.includes('outros') || tools.includes('avaliando');
  const groupNote = plan.ids.group === 'mais-50' ? DECK.groupNoteLarge : plan.scenario.group ? DECK.groupNote(plan.scenario.group) : '';

  return (
    <Document title={`${PDF.title} — ${org}`} author={PDF.brand} subject={PDF.subtitle} language="pt-BR" creator={PDF.brand} producer={PDF.brand}>
      {/* 0 · Capa: Navy e a única onda do documento. */}
      <Page size={{ width: W, height: H }} style={{ fontFamily: 'Poppins', backgroundColor: NAVY, color: WHITE, padding: 0 }}>
        <Image src={`${origin}/radar/onda-capa.png`} style={{ position: 'absolute', width: 520, height: 520, right: -140, top: 10, opacity: 0.95 }} />
        <View style={{ position: 'absolute', left: 64, top: 52 }}>
          <Image src={`${origin}/radar/logo-horizontal-branco.png`} style={{ width: 150 }} />
        </View>
        <View style={{ position: 'absolute', left: 64, top: 180, width: 470 }}>
          <Text style={{ fontFamily: 'Sora', fontSize: 46, fontWeight: 600, color: WHITE, lineHeight: 1.08 }}>{PDF.title}</Text>
          <Text style={{ fontFamily: 'Sora', fontSize: 18, color: WHITE, opacity: 0.8, marginTop: 14 }}>{PDF.subtitle}</Text>
        </View>
        <View style={{ position: 'absolute', left: 64, bottom: 56, borderLeftWidth: 2.5, borderLeftColor: ACCENT, paddingLeft: 14, width: 380 }}>
          {plan.contact.nome ? (
            <>
              <Text style={{ fontSize: 8.5, fontWeight: 600, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>{DECK.preparedFor}</Text>
              <Text style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 500, color: WHITE, marginTop: 4 }}>
                {plan.contact.nome}{plan.contact.cargo ? <Text style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 400, color: WHITE }}>{`  ·  ${plan.contact.cargo}`}</Text> : null}
              </Text>
              <Text style={{ fontSize: 10.5, color: WHITE, opacity: 0.65, marginTop: 4 }}>{`${date} · ${DECK.preparedBy}`}</Text>
            </>
          ) : <Text style={{ fontSize: 12, color: WHITE, opacity: 0.75 }}>{`${date} · ${DECK.preparedBy}`}</Text>}
        </View>
      </Page>

      {/* 1 · Onde estamos: os desafios reconhecidos. */}
      <Slide origin={origin} stage={0}>
        <Headline>{DECK.challengesTitle(plan.challenges.length || 1)}</Headline>
        <View style={{ flexDirection: 'row', gap: 16, minHeight: 250 }}>
          {plan.challenges.map((c) => (
            <View key={c.id} style={{ flex: 1, maxWidth: plan.challenges.length === 1 ? 420 : undefined, borderWidth: 1, borderColor: MIST, borderRadius: 18, padding: 22, backgroundColor: WHITE }}>
              <IconBadge name={CHALLENGE_ICON[c.id]} size={46} />
              <Text style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 600, color: NAVY, marginTop: 18, lineHeight: 1.25 }}>{c.label}</Text>
              <View style={{ marginTop: 12, borderLeftWidth: 2, borderLeftColor: ACCENT, paddingLeft: 10 }}>
                <Text style={{ fontSize: 13, color: INK2, lineHeight: 1.45 }}>“{c.text}”</Text>
              </View>
            </View>
          ))}
        </View>
      </Slide>

      {/* 2 · Onde estamos: o retrato em quatro dimensões. */}
      {m && (
        <Slide origin={origin} stage={0}>
          <Headline>{DECK.portraitTitle}</Headline>
          <View style={{ flexDirection: 'row', gap: 44, alignItems: 'center' }}>
            <Ring dims={dims} size={240} center={DECK.portraitCenter} />
            <View style={{ flex: 1 }}>
              {m.portrait.map((d, i) => (
                <View key={d.id} style={{ paddingVertical: 8, borderTopWidth: i ? 0.75 : 0, borderTopColor: MIST, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ width: 222 }}>
                    <Text style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.25 }}>{d.dimension}</Text>
                    <View style={{ marginTop: 6 }}><Meter state={d.state} /></View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: 600, color: d.state === 'Não identificado' ? SOFT : ACCENT_INK }}>{d.state}</Text>
                    <Text style={{ fontSize: 12, color: INK2, marginTop: 2, lineHeight: 1.3 }}>{d.summary}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Text fixed style={{ position: 'absolute', left: MX, bottom: 22, fontSize: 8.5, color: SOFT }}>{DECK.portraitNote}</Text>
        </Slide>
      )}

      {/* 3 · O que descobrimos: a descoberta, o slide-chave. */}
      {m && (
        <Slide origin={origin} stage={1} dark>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 }}>
            <Label color={ACCENT}>{DECK.insightLabel}</Label>
            <Text style={{ fontSize: 9, color: WHITE, opacity: 0.6 }}>{`${DECK.insightTheme}: ${m.rule.axis}`}</Text>
          </View>
          <Text style={{ fontFamily: 'Sora', fontSize: 31, fontWeight: 500, color: WHITE, lineHeight: 1.25, marginTop: 18, maxWidth: 800 }}>“{m.rule.insight}”</Text>
          <View style={{ marginTop: 30, borderLeftWidth: 2, borderLeftColor: ACCENT, paddingLeft: 16, maxWidth: 720 }}>
            <Text style={{ fontSize: 13.5, color: WHITE, opacity: 0.8, lineHeight: 1.55 }}>{m.rule.why}</Text>
          </View>
        </Slide>
      )}

      {/* 4 · O que descobrimos: o que temos a favor e o ponto de atenção. */}
      {m && (
        <Slide origin={origin} stage={1}>
          <Headline>{DECK.balanceTitle[m.value.kind]}</Headline>
          <View style={{ flexDirection: 'row', gap: 20, height: 270 }}>
            <View style={{ flex: 1, backgroundColor: m.value.kind === 'favor' ? TINT : SURFACE, borderRadius: 20, padding: 28 }}>
              <IconBadge name={m.value.kind === 'favor' ? 'check-circle' : 'target'} size={50} bg={WHITE} color={ACCENT_INK} />
              <View style={{ marginTop: 20 }}><Label color={ACCENT_INK}>{m.value.kind === 'favor' ? DECK.favorLabel : DECK.discoverLabel}</Label></View>
              <Text style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 500, color: NAVY, marginTop: 10, lineHeight: 1.4 }}>{m.value.text}</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 1, borderColor: MIST, borderRadius: 20, padding: 28 }}>
              <IconBadge name="danger-triangle" size={50} bg={SURFACE} color={NAVY} />
              <View style={{ marginTop: 20 }}><Label>{DECK.attentionLabel}</Label></View>
              <Text style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 500, color: NAVY, marginTop: 10, lineHeight: 1.4 }}>{m.attention}</Text>
            </View>
          </View>
        </Slide>
      )}

      {/* 5 · O que é possível: as quatro possibilidades e o vídeo. */}
      <Slide origin={origin} stage={2}>
        <Headline>{DECK.capabilitiesTitle}</Headline>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {CAPABILITIES.map((c) => {
              const on = picked.includes(c.id);
              const dim = picked.length > 0 && !on;
              return (
                <View key={c.id} style={{ width: 300, height: 140, borderRadius: 16, padding: 16, borderWidth: on ? 1.5 : 0.75, borderColor: on ? ACCENT : MIST, backgroundColor: WHITE, opacity: dim ? 0.5 : 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <IconBadge name={CAPABILITY_ICON[c.id]} size={34} />
                    {on && <Pill>{DECK.capabilityPicked}</Pill>}
                  </View>
                  <Text style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 600, color: NAVY, marginTop: 10 }}>{c.label}</Text>
                  {/* Mini fluxo: de onde vem → IA → o que entrega (no lugar do exemplo em texto). */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    <Text style={{ flex: 1, fontSize: 10, color: INK2, backgroundColor: SURFACE, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, lineHeight: 1.3 }}>{c.flow.from}</Text>
                    <ArrowRight width={14} />
                    <AiChip size={24} />
                    <ArrowRight width={14} />
                    <Text style={{ flex: 1.2, fontSize: 10, fontWeight: 500, color: NAVY, backgroundColor: TINT, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, lineHeight: 1.3 }}>{c.flow.to}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={{ width: 200, backgroundColor: NAVY, borderRadius: 18, padding: 20, alignItems: 'flex-start' }}>
            <SolarIcon name="play-circle" size={26} color={ACCENT} />
            <View style={{ marginTop: 12 }}><Label color={ACCENT}>{DECK.videoLabel}</Label></View>
            <Text style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 500, color: WHITE, marginTop: 6, lineHeight: 1.35 }}>{DECK.videoTitle}</Text>
            <View style={{ backgroundColor: WHITE, borderRadius: 8, padding: 6, marginTop: 12 }}>
              <Image src={qr} style={{ width: 84, height: 84 }} />
            </View>
            <Link src={videoUrl} style={{ color: WHITE, opacity: 0.75, marginTop: 10, fontSize: 8, textDecoration: 'underline' }}>{videoUrl.replace(/^https?:\/\//, '')}</Link>
          </View>
        </View>
        <Text fixed style={{ position: 'absolute', left: MX, bottom: 22, fontSize: 8.5, color: SOFT }}>{DECK.capabilitiesNote}</Text>
      </Slide>

      {/* 6 · O que recomendamos: aonde a empresa quer chegar (só as respostas do chat). */}
      <Slide origin={origin} stage={3}>
        <Headline>{DECK.goalTitle}</Headline>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 190 }}>
          <View style={{ flex: 1, height: '100%', backgroundColor: TINT, borderRadius: 20, padding: 24 }}>
            {plan.goal && <IconBadge name={GOAL_ICON[plan.goal.id]} size={46} bg={WHITE} color={ACCENT_INK} />}
            <View style={{ marginTop: 16 }}><Label color={ACCENT_INK}>{DECK.goalLabel}</Label></View>
            <Text style={{ fontFamily: 'Sora', fontSize: 21, fontWeight: 600, color: NAVY, marginTop: 6, lineHeight: 1.25 }}>{stripDot(plan.goal?.label) || 'A definir'}</Text>
          </View>
          <View style={{ width: 60, alignItems: 'center' }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' }}>
              <SolarIcon name="arrow-right" size={19} color={WHITE} />
            </View>
          </View>
          <View style={{ flex: 1, height: '100%', borderWidth: 1, borderColor: MIST, borderRadius: 20, padding: 24 }}>
            {plan.ids.indicator && <IconBadge name={INDICATOR_ICON[plan.ids.indicator]} size={46} />}
            <View style={{ marginTop: 16 }}><Label>{DECK.signalLabel}</Label></View>
            <Text style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 500, color: NAVY, marginTop: 6, lineHeight: 1.35 }}>{stripDot(plan.scenario.indicator) || 'A definir'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 0.75, borderColor: MIST, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
            <IconBadge name={plan.ids.group ? GROUP_ICON[plan.ids.group] : 'users-group-rounded'} size={38} />
            <View style={{ flex: 1 }}>
              <Label>{DECK.groupLabel}</Label>
              <Text style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600, color: NAVY, marginTop: 4 }}>{plan.scenario.group || 'A definir'}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 0.75, borderColor: MIST, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 }}>
            <IconBadge name="layers" size={38} />
            <View style={{ flex: 1 }}>
              <Label>{DECK.toolsLabel}</Label>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 5 }}>
                {tools.length ? tools.map((t) => (
                  <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <ToolMark id={t} size={15} />
                    <Text style={{ fontSize: 11.5, fontWeight: 500, color: NAVY }}>{TOOL_ENVS.find((x) => x.id === t)?.label}</Text>
                  </View>
                )) : <Text style={{ fontSize: 11.5, color: SOFT }}>A definir</Text>}
              </View>
            </View>
          </View>
        </View>
      </Slide>

      {/* 7 · O que recomendamos: a capacitação, com os 4 cartões do site ("Como funciona"). */}
      <Slide origin={origin} stage={3}>
        <Headline>{DECK.recommendTitle}</Headline>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {DECK.facts.map((f) => (
            <View key={f.title} style={{ flex: 1, height: 204, alignItems: 'center', borderWidth: 0.9, borderColor: '#d3d8de', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 12, backgroundColor: WHITE }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 0.9, borderColor: '#bfe3dc', backgroundColor: TINT, alignItems: 'center', justifyContent: 'center' }}>
                <SolarIcon name={f.icon as SolarName} size={20} color={ACCENT_INK} />
              </View>
              <Text style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 500, color: NAVY, marginTop: 9 }}>{f.title}</Text>
              {/* Altura fixa de duas linhas: o traço de acento fica na mesma altura nos 4 cartões. */}
              <View style={{ marginTop: 7, alignItems: 'center', justifyContent: 'center', height: 32 }}>
                {f.lead.map((line, i) => (
                  <Text key={i} style={{ fontSize: 11, color: INK2, lineHeight: 1.35, textAlign: 'center' }}>
                    {line.map(([txt, bold], j) => <Text key={j} style={bold ? { fontWeight: 600, color: NAVY } : {}}>{txt}</Text>)}
                  </Text>
                ))}
              </View>
              <View style={{ width: 24, height: 2, borderRadius: 1, backgroundColor: ACCENT, marginVertical: 8 }} />
              {f.title === 'Ferramentas' ? (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    {cardLogos.map((t) => <ToolMark key={t} id={t} size={20} />)}
                  </View>
                  {otherTools && <Text style={{ fontSize: 9.5, color: SOFT, marginTop: 8, textAlign: 'center' }}>{DECK.otherTools}</Text>}
                </View>
              ) : <Text style={{ fontSize: 9.5, color: SOFT, lineHeight: 1.45, textAlign: 'center' }}>{f.detail}</Text>}
              {/* No fluxo (posição absoluta empurrava a página e cobria o texto). */}
              {f.title === 'Turma' && groupNote && (
                <View style={{ marginTop: 10, alignSelf: 'stretch', backgroundColor: TINT, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 600, color: ACCENT_INK, textAlign: 'center', lineHeight: 1.35 }}>{groupNote}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        {plan.goal && (
          <View style={{ marginTop: 12, backgroundColor: TINT, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16 }}>
            <Label color={ACCENT_INK}>{DECK.competenciesLabel}</Label>
            {/* Três colunas fixas, sem flexWrap: com chips que quebram linha, o react-pdf
                media a faixa mais alta do que ela é e criava uma página em branco. */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {plan.goal.competencies.map((c) => (
                <View key={c} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: WHITE, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 }}>
                  <SolarIcon name="check-circle" size={11} color={ACCENT_INK} />
                  <Text style={{ flex: 1, fontSize: 10, color: NAVY, fontWeight: 500, lineHeight: 1.3 }}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Slide>

      {/* 8 · O que recomendamos: a jornada de 3 etapas, como no site. */}
      <Slide origin={origin} stage={3}>
        <Headline>{DECK.journeyTitle}</Headline>
        <Text style={{ fontSize: 13, color: SOFT, lineHeight: 1.5, maxWidth: 640, marginTop: -12, marginBottom: 20 }}>{DECK.journeyLead}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          {DECK.journey.map((j, i) => (
            <View key={j.title} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ flex: 1, height: 210, borderRadius: 18, padding: 18,
                borderWidth: 1, borderColor: j.prep ? '#9fb0c0' : '#d3d8de', borderStyle: j.prep ? 'dashed' : 'solid',
                backgroundColor: j.prep ? SURFACE : WHITE }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Pill>{j.label}</Pill>
                  <Text style={{ fontSize: 9, color: SOFT, fontWeight: 500 }}>{j.when}</Text>
                </View>
                <Text style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, color: NAVY, marginTop: 14, lineHeight: 1.25 }}>{j.title}</Text>
                <Text style={{ fontSize: 10.5, color: INK2, marginTop: 8, lineHeight: 1.45 }}>{j.detail}</Text>
                {j.examples && plan.scenario.candidates.length > 0 && (
                  <View style={{ marginTop: 10, backgroundColor: TINT, borderRadius: 10, padding: 9 }}>
                    <Text style={{ fontSize: 9.5, color: NAVY, lineHeight: 1.4 }}>
                      <Text style={{ fontWeight: 600, color: ACCENT_INK }}>{`${DECK.withYourExamples} `}</Text>{plan.scenario.candidates.map((c, i) => (i ? c.charAt(0).toLowerCase() + c.slice(1) : c)).join(' e ')}.
                    </Text>
                  </View>
                )}
              </View>
              {i < DECK.journey.length - 1 && <View style={{ width: 30, alignItems: 'center' }}><ArrowRight width={20} /></View>}
            </View>
          ))}
        </View>
        <Text fixed style={{ position: 'absolute', left: MX, right: 120, bottom: 22, fontSize: 8, color: SOFT, lineHeight: 1.4 }}>{TECH_BOUNDARY}</Text>
      </Slide>

      {/* 9 · Contracapa: site e redes. Sem onda (ela fica só na capa). */}
      <Page size={{ width: W, height: H }} style={{ fontFamily: 'Poppins', backgroundColor: NAVY, color: WHITE, padding: 64, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ justifyContent: 'space-between', width: 480 }}>
          <Image src={`${origin}/radar/logo-empilhado-branco.png`} style={{ width: 170 }} />
          <View>
            <Text style={{ fontFamily: 'Sora', fontSize: 30, fontWeight: 600, color: WHITE, lineHeight: 1.2 }}>{PDF.backTitle}</Text>
            <Text style={{ fontSize: 13, color: WHITE, opacity: 0.75, marginTop: 12, lineHeight: 1.5 }}>{PDF.backText}</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', gap: 18 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ backgroundColor: WHITE, borderRadius: 10, padding: 7 }}>
              <Image src={siteQr} style={{ width: 96, height: 96 }} />
            </View>
          </View>
          {PDF.social.map((n) => (
            <View key={n.label} style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 8, fontWeight: 600, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>{n.label}</Text>
              <Link src={n.href} style={{ fontSize: 12, color: WHITE, textDecoration: 'none', marginTop: 2 }}>{n.text}</Link>
            </View>
          ))}
        </View>
      </Page>

      {/* Apêndice. Abertura com a explicação e o mapa das práticas; depois, um divisor
          por desafio e um slide por prática, cada uma com o seu diagrama. */}
      {plan.appendix.length > 0 && (
        <Slide origin={origin} appendix={{ label: DECK.appendixTitle }}>
          <Headline>{DECK.appendixTitle}</Headline>
          <Text style={{ fontSize: 14, color: INK2, lineHeight: 1.5, maxWidth: 680, marginTop: -10 }}>{DECK.appendixIntro(plan.appendix.length * 3)}</Text>
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 14 }}>
            {DECK.appendixHowTo.map((h, i) => (
              <View key={h} style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: TINT, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 600, color: ACCENT_INK, lineHeight: 1 }}>{i + 1}</Text>
                </View>
                <Text style={{ fontSize: 10.5, color: SOFT }}>{h}</Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 18, gap: 8 }}>
            {plan.appendix.map((c) => (
              <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.75, borderColor: MIST, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 }}>
                <IconBadge name={CHALLENGE_ICON[c.id]} size={28} />
                <Text style={{ fontFamily: 'Sora', fontSize: 11.5, fontWeight: 600, color: NAVY, width: 170 }}>{c.label}</Text>
                {c.pills.map((p, i) => (
                  <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    {i > 0 && <ArrowRight width={16} />}
                    <Pill>{p.stage}</Pill>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Slide>
      )}
      {plan.appendix.flatMap((c) => {
        const quote = CHALLENGES.find((x) => x.id === c.id)?.text;
        return [
          <Slide key={`${c.id}-d`} origin={origin} appendix={{ label: c.label }}>
            <View style={{ flexDirection: 'row', gap: 40, marginTop: 10 }}>
              <View style={{ width: 330 }}>
                <IconBadge name={CHALLENGE_ICON[c.id]} size={58} />
                <Text style={{ fontFamily: 'Sora', fontSize: 32, fontWeight: 600, color: NAVY, marginTop: 22, lineHeight: 1.15 }}>{c.label}</Text>
                {quote && <Text style={{ fontSize: 13, color: SOFT, marginTop: 12, lineHeight: 1.45 }}>“{quote}”</Text>}
              </View>
              <View style={{ flex: 1, gap: 12 }}>
                {c.pills.map((p, i) => (
                  <View key={p.id} style={{ flexDirection: 'row', gap: 16, alignItems: 'center', borderWidth: 0.75, borderColor: MIST, borderRadius: 16, padding: 18 }}>
                    <Text style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 600, color: ACCENT, width: 30 }}>{i + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Pill>{p.stage}</Pill>
                      <Text style={{ fontFamily: 'Sora', fontSize: 13.5, fontWeight: 500, color: NAVY, marginTop: 6, lineHeight: 1.3 }}>{p.title}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Slide>,
          ...c.pills.map((p, pi) => (
            <Slide key={p.id} origin={origin} appendix={{ label: c.label, index: pi }}>
              <View style={{ flexDirection: 'row', gap: 28, height: 330 }}>
                <View style={{ width: 250, justifyContent: 'space-between' }}>
                  <View>
                    <Pill>{p.stage}</Pill>
                    <Text style={{ fontFamily: 'Sora', fontSize: 19, fontWeight: 600, color: NAVY, marginTop: 12, lineHeight: 1.22 }}>{p.title}</Text>
                    <Text style={{ fontSize: 11, color: INK2, marginTop: 10, lineHeight: 1.5 }}>{p.body[0]}</Text>
                  </View>
                  <View style={{ borderWidth: 1, borderColor: ACCENT, borderRadius: 12, padding: 11, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                    <View style={{ marginTop: 1 }}><SolarIcon name="flag" size={14} color={ACCENT_INK} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 8.5, fontWeight: 600, color: ACCENT_INK, letterSpacing: 1.1, textTransform: 'uppercase' }}>{DECK.appendixAction}</Text>
                      <Text style={{ fontSize: 10, color: NAVY, marginTop: 3, lineHeight: 1.35 }}>{ACTIONS[p.action]}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <PracticeDiagram id={p.id} />
                </View>
              </View>
              {/* Faixa do fim: o resultado da prática. */}
              {p.closing && (
                <View fixed style={{ position: 'absolute', left: MX, right: MX, bottom: 40, backgroundColor: TINT, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 14, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <View style={{ marginTop: 1 }}><SolarIcon name="lightbulb" size={14} color={ACCENT_INK} /></View>
                  <Text style={{ flex: 1, fontSize: 10, color: NAVY, lineHeight: 1.4 }}>
                    {p.closing.label ? <Text style={{ fontWeight: 600 }}>{`${p.closing.label}: `}</Text> : null}{p.closing.text}
                  </Text>
                </View>
              )}
            </Slide>
          )),
        ];
      })}
    </Document>
  );
}
