"""
Importa a matriz consultiva do retrato (Tela 02) e gera src/data/radar/portrait.ts.

A fonte da verdade é a planilha revisada pelo Thiago (abas "Regras consultivas" e
"Matriz revisada"). Mudou a planilha, rode de novo:

    python scripts/radar-import-retrato.py docs/radar/matriz-retrato-tela02.xlsx

Valida antes de gravar: as 256 combinações existem, cada código casa com o
critério da sua regra, e os textos de cada regra são iguais em todas as linhas.
"""
import itertools
import json
import sys
from pathlib import Path

from openpyxl import load_workbook

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else 'docs/radar/matriz-retrato-tela02.xlsx')
OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'radar' / 'portrait.ts'

wb = load_workbook(SRC, read_only=True)


def table(name):
    rows = list(wb[name].iter_rows(values_only=True))
    head = [h.strip() if isinstance(h, str) else h for h in rows[0]]
    return [dict(zip(head, r)) for r in rows[1:] if any(v is not None for v in r)]


rules = table('Regras consultivas')
matrix = table('Matriz revisada')
fail = []

# Regras: critério em Python sobre p (Pessoas), m (Processos), s (Segurança), k (Disseminação).
RULES = {}
for r in rules:
    RULES[r['Código']] = {
        'axis': r['Eixo'], 'insight': r['Descoberta para o lead'], 'why': r['Por que concluímos isso'],
        'step': r['Primeiro passo recomendado'], 'deliverable': r['Entregável concreto'],
        'criterion': r['Critério (P,M,S,K)'], 'count': r['Ocorrências'],
    }

codes = [''.join(c) for c in itertools.product('ABCD', repeat=4)]
by_code = {r['Código']: r for r in matrix}
if sorted(by_code) != codes:
    fail.append(f'matriz com {len(by_code)} códigos, esperados 256')

values, attentions, extras = [], [], []


def idx(lst, text):
    if text not in lst:
        lst.append(text)
    return lst.index(text)


rows = {}
for code in codes:
    r = by_code.get(code)
    if not r:
        continue
    p, m, s, k = code
    rid = r['Regra']
    rule = RULES.get(rid)
    if not rule:
        fail.append(f'{code}: regra {rid} não existe'); continue
    if not eval(rule['criterion'], {}, {'p': p, 'm': m, 's': s, 'k': k}):
        fail.append(f'{code}: não casa com o critério de {rid}')
    matches = [g for g, x in RULES.items() if eval(x['criterion'], {}, {'p': p, 'm': m, 's': s, 'k': k})]
    if matches != [rid]:
        fail.append(f'{code}: critérios que casam = {matches}')
    for col, key in [('DESC. PRINCIPAL', 'insight'), ('Por que essa leitura?', 'why'),
                     ('Próximo passo prático', 'step'), ('Entrega observável', 'deliverable')]:
        if r[col] != rule[key]:
            fail.append(f'{code}: "{col}" difere do texto da regra {rid}')
    kind = {'O que já existe a favor': 'favor', 'O que ainda precisamos descobrir': 'descobrir'}.get(r['Bloco de valor'])
    if not kind:
        fail.append(f'{code}: bloco de valor desconhecido: {r["Bloco de valor"]}')
    if (r['Pessoas desconhecido?'] == 'SIM') != (p == 'D'):
        fail.append(f'{code}: "Pessoas desconhecido?" não bate com a resposta')
    rows[code] = [rid, kind,
                  idx(values, r['Ponto aproveitável / a confirmar']),
                  idx(attentions, r['Atenção complementar']),
                  idx(extras, r['Ação complementar 1 (PDF)']),
                  idx(extras, r['Ação complementar 2 (PDF)'])]

for rid, x in RULES.items():
    n = sum(1 for v in rows.values() if v[0] == rid)
    if n != x['count']:
        fail.append(f'{rid}: {n} combinações, a planilha diz {x["count"]}')

if fail:
    print('\n'.join(fail)); sys.exit(1)

q = lambda v: json.dumps(v, ensure_ascii=False)
out = [
    '/* Gerado por scripts/radar-import-retrato.py a partir de docs/radar/matriz-retrato-tela02.xlsx.',
    ' * Não edite à mão: mude a planilha e rode o script de novo. */',
    '',
    "export type PortraitRuleId = " + ' | '.join(q(r) for r in RULES) + ';',
    '',
    'export interface PortraitRule {',
    '  axis: string;',
    '  /** Principal descoberta, no cartão e no PDF. */',
    '  insight: string;',
    '  /** "Por que essa leitura?" */',
    '  why: string;',
    '  /** Próximo passo prático. Entra no plano como ação sugerida. */',
    '  step: string;',
    '  /** Entrega observável do próximo passo. */',
    '  deliverable: string;',
    '}',
    '',
    '/** As 22 regras consultivas (critério em P, M, S, K = Pessoas, Processos, Segurança, Disseminação). */',
    'export const PORTRAIT_RULES: Record<PortraitRuleId, PortraitRule> = {',
]
for rid, x in RULES.items():
    out.append(f"  // {x['criterion']}")
    out.append(f"  {rid}: {{ axis: {q(x['axis'])}, insight: {q(x['insight'])}, why: {q(x['why'])}, step: {q(x['step'])}, deliverable: {q(x['deliverable'])} }},")
out += ['};', '', '/** Ponto aproveitável ("O que já existe a favor") ou o que confirmar. */', 'export const PORTRAIT_VALUES = [']
out += [f'  {q(v)},' for v in values]
out += ['] as const;', '', '/** Nota de atenção do cartão. */', 'export const PORTRAIT_ATTENTIONS = [']
out += [f'  {q(v)},' for v in attentions]
out += ['] as const;', '', '/** Ações complementares (só no PDF). */', 'export const PORTRAIT_EXTRAS = [']
out += [f'  {q(v)},' for v in extras]
out += ['] as const;', '',
        "export type ValueKind = 'favor' | 'descobrir';",
        '/** Código "PMSK" → [regra, tipo do bloco de valor, valor, atenção, extra 1, extra 2] (índices nas listas acima). */',
        'export const PORTRAIT_MATRIX: Record<string, [PortraitRuleId, ValueKind, number, number, number, number]> = {']
for code, v in rows.items():
    out.append(f"  {code}: [{q(v[0])}, {q(v[1])}, {v[2]}, {v[3]}, {v[4]}, {v[5]}],")
out += ['};', '']
OUT.write_text('\n'.join(out), encoding='utf-8')
print(f'ok: {len(rows)} combinações, {len(RULES)} regras, {len(values)} valores, {len(attentions)} atenções, {len(extras)} extras → {OUT}')
