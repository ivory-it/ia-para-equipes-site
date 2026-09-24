# AGENTS.md — landing page em `ia-para-equipes/`

Leia este arquivo antes de qualquer tarefa neste projeto. O `README.md` ao lado é para
quem vai **rodar e publicar**; este é para quem vai **trabalhar no conteúdo**.

## O que este projeto é hoje

Uma landing page em Astro 7 com a identidade visual **IA para Equipes by Ivory**, no meio da
troca de conteúdo. A migração de tecnologia portou o site do **"Pulsedesk"** (SaaS fictício
de gestão de tarefas, R$12/usuário/mês) sem tocar no texto, para a conversão ser verificada
contra um gabarito. Agora o conteúdo está sendo trocado pelo da **capacitação corporativa em
IA**, e o alvo já foi confirmado pelo Thiago.

**A troca é feita uma seção por vez**, e o Thiago diz qual. Não mexa nas outras seções
enquanto trabalha numa. Situação em 24/09/2026:

| Seção | Estado |
|---|---|
| `Hero.astro` | **fechada**, com o conteúdo da capacitação (ver "Hero — decisões tomadas") |
| `Context.astro` ("Por que esta capacitação") | **fechada**, seção nova logo após a Hero (ver "Por que esta capacitação — decisões tomadas") |
| `Structure.astro` ("Como funciona") | **fechada**, seção nova logo após o Context (ver "Como funciona — decisões tomadas") |
| `Experience.astro` ("A experiência da Ivory") | **fechada**, seção nova logo após o Structure (ver "A experiência da Ivory — decisões tomadas") |
| `Investment.astro` ("Investimento") | **fechada**, seção nova logo após o Experience (ver "Investimento — decisões tomadas") |
| `Contact.astro` ("Contato") | **fechada**, última seção nova, logo após o Investment (ver "Contato — decisões tomadas") |
| `Header.astro` e `Footer.astro` | logo da IA para Equipes desde 23/09/2026 (ver "Logo — decisões tomadas"). Menu com Corporativa, Desenvolvedores, Jornada IA e Blog, todos com `href="#"` até as URLs chegarem. O `NAV_ITEMS` do `nav.ts` alimenta o header, o drawer mobile e a coluna Páginas do rodapé, e o `CTA` do header ("Iniciar teste grátis") saiu. No rodapé saíram a descrição, a coluna Recursos, o Twitter e o Dribbble, e os links "Feito para times focados" e "Comece grátis". Ficaram LinkedIn, Instagram e Privacidade, todos com `#`. A grade do rodapé em `lg` é `1fr auto auto` com `gap-x-20`, para Páginas e Redes sociais ficarem juntas na direita. Com frações, sobrava um vão de uns 350 px entre elas. O copyright é "© 2026 Ivory." e leva `data-reveal-skip`: colado no fim da página, nunca passava dos 88% do reveal e ficava invisível. Ainda Pulsedesk: o `title`/`description` do `index.astro` |
| As oito seções de template (01 a 07 e `Cta.astro`) | **fora da página** desde 23/09/2026. Os arquivos continuam em `sections/` |

Trocar o copy é uma mudança de produto, não só de texto. Seções inteiras deixam de fazer
sentido: preço por usuário/mês não existe num serviço de capacitação, e a "Prévia do
produto" mostra um software que não existe. Antes de reescrever uma seção, confirme com o
Thiago o que ela vira.

**As seções de template saíram da página, mas os arquivos ficam.** Em 23/09/2026, com as
seis seções novas prontas, o Thiago tirou as oito seções de template do `index.astro`. Os
componentes continuam em `sections/`, porque servem de exemplo (o `Context.astro` saiu da
casca do `Problem.astro`, o `Investment.astro` da do `Pricing.astro`). Uma seção nova entra
como componente próprio, e não por cima de um template. Não proponha apagar os arquivos de
template: quem decide quando eles saem é o Thiago. A numeração dos rótulos ("01 ·"…) deixou
de importar, porque nenhuma seção exibida tem número.

