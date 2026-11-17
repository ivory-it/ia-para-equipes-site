/**
 * Diagramas do apêndice do plano em PDF: um por prática, escolhido pela forma do
 * conteúdo (ciclo, trilha, matriz, comparação, fluxograma, funil…). Os rótulos
 * estão em `src/data/radar/practice-visuals.ts`.
 *
 * Área de desenho: cerca de 560 × 320 pt (coluna direita do slide de prática).
 * Só Navy e Turquesa (regra anti-rainbow da marca): o "Não" e o "proteger" usam
 * contorno Navy ou hachura, nunca vermelho.
 */
import { View, Text, Svg, Path, Circle, Line } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { PRACTICE_VISUALS, type PracticeVisual } from '../../../data/radar/practice-visuals.ts';
import { NAVY, INK2, SOFT, ACCENT, ACCENT_INK, SURFACE, MIST, TINT, WHITE, SolarIcon, IconBadge, Label, ArrowRight, ArrowDown } from './kit';

export const DIAGRAM_W = 560;
export const DIAGRAM_H = 320;

const t = (size: number, color = INK2, weight = 400) => ({ fontSize: size, color, fontWeight: weight, lineHeight: 1.3 });
const sora = (size: number, color = NAVY, weight = 600) => ({ fontFamily: 'Sora', fontSize: size, color, fontWeight: weight, lineHeight: 1.25 });

function Num({ n, size = 18, dark = true }: { n: number; size?: number; dark?: boolean }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? NAVY : WHITE, borderWidth: dark ? 0 : 1.2, borderColor: ACCENT_INK, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.45, fontWeight: 600, color: dark ? WHITE : ACCENT_INK, lineHeight: 1 }}>{n}</Text>
    </View>
  );
}

/** Linha tracejada de "campo a preencher". */
function FillLine({ width = 120 }: { width?: number | string }) {
  return <View style={{ width, height: 0, borderBottomWidth: 0.9, borderBottomColor: MIST, borderStyle: 'dashed', marginTop: 4 }} />;
}

// ------------------------------------------------------------------ 12 diagramas

