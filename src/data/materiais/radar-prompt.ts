/** Prompt do Radar de Pendências, copiado literalmente pelo botão "Copiar".
 *  Não reformate: quebras de linha, `#` e emojis fazem parte do texto que o
 *  visitante cola no Copilot. Os emojis ficam porque são conteúdo do prompt,
 *  não decoração da página (§11). */
export const RADAR_PROMPT = `# Radar de Pendências — Meu briefing diário

Atue como meu assistente de produtividade corporativa.

Analise as informações disponíveis em meus e-mails do Outlook e nas conversas e reuniões do Microsoft Teams dos últimos 7 dias.

Seu objetivo é identificar tudo o que depende de uma ação minha e apresentar um radar de pendências atualizado.

## 1. Identifique

- Solicitações direcionadas a mim que ainda precisam de resposta.
- Entregas, compromissos e prazos que assumi.
- Aprovações ou decisões aguardando minha participação.
- Cobranças e acompanhamentos que recebi.
- Assuntos importantes que ficaram sem encaminhamento.

## 2. Verifique a situação

Considere as respostas e interações posteriores disponíveis para identificar se cada solicitação foi atendida.

Não apresente tarefas já concluídas quando houver evidências de conclusão.

Agrupe solicitações duplicadas e ignore mensagens puramente informativas.

Não considere que toda mensagem não respondida representa uma pendência.

## 3. Organize visualmente

Crie um painel em Markdown com:

**Resumo geral**
- Quantidade de pendências urgentes.
- Quantidade de pendências para esta semana.
- Quantidade de situações que precisam de confirmação.

**Tabela de pendências**

| Prioridade | Pendência | Próxima ação | Prazo | Origem |
|---|---|---|---|---|

Organize por:
- 🔴 Urgente: prazos vencidos ou próximos e solicitações explicitamente críticas.
- 🟡 Atenção: ações previstas para esta semana.
- 🔵 A confirmar: situações sem prazo, responsável ou status suficientemente claro.

Inclua links para os e-mails e mensagens originais sempre que disponíveis.

## 4. Recomende

Ao final, indique as três ações que devo avaliar primeiro, explicando brevemente o motivo.

## Regras importantes

Não invente informações, prazos ou pendências.

Diferencie fatos confirmados de interpretações.

Informe quando alguma fonte não estiver acessível ou quando não conseguir verificar a conclusão de uma tarefa.

Não envie mensagens ou modifique informações.

Apresente um resultado objetivo, fácil de ler e que me ajude a começar o dia com clareza.`;