**Trabalhe com marcos no git.** Antes de uma mudança grande, faça um commit na `main` como
ponto de retorno e trabalhe numa branch. Foi o que aconteceu com a foto da Hero (branch
`hero-imagem`), com a seção de contexto (branch `secao-contexto`), com a seção "Como
funciona" (branch `secao-como-funciona`) e com a seção de experiência (branch
`secao-experiencia`). A branch `secao-investimento` levou junto a seção de contato, a troca
dos CTAs para `#contato`, a saída dos templates da página e o corte do bloco de chamada do
Footer. A branch `logo-marca` trocou o logo e limpou o menu e o rodapé. As seis entraram na
`main` por fast-forward, e o histórico segue linear. Commit só com o pedido do Thiago.

## Onde o conteúdo mora — leia antes de procurar

**Não existe camada de dados para o copy.** São cerca de 270 trechos de texto escritos
direto no markup, espalhados por onze componentes. Só duas coisas foram extraídas para
`src/data/`, e por necessidade técnica, não de conteúdo: `nav.ts` (compartilhado entre o
header, o drawer mobile e a coluna Páginas do rodapé) e `pricing.ts` (compartilhado entre os cards e o alternador).

Isso foi uma escolha, não um esquecimento — o Thiago optou por "portar como está" em vez de
extrair o conteúdo para arquivos de dados. Se a etapa de conteúdo for grande, **proponha
extrair antes de começar**; editar 270 trechos inline é onde os erros acontecem.

Mapa de seções (`src/components/sections/`, compostas por `src/pages/index.astro`):

| Arquivo | Papel na página | Volume |
|---|---|---|
| `Hero.astro` | rótulo, título, promessa, CTAs, fatos da oferta, foto da equipe | ~10 trechos (concluída) |
| `Context.astro` | "Por que esta capacitação": diagrama do uso individual para a prática corporativa. Copy nos arrays `before`/`after` do frontmatter | ~25 trechos (concluída) |
| `Structure.astro` | "Como funciona": quatro cards de formato e a jornada em três etapas. Copy nos arrays `facts`/`tools`/`steps` do frontmatter | ~25 trechos (concluída) |
| `Experience.astro` | "A experiência da Ivory": faixa de logos de clientes, nota de marca e cinco números. Copy nos arrays `clients`/`stats` do frontmatter | ~15 trechos |
| `Investment.astro` | "Investimento": dois cards (turma padrão e personalizada) e nota de rodapé. Copy no array `plans` do frontmatter | ~20 trechos |
| `Contact.astro` | "Contato": título, apoio e formulário. Comportamento em `src/scripts/contact-form.ts` | ~15 trechos |
| `ProductPreview.astro` (fora da página) | "01 · Prévia do produto" — mockup grande da aplicação | ~54 trechos |
| `Problem.astro` (fora da página) | "02 · O problema" — três cards de dor | ~26 |
| `HowItWorks.astro` (fora da página) | "03 · Como funciona" — quatro passos | ~37 |
| `Benefits.astro` (fora da página) | "04 · Principais benefícios" — quatro cards com ícone | ~18 |
| `Reviews.astro` (fora da página) | "05 · Prova social" — depoimento e números | ~17 |
| `Pricing.astro` (fora da página) | "06 · Preços" — três planos + alternador mensal/anual | ~39 |
| `Faq.astro` (fora da página) | "07 · Perguntas frequentes" — quatro pares | ~18 |
| `Cta.astro` (fora da página) | chamada final | ~4 |

`Header.astro` e `Footer.astro` ficam em `src/components/`.

## Hero — decisões tomadas

Cada item traz o racional, para que ninguém desfaça a decisão sem querer.

- **Sem fundo WebGL.** A cena em Three.js chamava mais atenção que o título. Saiu junto com
  a dependência `three` e os scripts que a carregavam. O fundo agora é só o CSS da marca.
