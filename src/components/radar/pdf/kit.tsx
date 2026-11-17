/**
 * Peças comuns do plano em PDF (apresentação 16:9): cores da marca, ícones Solar
 * desenhados com primitivas do react-pdf e rótulos. Usadas pelo `PlanDocument`
 * e pelos diagramas do apêndice (`diagrams.tsx`).
 */
import { View, Text, Svg, Path, Circle, Rect, Ellipse, G } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { SOLAR, type SolarName } from '../icons.ts';

export const NAVY = '#0a2540';
export const INK2 = '#33404e';
export const SOFT = '#5a6672';
export const ACCENT = '#00a88e';
export const ACCENT_INK = '#00735f';
export const SURFACE = '#f4f5f6';
export const MIST = '#e4e4e4';
export const TINT = '#e6f6f3'; // turquesa a ~10% sobre branco
export const WHITE = '#ffffff';

/** Ícone Solar (linear) a partir do `icons.ts`, desenhado com primitivas do react-pdf. */
export function SolarIcon({ name, size = 14, color = NAVY }: { name: SolarName; size?: number; color?: string }) {
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

/** Ícone num círculo (turquesa claro por padrão). */
export function IconBadge({ name, size = 40, bg = TINT, color = NAVY }: { name: SolarName; size?: number; bg?: string; color?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <SolarIcon name={name} size={size * 0.52} color={color} />
    </View>
  );
}

export function Label({ children, color = SOFT }: { children: ReactNode; color?: string }) {
  return <Text style={{ fontSize: 8.5, fontWeight: 600, color, letterSpacing: 1.3, textTransform: 'uppercase' }}>{children}</Text>;
}

export function Pill({ children, bg = TINT, color = ACCENT_INK }: { children: ReactNode; bg?: string; color?: string }) {
  return <Text style={{ alignSelf: 'flex-start', fontSize: 9, fontWeight: 600, color, backgroundColor: bg, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 9 }}>{children}</Text>;
}

/** Seta horizontal fina (conector de diagramas). */
export function ArrowRight({ width = 28, color = ACCENT }: { width?: number; color?: string }) {
  return (
    <Svg width={width} height={10} viewBox={`0 0 ${width} 10`}>
      <Path d={`M 0 5 L ${width - 2} 5 M ${width - 7} 1 L ${width - 2} 5 L ${width - 7} 9`} stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Seta vertical fina (conector de diagramas). */
export function ArrowDown({ height = 18, color = ACCENT }: { height?: number; color?: string }) {
  return (
    <Svg width={10} height={height} viewBox={`0 0 10 ${height}`}>
      <Path d={`M 5 0 L 5 ${height - 2} M 1 ${height - 7} L 5 ${height - 2} L 9 ${height - 7}`} stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Selo navy "IA" (o centro dos fluxos). */
export function AiChip({ size = 30 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'Sora', fontSize: size * 0.36, fontWeight: 600, color: WHITE, lineHeight: 1 }}>IA</Text>
    </View>
  );
}