function Fan({ v }: { v: Extract<PracticeVisual, { kind: 'fan' }> }) {
  const cardH = 96;
  const gap = 10;
  const ys = v.sources.map((_, i) => i * (cardH + gap) + cardH / 2);
  const mid = (v.sources.length * (cardH + gap) - gap) / 2;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 250, gap }}>
        {v.sources.map((s) => (
          <View key={s} style={{ height: cardH, borderWidth: 0.9, borderColor: MIST, borderRadius: 12, padding: 11, backgroundColor: WHITE }}>
            <Text style={sora(10.5)}>{s}</Text>
            {v.fields.map((f) => (
              <View key={f} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 5 }}>
                <Text style={t(9, SOFT)}>{f}</Text>
                <View style={{ flex: 1 }}><FillLine width="100%" /></View>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Svg width={70} height={v.sources.length * (cardH + gap) - gap}>
        {ys.map((y) => <Path key={y} d={`M 0 ${y} C 40 ${y}, 30 ${mid}, 66 ${mid}`} stroke={ACCENT} strokeWidth={1.4} fill="none" />)}
        <Path d={`M 60 ${mid - 5} L 67 ${mid} L 60 ${mid + 5}`} stroke={ACCENT} strokeWidth={1.4} fill="none" />
      </Svg>
      <View style={{ flex: 1, backgroundColor: NAVY, borderRadius: 16, padding: 18 }}>
        <IconBadge name="archive" size={40} bg={WHITE} color={ACCENT_INK} />
        <Text style={{ ...sora(15, WHITE), marginTop: 14 }}>{v.target}</Text>
        <Text style={{ ...t(10, WHITE), opacity: 0.75, marginTop: 6 }}>{v.targetNote}</Text>
      </View>
    </View>
  );
}

function Sheet({ v }: { v: Extract<PracticeVisual, { kind: 'sheet' }> }) {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View style={{ flex: 1.6, borderWidth: 0.9, borderColor: MIST, borderRadius: 14, backgroundColor: WHITE }}>
        <View style={{ backgroundColor: NAVY, borderTopLeftRadius: 13, borderTopRightRadius: 13, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SolarIcon name="document-text" size={15} color={ACCENT} />
          <Text style={sora(12, WHITE)}>{v.title}</Text>
        </View>
        {v.fields.map((f, i) => (
          <View key={f.k} style={{ flexDirection: 'row', gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: i ? 0.75 : 0, borderTopColor: MIST }}>
            <Num n={i + 1} />
            <View style={{ flex: 1 }}>
              <Text style={sora(11)}>{f.k}</Text>
              <Text style={{ ...t(9.5, SOFT), marginTop: 1 }}>{f.t}</Text>
              <FillLine width="100%" />
            </View>
          </View>
        ))}
      </View>
      <View style={{ flex: 1, marginTop: 30 }}>
        <View style={{ backgroundColor: SURFACE, borderRadius: 14, padding: 14, opacity: 0.9 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <SolarIcon name="chat-round-dots" size={14} color={SOFT} />
            <Text style={sora(11, SOFT)}>{v.versus}</Text>
          </View>
          {[0.9, 0.7, 0.8].map((w, i) => <View key={i} style={{ height: 6, width: `${w * 100}%`, backgroundColor: MIST, borderRadius: 3, marginTop: 8 }} />)}
          <Svg width={150} height={60} style={{ position: 'absolute', top: 18, left: 20 }}>
            <Line x1={0} y1={56} x2={150} y2={4} stroke={NAVY} strokeOpacity={0.55} strokeWidth={1.4} />
          </Svg>
        </View>
        <Text style={{ ...t(10, SOFT), marginTop: 10 }}>{v.versusNote}</Text>
      </View>
    </View>
  );
}

function Loop({ v }: { v: Extract<PracticeVisual, { kind: 'loop' }> }) {
  const W = DIAGRAM_W;
  const cx = W / 2;
  const cy = 150;
  const r = 100;
  const heads = [-45, 45, 135, 225].map((deg) => {
    const a = (deg * Math.PI) / 180;
    const p = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    const tg = { x: -Math.sin(a), y: Math.cos(a) }; // sentido horário
    const n = { x: Math.cos(a), y: Math.sin(a) };
    const tip = { x: p.x + 5 * tg.x, y: p.y + 5 * tg.y };
    const b1 = { x: p.x - 4 * tg.x + 5 * n.x, y: p.y - 4 * tg.y + 5 * n.y };
    const b2 = { x: p.x - 4 * tg.x - 5 * n.x, y: p.y - 4 * tg.y - 5 * n.y };
    const f = (q: { x: number; y: number }) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    return `M ${f(b1)} L ${f(tip)} L ${f(b2)}`;
  });
  const card = (i: number, style: object) => (
    <View key={i} style={{ position: 'absolute', width: 170, flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: WHITE, borderWidth: 0.9, borderColor: MIST, borderRadius: 12, padding: 9, ...style }}>
      <Num n={i + 1} />
      <Text style={{ ...t(10, NAVY, 500), flex: 1 }}>{v.steps[i]}</Text>
    </View>
  );
  return (
    <View style={{ width: W, height: 300 }}>
      <Svg width={W} height={300} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Circle cx={cx} cy={cy} r={r} stroke={ACCENT} strokeWidth={2} fill="none" strokeOpacity={0.6} />
        {heads.map((d) => <Path key={d} d={d} stroke={ACCENT} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
        <Circle cx={cx} cy={cy} r={58} fill={NAVY} />
      </Svg>
      <View style={{ position: 'absolute', left: cx - 58, top: cy - 58, width: 116, height: 116, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={sora(12.5, WHITE)}>{v.center[0]}</Text>
        <Text style={sora(12.5, WHITE)}>{v.center[1]}</Text>
        <Text style={{ ...t(8.5, WHITE), opacity: 0.7, marginTop: 3 }}>{v.centerNote}</Text>
      </View>
      {card(0, { left: cx - 85, top: 6 })}
      {card(1, { left: cx + r + 14, top: cy - 22 })}
      {card(2, { left: cx - 85, top: 246 })}
      {card(3, { left: cx - r - 184, top: cy - 22 })}
    </View>
  );
}

function Matrix({ v }: { v: Extract<PracticeVisual, { kind: 'matrix' }> }) {
  const QW = 220;
  const QH = 130;
  const dot = (label: string, left: number, top: number, hot = false) => (
    <View key={label} style={{ position: 'absolute', left, top, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: hot ? ACCENT : WHITE, borderWidth: 1.4, borderColor: hot ? ACCENT_INK : SOFT }} />
      <Text style={t(9.5, hot ? NAVY : SOFT, hot ? 600 : 400)}>{label}</Text>
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <SolarIcon name="arrow-up" size={11} color={SOFT} />
          <Text style={t(9.5, SOFT, 500)}>{v.y}</Text>
        </View>
        <View style={{ width: QW * 2, height: QH * 2, borderLeftWidth: 1.4, borderBottomWidth: 1.4, borderColor: NAVY }}>
          <View style={{ position: 'absolute', left: QW, top: 0, width: QW, height: QH, backgroundColor: TINT, borderRadius: 4, padding: 12 }}>
            <Text style={sora(12, ACCENT_INK)}>{v.hot}</Text>
            <Text style={{ ...t(9, INK2), marginTop: 3, width: 150 }}>{v.hotNote}</Text>
          </View>
          <View style={{ position: 'absolute', left: QW, top: 0, width: 0, height: QH * 2, borderLeftWidth: 0.75, borderColor: MIST, borderStyle: 'dashed' }} />
          <View style={{ position: 'absolute', left: 0, top: QH, width: QW * 2, height: 0, borderTopWidth: 0.75, borderColor: MIST, borderStyle: 'dashed' }} />
          {dot(v.dots[0], QW + 130, 82, true)}
          {dot(v.dots[1], 60, 60)}
          {dot(v.dots[2], QW + 60, QH + 70)}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <Text style={t(9.5, SOFT, 500)}>{v.x}</Text>
          <SolarIcon name="arrow-right" size={11} color={SOFT} />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <SolarIcon name="shield-check" size={14} color={ACCENT_INK} />
          <Text style={t(9.5, NAVY, 500)}>Risco baixo</Text>
        </View>
        <Text style={t(9, SOFT)}>Na dúvida entre duas tarefas, fique com a mais simples e segura de testar.</Text>
      </View>
    </View>
  );
}

function Compare({ v }: { v: Extract<PracticeVisual, { kind: 'compare' }> }) {
  const cell = (dark: boolean) => (
    <View style={{ flex: 1, height: 52, borderWidth: 1, borderColor: dark ? ACCENT : MIST, borderStyle: 'dashed', borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: dark ? TINT : WHITE }}>
      <Text style={t(9.5, SOFT)}>{v.fill}</Text>
    </View>
  );
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
        <View style={{ width: 150 }} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: SURFACE, borderRadius: 10, paddingVertical: 9 }}>
          <SolarIcon name="user" size={14} color={SOFT} />
          <Text style={sora(11.5, INK2)}>{v.left}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, borderRadius: 10, paddingVertical: 9 }}>
          <SolarIcon name="magic-stick-3" size={14} color={ACCENT} />
          <Text style={sora(11.5, WHITE)}>{v.right}</Text>
        </View>
      </View>
      {v.rows.map((r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 12, marginTop: 10, alignItems: 'center' }}>
          <Text style={{ ...sora(11), width: 150 }}>{r}</Text>
          {cell(false)}
          {cell(true)}
        </View>
      ))}
    </View>
  );
}

function Trail({ v }: { v: Extract<PracticeVisual, { kind: 'trail' }> }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {v.steps.map((s, i) => (
          <View key={s} style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: i === v.steps.length - 1 ? NAVY : WHITE, borderWidth: 1.6, borderColor: i === v.steps.length - 1 ? NAVY : ACCENT, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={sora(15, i === v.steps.length - 1 ? WHITE : ACCENT_INK)}>{i + 1}</Text>
              </View>
              <Text style={{ ...t(10, NAVY, 500), textAlign: 'center', marginTop: 8, paddingHorizontal: 4 }}>{s}</Text>
            </View>
            {i < v.steps.length - 1 && <View style={{ marginTop: 18 }}><ArrowRight width={24} /></View>}
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center', marginTop: 14 }}><ArrowDown height={22} /></View>
      <View style={{ backgroundColor: TINT, borderRadius: 14, padding: 14, marginTop: 6 }}>
        <Label color={ACCENT_INK}>{v.outputsLabel}</Label>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          {v.outputs.map(([label, icon]) => (
            <View key={label} style={{ flex: 1, backgroundColor: WHITE, borderRadius: 10, paddingVertical: 12, alignItems: 'center', gap: 6 }}>
              <SolarIcon name={icon} size={20} color={NAVY} />
              <Text style={t(10, NAVY, 500)}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Policy({ v }: { v: Extract<PracticeVisual, { kind: 'policy' }> }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Label>{v.whoLabel}</Label>
        {v.who.map((w) => <Text key={w} style={{ ...t(9.5, NAVY, 500), backgroundColor: SURFACE, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}>{w}</Text>)}
      </View>
      <View style={{ alignItems: 'center', marginTop: 4 }}><ArrowDown height={16} /></View>
      <View style={{ backgroundColor: NAVY, borderRadius: 10, paddingVertical: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 2 }}>
        <SolarIcon name="shield-check" size={15} color={ACCENT} />
        <Text style={sora(12.5, WHITE)}>Política de uso de IA</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        {v.groups.map((g) => (
          <View key={g.title} style={{ flex: 1, borderWidth: 0.9, borderColor: MIST, borderTopWidth: 3, borderTopColor: ACCENT, borderRadius: 10, padding: 11 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <SolarIcon name={g.icon} size={14} color={ACCENT_INK} />
              <Text style={sora(11.5)}>{g.title}</Text>
            </View>
            {g.items.map((it) => (
              <View key={it} style={{ flexDirection: 'row', gap: 6, marginTop: 7, alignItems: 'flex-start' }}>
                <View style={{ marginTop: 1.5 }}><SolarIcon name="check-circle" size={11} color={ACCENT_INK} /></View>
                <Text style={{ ...t(9.5, INK2), flex: 1 }}>{it}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function Flow({ v }: { v: Extract<PracticeVisual, { kind: 'flow' }> }) {
  const n = v.questions.length;
  return (
    <View style={{ flexDirection: 'row', gap: 0 }}>
      <View style={{ width: 330 }}>
        {v.questions.map((q, i) => (
          <View key={q}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row', gap: 9, alignItems: 'center', borderWidth: 1.2, borderColor: NAVY, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: WHITE }}>
                <SolarIcon name="question-circle" size={16} color={NAVY} />
                <Text style={{ ...t(10.5, NAVY, 500), flex: 1 }}>{q}</Text>
              </View>
              <View style={{ width: 54, alignItems: 'center' }}>
                <Text style={t(8.5, SOFT, 600)}>Não</Text>
                <ArrowRight width={40} color={NAVY} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 26, height: 30 }}>
              <ArrowDown height={22} />
              <Text style={t(8.5, ACCENT_INK, 600)}>Sim</Text>
            </View>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: TINT, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 12, width: 276 }}>
          <SolarIcon name="check-circle" size={18} color={ACCENT_INK} />
          <Text style={sora(13, ACCENT_INK)}>{v.yes}</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 0 }}>
        <View style={{ height: n * 74 - 30, borderWidth: 1.2, borderColor: NAVY, borderStyle: 'dashed', borderRadius: 14, padding: 14, justifyContent: 'center' }}>
          <SolarIcon name="close-circle" size={22} color={NAVY} />
          <Text style={{ ...sora(14), marginTop: 10 }}>{v.no}</Text>
          <Text style={{ ...t(10, SOFT), marginTop: 6 }}>{v.noNote}</Text>
        </View>
      </View>
    </View>
  );
}

/** Hachura diagonal Navy (o "proteger" do documento fictício). */
function Hatch({ width, height }: { width: number; height: number }) {
  const lines: ReactNode[] = [];
  for (let x = -height; x < width; x += 7) lines.push(<Line key={x} x1={x} y1={height} x2={x + height} y2={0} stroke={NAVY} strokeOpacity={0.35} strokeWidth={1} />);
  return <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>{lines}</Svg>;
}

function Document({ v }: { v: Extract<PracticeVisual, { kind: 'document' }> }) {
  const lineW = 260;
  return (
    <View style={{ flexDirection: 'row', gap: 22 }}>
      <View style={{ width: 300, borderWidth: 0.9, borderColor: MIST, borderRadius: 10, padding: 16, backgroundColor: WHITE }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <SolarIcon name="document-text" size={14} color={SOFT} />
          <Text style={t(9.5, SOFT, 600)}>{v.title}</Text>
        </View>
        {v.lines.map((l) => (
          <View key={l.t} style={{ marginTop: 9 }}>
            <View style={{ width: lineW, height: 26, borderRadius: 6, overflow: 'hidden', backgroundColor: l.ok ? TINT : WHITE, borderLeftWidth: 3, borderLeftColor: l.ok ? ACCENT : NAVY, borderWidth: l.ok ? 0 : 0.9, borderColor: NAVY, justifyContent: 'center', paddingHorizontal: 10 }}>
              {!l.ok && <Hatch width={lineW} height={26} />}
              <Text style={t(9.5, NAVY, 500)}>{l.t}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ width: 22, height: 14, borderRadius: 3, backgroundColor: TINT, borderLeftWidth: 3, borderLeftColor: ACCENT }} />
          <Text style={t(9.5, INK2)}>{v.okLabel}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ width: 22, height: 14, borderRadius: 3, borderWidth: 0.9, borderColor: NAVY, overflow: 'hidden' }}><Hatch width={22} height={14} /></View>
          <Text style={t(9.5, INK2)}>{v.protectLabel}</Text>
        </View>
        <View style={{ marginTop: 8, backgroundColor: SURFACE, borderRadius: 12, padding: 14 }}>
          <Label color={ACCENT_INK}>Perguntas do exercício</Label>
          {v.questions.map((q, i) => (
            <View key={q} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 9 }}>
              <Num n={i + 1} />
              <Text style={{ ...t(10, NAVY, 500), flex: 1 }}>{q}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Funnel({ v }: { v: Extract<PracticeVisual, { kind: 'funnel' }> }) {
  const widths = [520, 470, 420, 370];
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ ...t(10, SOFT, 500), marginBottom: 6 }}>{v.top}</Text>
      {v.filters.map((f, i) => (
        <View key={f} style={{ width: widths[i], height: 42, marginTop: 5, borderRadius: 10, backgroundColor: i % 2 ? TINT : '#d4efe9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <SolarIcon name="filter" size={14} color={ACCENT_INK} />
          <Text style={t(10.5, NAVY, 500)}>{f}</Text>
        </View>
      ))}
      <View style={{ marginTop: 6 }}><ArrowDown height={20} /></View>
      <View style={{ marginTop: 4, backgroundColor: NAVY, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <SolarIcon name="flag" size={16} color={ACCENT} />
        <Text style={sora(13, WHITE)}>{v.result}</Text>
      </View>
    </View>
  );
}

function Horizon({ v }: { v: Extract<PracticeVisual, { kind: 'horizon' }> }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 96 }}>
        <View style={{ width: 200, backgroundColor: SURFACE, borderRadius: 12, padding: 12 }}>
          <SolarIcon name="chat-round-dots" size={15} color={NAVY} />
          <Text style={{ ...t(10.5, NAVY, 500), marginTop: 5 }}>{v.question}</Text>
        </View>
        <View style={{ width: 150, alignItems: 'center', paddingBottom: 6 }}>
          <SolarIcon name="eye" size={16} color={ACCENT_INK} />
          <Text style={{ ...t(9.5, ACCENT_INK, 600), textAlign: 'center', marginTop: 4 }}>{v.mid}</Text>
        </View>
        <View style={{ width: 150 }} />
      </View>
      {/* A linha do tempo: Hoje ● ──── ◆ ──── ⚑ 30 dias */}
      <View style={{ height: 40, justifyContent: 'center', marginTop: 8 }}>
        <View style={{ position: 'absolute', left: 14, right: 20, top: 19, height: 2.5, backgroundColor: ACCENT, borderRadius: 2 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: NAVY }} />
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: WHITE, borderWidth: 2.5, borderColor: ACCENT, marginRight: 60 }} />
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' }}>
            <SolarIcon name="flag" size={18} color={WHITE} />
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={sora(13)}>{v.start}</Text>
        <Text style={sora(13, ACCENT_INK)}>{v.end}</Text>
      </View>
      <View style={{ alignSelf: 'flex-end', width: 250, backgroundColor: TINT, borderRadius: 12, padding: 12, marginTop: 10 }}>
        <Label color={ACCENT_INK}>Objetivos observáveis</Label>
        {v.goals.map((g) => (
          <View key={g} style={{ flexDirection: 'row', gap: 6, marginTop: 6, alignItems: 'center' }}>
            <SolarIcon name="check-circle" size={11} color={ACCENT_INK} />
            <Text style={t(10, NAVY, 500)}>{g}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Medidor vazio (semicírculo), sem valor: a empresa mede no piloto. */
function Gauge({ label, note }: { label: string; note: string }) {
  return (
    <View style={{ alignItems: 'center', width: 150 }}>
      <Svg width={86} height={48} viewBox="0 0 86 48">
        <Path d="M 6 44 A 37 37 0 0 1 80 44" stroke={MIST} strokeWidth={8} fill="none" strokeLinecap="round" />
        <Path d="M 6 44 A 37 37 0 0 1 43 7" stroke={ACCENT} strokeWidth={8} fill="none" strokeLinecap="round" strokeOpacity={0.55} />
        <Line x1={43} y1={44} x2={60} y2={24} stroke={NAVY} strokeWidth={2} strokeLinecap="round" />
        <Circle cx={43} cy={44} r={3.5} fill={NAVY} />
      </Svg>
      <Text style={{ ...sora(11.5), marginTop: 4 }}>{label}</Text>
      <Text style={{ ...t(9, SOFT), textAlign: 'center' }}>{note}</Text>
    </View>
  );
}

function Pilot({ v }: { v: Extract<PracticeVisual, { kind: 'pilot' }> }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: 130, gap: 6 }}>
        {v.inputs.map(([label, icon], i) => (
          <View key={label}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', borderWidth: 0.9, borderColor: MIST, borderRadius: 10, padding: 9, backgroundColor: WHITE }}>
              <IconBadge name={icon} size={28} />
              <Text style={sora(11)}>{label}</Text>
            </View>
            {i < v.inputs.length - 1 && <Text style={{ ...sora(12, ACCENT_INK), textAlign: 'center', marginTop: 4 }}>+</Text>}
          </View>
        ))}
      </View>
      <ArrowRight width={26} />
      <View style={{ flex: 1, backgroundColor: SURFACE, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' }}>
        <Label>{v.metricsLabel}</Label>
        <View style={{ marginTop: 10, gap: 10 }}>
          {v.metrics.map(([label, note]) => <Gauge key={label} label={label} note={note} />)}
        </View>
      </View>
      <ArrowRight width={26} />
      <View style={{ width: 120, backgroundColor: NAVY, borderRadius: 14, padding: 14, alignItems: 'flex-start' }}>
        <SolarIcon name="rocket-2" size={22} color={ACCENT} />
        <Text style={{ ...sora(12.5, WHITE), marginTop: 10 }}>{v.result}</Text>
      </View>
    </View>
  );
}

export function PracticeDiagram({ id }: { id: string }) {
  const v = PRACTICE_VISUALS[id];
  if (!v) return null;
  switch (v.kind) {
    case 'fan': return <Fan v={v} />;
    case 'sheet': return <Sheet v={v} />;
    case 'loop': return <Loop v={v} />;
    case 'matrix': return <Matrix v={v} />;
    case 'compare': return <Compare v={v} />;
    case 'trail': return <Trail v={v} />;
    case 'policy': return <Policy v={v} />;
    case 'flow': return <Flow v={v} />;
    case 'document': return <Document v={v} />;
    case 'funnel': return <Funnel v={v} />;
    case 'horizon': return <Horizon v={v} />;
    case 'pilot': return <Pilot v={v} />;
  }
}