- **A foto substituiu o mockup.** O painel do Pulsedesk simulava um software, e a
  capacitação não é um. A foto `src/assets/equipe-hero.png` já vem recortada, com fundo
  transparente. O `<Image>` do Astro gera WebP com transparência (de 1,6 MB para
  43–134 KB). O `hero-parallax.ts` saiu com o mockup.
- **A foto vai até a borda da moldura, não até a borda da janela.** A página inteira fica
  dentro de uma moldura de 1360 px (`Base.astro`). Por isso a foto avança só o padding da
  seção (`lg:w-[calc(100%+2.5rem)]`). Com `100vw`, ela passava da moldura em telas largas
  e a quarta pessoa era cortada.
- **A foto some no celular (abaixo de `md`, 768 px).** Empilhada embaixo dos fatos, ela empurrava a
  próxima seção para longe. O ponto de corte é o mesmo em que o header troca o menu pelo drawer.
  No tablet a foto continua. Como a imagem é `loading="eager"`, o navegador baixa mesmo escondida,
  e por isso o `sizes` termina em `1px`: o celular baixa só a variante de 640w.
- **A coluna da foto tem `lg:h-[43rem]`.** É a altura do mockup antigo, e é ela que mantém a
  Hero com 880 px e a próxima seção abaixo da dobra. Sem essa altura, a Hero encolhe.
- **Tamanho do título.** `lg:text-[2.75rem] xl:text-[3.5rem]`. Entre 1024 e 1280 px o tamanho
  cheio deixava o "IA." sozinho na linha.
- **Faixa de fatos abaixo dos CTAs.** Até 50 participantes · 2 encontros online de 2 horas ·
  R$ 12 mil por turma. Os dados ficam no array `facts`, no frontmatter do `Hero.astro`.
- **Os CTAs apontam para `#contato` e `#como-funciona`.** Até existir a seção de contato,
  eles usavam as âncoras do template (`#pricing` e `#how`).

## Por que esta capacitação — decisões tomadas

Seção nova (`src/components/sections/Context.astro`, `id="contexto"`), logo após a Hero. A
referência é `inspiracao/hero_explicativa.png`: o uso individual à esquerda, a prática
corporativa à direita e, no meio, a capacitação.

- **Componente novo, não edição de template.** A casca (fundo, grade, contêiner) veio de
  `Problem.astro`, que continua intacto como referência (ver a regra dos templates acima).
- **Rótulo sem número** ("Por que esta capacitação"), como todas as seções novas. Os números
  ("01 ·"…) eram dos templates, que saíram da página.
- **Cabeçalho no padrão das demais seções:** título à esquerda, parágrafo e um CTA à direita.
  O CTA é o mesmo botão primário da Hero ("Quero capacitar minha equipe", `#contato`).
  Se o destino mudar, os dois mudam juntos.
- **Espaço de 48 px (`mt-12`) entre o cabeçalho e o diagrama,** o mesmo das seções 02 a 07.
  Com 64–80 px, o diagrama parecia solto do cabeçalho.
- **Mais contraste que a referência.** A esquerda é de propósito neutra, com cards
  translúcidos e ícone cinza. A direita tem cards sólidos, sombra e chip turquesa. É o
  contraste entre os dois lados que conta a passagem.
- **Os conectores dependem de medidas fixas.** A coluna do meio tem 24rem (384 px) e os
  cards têm `xl:h-36` com `gap-3`, o que dá 612 px de pilha. As curvas do SVG foram
  calculadas para esse `viewBox`. Mudou a altura do card, o gap ou a largura da coluna,
  recalcule os pontos no array `connectors`.
- **O diagrama de três colunas só começa em 1280 px (`xl`).** O copy dos cards tem de 60 a
  100 caracteres. Em 1024 px, a coluna de texto teria cerca de 200 px, e o detalhe quebraria
  em 4 a 5 linhas. Abaixo de `xl`, as colunas ficam empilhadas e os cards têm altura
  automática. Os 144 px do card comportam título e 4 linhas em 1280 px, que é o que ocupa
  o detalhe mais longo ("Aprendizado disperso").
- **A animação mora em `src/scripts/context-flow.ts`,** e o diagrama leva
  `data-reveal-skip` para o reveal global não brigar com ela. No desktop é uma linha do
  tempo única, de cerca de 3 s. Abaixo de 1280 px, cada bloco tem seu gatilho. Com
  `prefers-reduced-motion`, nada é escondido. O tracejado que corre em loop é o
  `animate-dash-flow` do `global.css`, com `motion-safe:`.

## Como funciona — decisões tomadas

Seção nova (`src/components/sections/Structure.astro`, `id="como-funciona"`), logo após o
Context. A referência é `inspiracao/como_funciona.png`. O `HowItWorks.astro` continua
intacto como template (ver a regra dos templates).

- **Diagnóstico de maturidade antes das sessões.** Não está na referência. A jornada tem três
  etapas: Diagnóstico ("Após a contratação") → Sessão 1 · Fundamentos → Sessão 2 · Aplicação.
  O diagnóstico é translúcido, com borda tracejada. As sessões são sólidas, com sombra. É a
  mesma lógica de contraste do Context: primeiro a preparação, depois o encontro ao vivo.
- **Etapas sem ícone e sem numeral.** A primeira versão tinha um círculo com "1" e "2" nas
  sessões e uma prancheta no diagnóstico. O círculo verde chamava mais atenção que a pílula
  "Etapa 0X", que é quem deve guiar a leitura. Saíram os três.
- **As três colunas da jornada só começam em 1280 px (`xl`).** Em 1024 px o texto das sessões
  quebrava em 4 a 5 linhas. Abaixo de `xl`, os cards ficam empilhados, ligados por um
  tracejado vertical. O tracejado é estático, e quem anima é o reveal global.
- **Logos monocromáticos no card Ferramentas.** A referência usa os logos coloridos, e a §11
  proíbe ícones coloridos variados (anti-rainbow). Os paths ficam inline no array `tools`,
  em `currentColor`. OpenAI e Claude vêm do simple-icons (CC0). O Microsoft Copilot vem do
  selfh.st/icons (CC BY 4.0), porque o simple-icons não traz as marcas da Microsoft.
- **O destaque de cada card tem `md:min-h-12` (duas linhas).** Sem isso, o traço de acento
  da Modalidade, que tem uma linha só, ficava mais alto que o dos vizinhos.
- **O traço laranja da referência virou turquesa** (`bg-accent`). O turquesa é o único
  acento da marca, e o traço é decoração, não texto.
- **O CTA é o mesmo da Hero e do Context** ("Quero capacitar minha equipe", `#contato`). Os
  três mudam juntos.
- **O CTA secundário da Hero ("Como funciona") aponta para `#como-funciona`,** esta seção.

## A experiência da Ivory — decisões tomadas

Seção nova (`src/components/sections/Experience.astro`, `id="experiencia"`), logo após o
Structure. A referência é `inspiracao/capacidade_ivory.png`. O template mais próximo, o
`Reviews.astro` ("05 · Prova social"), continua intacto.

- **Sem parágrafo nem CTA no cabeçalho.** A referência não tem, e a seção é prova, não
  chamada. Três CTAs iguais seguidos (Hero, Context, Structure) já bastam.
- **Logos em PNG, vindos de `../../site-capacitacao-ia/assets/`,** copiados para
  `src/assets/clientes/`. O `<Image>` gera WebP (de 30–52 KB para 2–6 KB cada).
- **Logos sempre em cinza (`grayscale opacity-60`), sem cor no hover.** É a regra
  anti-rainbow da §11, a mesma dos logos de ferramentas do Structure.
- **Altura por logo, não uma altura única.** As proporções vão de 1,2:1 (Unilever) a
  6,5:1 (Lundin). Com a mesma altura, a Lundin ficava enorme e a Unilever sumia. O campo
  `h` do array `clients` é a altura exibida em px.
- **Números sem `tabular-nums`.** Com algarismos tabulares, o "1" de "+160" abria um vão.
  Aqui os números não se alinham em coluna, então os proporcionais servem melhor.
- **Os números usam `<dl>`.** O rótulo é o `<dt>` e o número é o `<dd>`, e o
  `flex-col-reverse` põe o número em cima. O `divide-x` só entra em `lg`, quando os cinco
  cabem numa linha. Abaixo disso, a grade tem duas colunas.

## Investimento — decisões tomadas

Seção nova (`src/components/sections/Investment.astro`, `id="investimento"`), logo após o
Experience. Saiu da casca do `Pricing.astro` ("06 · Preços"), que continua intacto com o
`pricing.ts` e o `PricingToggle.tsx`.

- **Dois cards, sem alternador mensal/anual.** A capacitação é cobrada por turma. Por isso a
  seção não usa o `PricingToggle` nem os atributos `data-plan`/`data-price-*`.
- **Turma padrão destacada, personalizada neutra.** A padrão usa a casca do card "Pro"
  (borda e gradiente turquesa, sombra). A personalizada usa a do "Starter". O preço fechado é
  a oferta principal, e o sob consulta é a alternativa.
- **Sem "Mais escolhido" na pílula.** Seria um dado inventado. As pílulas são "Padrão" e
  "Customizável".
- **Sem CTA no cabeçalho.** Os botões estão nos cards.
- **A pílula fica na linha do rótulo, não ao lado do título.** No template ela ficava ao
  lado do título e tomava cerca de 130 px (109 da pílula "Customizável" e 24 do espaço
  entre eles). "Capacitação personalizada" precisa de 316 px e só tinha 304 em 1440 px,
  por isso quebrava. Com a pílula em cima, o título usa a largura toda do card (395 px em
  1024 e 436 em 1440).
- **Os cards alinham por `subgrid`.** Em `lg`, cada card é um subgrid de 5 linhas (cabeçalho,
  preço, botão, divisor, lista). Se o título ou o parágrafo de um card quebra em mais linhas,
  a linha cresce nos dois cards, e preço, botão e lista seguem na mesma altura. A primeira
  versão corrigia com `min-h` texto a texto, e cada troca de copy desalinhava de novo. Se
  entrar ou sair um bloco no card, ajuste o `lg:row-span-5`.
- **Preço em `text-4xl sm:text-5xl` e card com `p-6 sm:p-8`.** Em 390 px, o "Sob consulta"
  quebrava em duas linhas e o botão "Quero capacitar minha equipe" também.
- **Os botões dos cards apontam para `#contato` e já levam o formato.** Cada botão tem
  `data-contact-plan` (`padrao` ou `personalizado`), vindo do campo `plan` do array `plans`.
  O `contact-form.ts` marca o rádio correspondente no formulário. Os valores precisam casar
  com o array `formats` do `Contact.astro`.
- **Itens do card personalizado aprovados pelo Thiago:** tudo da turma padrão, práticas em
  jornadas reais, exemplos das áreas e carga horária e turmas ajustadas.

## Contato — decisões tomadas

Seção nova (`src/components/sections/Contact.astro`, `id="contato"`), logo após o Investment.
É o destino de todos os CTAs "Quero capacitar minha equipe". A composição vem do topo do
`Footer.astro` ("Vamos colocar o trabalho sob controle."), com título grande à esquerda e
apoio à direita. O Footer continua intacto como template.

- **O envio ainda é simulado.** O Thiago escolheu fazer só a interface agora. O destino fica
  em `CONTACT_ENDPOINT`, no topo de `src/scripts/contact-form.ts`. Com `null`, o formulário
  valida e mostra a confirmação sem enviar nada. Para integrar (Web3Forms, Formspree, Vercel
  Function), troque a constante, e o corpo sai como `FormData`. **Enquanto for `null`, um
  contato real se perde.** Não publique assim.
- **Campos:** nome, e-mail corporativo, telefone, colaboradores a capacitar e formato de
  interesse. Todos são obrigatórios.
- **E-mail corporativo de verdade.** Domínios gratuitos (gmail, hotmail, outlook, yahoo,
  icloud, bol, uol, terra) são recusados com `setCustomValidity`. A lista é `FREE_DOMAINS`.
- **Telefone com máscara leve,** `(00) 0000-0000` ou `(00) 00000-0000`, e exige DDD.
- **Colaboradores em faixas** (até 50, 51 a 100, 101 a 250, mais de 250). As faixas partem
  da turma padrão de 50.
- **O formato chega preenchido.** Os botões dos cards de investimento levam
  `data-contact-plan`, e `?formato=padrao|personalizado` na URL faz o mesmo para links
  externos. Os CTAs das outras seções não escolhem: quem escolhe é o visitante.
- **Rádios "Turma padrão" / "Personalizada",** os mesmos nomes dos rótulos dos cards. Com
  "Capacitação personalizada", a pílula quebrava em duas linhas em 1440 px.
- **Validação nativa do navegador,** sem token de cor de erro novo. O `reportValidity()`
  mostra o balão do próprio navegador.
- **As duas colunas só começam em `xl`.** Em 1024 px o card do formulário ficava com cerca de
  390 px, o placeholder do telefone era cortado e os rótulos quebravam. Abaixo de `xl`, o
  formulário vem embaixo do texto, com `max-w-2xl`.
- **Nota de privacidade curta** ao lado do título ("Usamos seus dados só para responder a
  este contato."). É LGPD no tom da §8, sem alarme.

## Logo — decisões tomadas

- **Lockup empilhado, versão navy.** É o que tem a onda à esquerda, o que o Thiago pediu e o que a
  §5 indica para a barra de navegação. O arquivo é `src/assets/marca/logo-empilhado-navy.svg`,
  extraído sem edição de `ia-para-equipes-brand/assets/` no zip da skill. Não redesenhe nem
  recolora o SVG, porque a §5 proíbe.
- **Header com 88 px (`h-[5.5rem]`) e logo com 72 px de altura (`h-[4.5rem]`, cerca de 116 px de
  largura).** Com os 64 px do template, o logo teria cerca de 77 px de largura, e o "BY IVORY."
  ficaria com uns 2 px, ilegível. Os 116 px ainda ficam abaixo do mínimo de 350 px da §5. É uma
  exceção aprovada pelo Thiago, porque um header de 350 px de logo tomaria a dobra.
- **Rodapé com 350 px (`w-[350px] max-w-full`),** que cumpre o mínimo. Em 390 px de tela, o
  `max-w-full` limita o logo a cerca de 310 px, para não estourar o padding.
- **`<Image>` do `astro:assets`, e não SVG inline.** O SVG tem 185 KB. Inline, ele entraria duas
  vezes no HTML. Como arquivo, o navegador baixa uma vez e guarda em cache.

## Armadilhas técnicas que já custaram tempo

- **Ícone novo precisa entrar no `astro.config.mjs`.** O `include` do `astro-icon` restringe
  quais ícones Solar entram no build. Um ícone fora da lista quebra o build com a mensagem
  `Unable to locate "solar:..." icon`.
- **Itens na dobra somem com o scroll-reveal.** O `reveal.ts` esconde todo
  `h1…h4/p/li` de `main section` até o elemento passar de 88% da altura da tela. O que fica
  colado na borda da primeira tela nasce invisível até o visitante rolar. Se o item está
  dentro de um contêiner que já é `.reveal`, marque-o com `data-reveal-skip`, e ele entra
  junto com o contêiner. A faixa de fatos da Hero usa isso.
- **Reinicie o `astro dev` depois de `npm install` ou `npm uninstall`.** Com o servidor no
  ar, o Vite passa a responder 504 (Outdated Optimize Dep) para o GSAP. O reveal para de
  funcionar sem erro visível.
- **Captura de tela para validação visual.** O `msedge --headless --screenshot` direto sai
  com código 21. O que funciona: `npx playwright screenshot --channel msedge
  --viewport-size=1440,900 <url> <arquivo>`, ou um script Playwright com
  `chromium.launch({ channel: 'msedge' })`. Rode a partir de um caminho curto
  (`%TEMP%`), porque o caminho deste projeto no OneDrive passa do limite do Windows para o
  `node`. Valide pelo menos 1024, 1440, 1920 e 390 px.
- **Captura da seção de contexto sai vazia se tirada cedo demais.** O diagrama só aparece
  quando o `ScrollTrigger` dispara, e a linha do tempo leva cerca de 3 s. No script,
  role até `#contexto` (no mobile, em etapas, porque cada bloco tem seu gatilho), espere
  uns 3,5 s e só então capture. Seção vazia na captura não é bug. Para conferir o estado
  estático, use `reducedMotion: 'reduce'` no `newPage`.

## Identidade visual — o que restringe o texto

As diretrizes completas estão em `../ia-para-equipes-brand.skill`, um zip na pasta acima:

```bash
unzip -p ../ia-para-equipes-brand.skill ia-para-equipes-brand/SKILL.md
```

Para trabalho de conteúdo, o que mais pesa é a **§8, tom de voz**: segurança, governança,
clareza, aplicação prática. Frases curtas. Verbo no imperativo em chamadas. Concreto acima
de conceitual. Pergunta provocativa é permitida ("quem responde pela LGPD?"), alarmismo não.

A §8 lista clichês proibidos, e vale conferir o texto contra ela antes de entregar:
*elevar, sem atritos, destravar, nova geração, divisor de águas, mergulhar, revolucionar,
descomplicar, solução completa, de ponta a ponta, impulsionar, potencializar, transformar
(vazio), robusto, escalável (como muleta), no mundo de hoje, "não é só X, é Y"*.

Duas regras visuais que o conteúdo esbarra:

- **Sem emoji.** A §11 proíbe em qualquer papel — ícone, bullet, decoração. Hoje há um 👋 em
  "Bem-vindo de volta, Alex" no mockup do produto, herdado do template. Deve sair.
- **Turquesa nunca em texto.** `--color-accent` (#00A88E) dá 2,7:1 sobre o fundo cinza. Para
  texto de acento use `text-accent-ink` (verde profundo, 5,2:1). Os tokens e seus contrastes
  estão documentados em `src/styles/global.css`.

## Como verificar depois de mexer

```bash
npm run check    # tsc --noEmit
npm run build    # check + build
npm run preview  # serve o dist/, que é o que vai para produção
```

Quando o conteúdo mudar, a checagem de texto contra o HTML original **deixa de valer** —
ela existia para provar que a migração não alterou nada. O que continua valendo:

- **Contraste.** Texto novo pode entrar com cor errada. A regra do turquesa é a que mais
  escapa; confira que nenhum texto pequeno usa `text-accent`.
- **O alternador de preços.** Se a seção de preços mudar de forma, o contrato
  `data-plan` / `data-price-*` em `Pricing.astro` precisa acompanhar — quem lê esses
  atributos é `src/components/react/PricingToggle.tsx`.
- **`prefers-reduced-motion`.** Emule no DevTools e confirme que todo o texto nasce visível.
  O scroll-reveal do GSAP tem guarda para isso; é a regressão mais fácil de introduzir sem
  perceber.

## Convenções

- Português do Brasil, tom direto e prático (regra do vault).
- Ao documentar uma decisão, registre o racional, não só a escolha.
