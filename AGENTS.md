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
| `Header.astro` e `Footer.astro` | logo da IA para Equipes desde 23/09/2026 (ver "Logo — decisões tomadas"). Desde 06/10/2026, o menu leva às seções desta página: Por que capacitar (`#contexto`), Como funciona, Experiência e Investimento. Contato ficou de fora, porque os CTAs já levam até lá. Corporativa, Desenvolvedores, Jornada IA e Blog voltam quando essas páginas existirem. O `html` tem `scroll-padding-top: 5.5rem` (no `global.css`): o header é sticky com 88 px, e sem isso a âncora parava com o topo da seção escondido atrás dele. O `NAV_ITEMS` do `nav.ts` alimenta o header, o drawer mobile e a coluna Páginas do rodapé, e o `CTA` do header ("Iniciar teste grátis") saiu. No rodapé saíram a descrição, a coluna Recursos, o Twitter e o Dribbble, e os links "Feito para times focados" e "Comece grátis". Ficaram LinkedIn e Instagram, com os perfis da IA para Equipes desde 06/10/2026 (abrem em nova aba), e Privacidade, ainda com `#`. A grade do rodapé em `lg` é `1fr auto auto` com `gap-x-20`, para Páginas e Redes sociais ficarem juntas na direita. Com frações, sobrava um vão de uns 350 px entre elas. O copyright é "© 2026 Ivory." e leva `data-reveal-skip`: colado no fim da página, nunca passava dos 88% do reveal e ficava invisível. O `title` ("IA para Equipes by Ivory | Capacitação corporativa em IA") e a `description` do `index.astro` saíram do Pulsedesk em 07/10/2026, e o favicon também (ver "Favicon — decisões tomadas") |
| `diagnostico-ia/index.astro`, `diagnostico-ia/video.astro` e `RadarCta.astro` | **Diagnóstico IA (no código, "Radar IA"), desde 11/11/2026**: jornada interativa em cinco etapas (as sete telas do documento, sem a descoberta e o fechamento) com PDF executivo, em `/diagnostico-ia`, feita a partir do documento "Radar IA v1.6" (conversa guiada progressiva). Destaque na home entre o Experience e o Investment, e "Diagnóstico IA" é o quinto item do menu (ver "Radar IA — decisões tomadas") |
| `materiais/index.astro` e `materiais/radar-de-pendencias-copilot.astro` | **páginas novas desde 09/11/2026**: o índice dos materiais gratuitos, com um card por material, e o material do reels do Radar de Pendências. "Materiais" é o sexto item do menu e do rodapé, depois do Radar IA (ver "Materiais — decisões tomadas") |
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
| `Structure.astro` | "Como funciona": quatro cards de formato e a jornada em três etapas, trocada pelo vídeo em `lg` quando o navegador permite (`src/scripts/journey-video.ts`). Copy nos arrays `facts`/`tools`/`steps` do frontmatter | ~25 trechos (concluída) |
| `Experience.astro` | "A experiência da Ivory": faixa de logos de clientes, nota de marca, cinco números e o bloco de parcerias e certificações. Copy nos arrays `clients`/`stats`/`partners`/`certifications` do frontmatter | ~25 trechos |
| `Investment.astro` | "Investimento": dois cards (turma padrão e personalizada) e nota de rodapé. Copy no array `plans` do frontmatter | ~20 trechos |
| `Contact.astro` | "Contato": título, apoio e formulário com envio ao receptor de leads da Ivory. Comportamento em `src/scripts/contact-form.ts` | ~25 trechos |
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
- **Faixa de fatos abaixo dos CTAs.** Até 50 participantes por turma · 2 encontros online de 2 horas ·
  R$ 12 mil por turma. Os dados ficam no array `facts`, no frontmatter do `Hero.astro`.
  "participantes por turma" não cabe numa linha nas três colunas (de 640 px para cima), então o
  detalhe tem `text-balance` (quebra em "participantes / por turma", e não "participantes por /
  turma"). De `sm` para cima, os itens alinham pelo topo (`sm:items-start`). Centralizados, o
  "Até 50" ficava mais alto que os vizinhos.
- **Os CTAs apontam para `#contato` e `#como-funciona`.** Até existir a seção de contato,
  eles usavam as âncoras do template (`#pricing` e `#how`).
- **O CTA primário diz "Quero avaliar para minha equipe"** desde 06/10/2026 (antes, "Quero
  capacitar minha equipe"). O mesmo texto vale para o Context, o Structure e o card da turma padrão.
- **"prática corporativa" nasce destacada,** num `<mark>` com o mesmo visual do `::selection` do
  `global.css` (`bg-accent/25`, texto `text-ink`). O Thiago gostou da cor da seleção e quis o trecho
  já marcado. O texto continua navy, então o contraste não muda. O `box-decoration-break: clone`
  mantém o arredondamento quando a expressão quebra de linha.

## Por que esta capacitação — decisões tomadas

Seção nova (`src/components/sections/Context.astro`, `id="contexto"`), logo após a Hero. A
referência é `inspiracao/hero_explicativa.png`: o uso individual à esquerda, a prática
corporativa à direita e, no meio, a capacitação.

- **Componente novo, não edição de template.** A casca (fundo, grade, contêiner) veio de
  `Problem.astro`, que continua intacto como referência (ver a regra dos templates acima).
- **Rótulo sem número** ("Por que esta capacitação"), como todas as seções novas. Os números
  ("01 ·"…) eram dos templates, que saíram da página.
- **Cabeçalho no padrão das demais seções:** título à esquerda, parágrafo e um CTA à direita.
  O CTA é o mesmo botão primário da Hero ("Quero avaliar para minha equipe", `#contato`).
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
- **O CTA é o mesmo da Hero e do Context** ("Quero avaliar para minha equipe", `#contato`). Os
  três mudam juntos.
- **O CTA secundário da Hero ("Como funciona") aponta para `#como-funciona`,** esta seção.
- **A jornada vira vídeo quando dá (desde 06/10/2026).** A animação
  `src/assets/video/como-funciona.mp4` (H.264, 1920×820, 44 s, 8 MB) substitui os três cards, sem
  player e sem controles. Quem decide é o `src/scripts/journey-video.ts`. O markup nasce com os
  cards, e o vídeo só entra se valerem todas as condições abaixo. Sem qualquer uma delas, ficam os
  cards de hoje.
  - **Largura de 1024 px (`lg`) para cima.** Em 390 px, o texto do vídeo ficaria com uns 4 px.
  - **Sem `prefers-reduced-motion`.**
  - **O autoplay é aceito.** O `play()` é testado ainda fora da tela.
- **MP4, e não o WebM com alfa.** A primeira versão usava um WebM transparente, mas a qualidade
  ficou ruim e o Thiago trocou pelo MP4. O MP4 tem fundo branco opaco, então o vídeo fica numa
  caixa (`[data-journey-frame]`) com a casca dos cards de formato: borda, sombra, filete de luz no
  topo e um degradê do branco para o turquesa a 12%. O `mix-blend-multiply` no `<video>` faz o
  branco do vídeo assumir o degradê. Sem a caixa, era um retângulo branco recortado no fundo cinza.
  Com o MP4, o Safari também mostra o vídeo.
- **Toca uma vez e para em 43 s (`HOLD_AT`).** O arquivo tem 44 s, mas a partir de cerca de 43,2 s
  tudo some num fade até o quadro vazio. O vídeo para em "A capacitação termina. O conhecimento
  fica.". Sem loop, por escolha do Thiago. **Trocou o vídeo, ajuste o `HOLD_AT`.** Com o anterior,
  de 34 s, a animação parava no meio. Meça o fade com o `ffmpeg` (brilho médio de um recorte do
  texto final por instante).
- **O vídeo só é baixado quando a seção está a uma tela de distância** e as duas primeiras
  condições valem. Celular e quem pede menos movimento não baixam os 8 MB. Ele toca quando 40% está
  à vista, pausa se o visitante sai e retoma na volta.
- **Com o vídeo ativo, o `<ol>` fica `sr-only`.** Ele continua sendo o conteúdo para leitores de
  tela, e o vídeo é `aria-hidden`. O `reveal` foi para o contêiner `[data-journey]`, sempre visível,
  para o `ScrollTrigger` nunca medir um elemento `hidden`.

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
- **Bloco "Parcerias e certificações" no fim da seção (desde 06/10/2026).** Fica depois dos
  números, num card com a casca da faixa de clientes: "Parceiros" à esquerda e "Time
  certificado Microsoft" à direita, com divisor vertical em `lg`. Copy nos arrays `partners` e
  `certifications` do frontmatter.
- **Escudos e selos em cor, ao contrário dos logos de clientes.** São selos oficiais, não marcas
  de cliente, e o azul único da Microsoft não vira arco-íris. Escolha do Thiago.
- **Os escudos atuais são provisórios.** Foram recortados da imagem que o Thiago mandou (cerca de
  135 px cada) e ficam em `src/assets/certificacoes/`. Quando chegarem os arquivos originais,
  substitua mantendo os nomes. O nome da certificação vai em texto embaixo do escudo, porque com
  72 px o texto do próprio escudo é ilegível. Por isso o `<Image>` tem `alt=""`.
- **Seis escudos numa linha só em `xl`.** Em 1024 px, com seis colunas, os nomes quebravam em 3
  a 4 linhas. Abaixo de `xl` são três colunas (duas abaixo de `sm`).
- **Selos de parceiro: Microsoft Solutions Partner e Claude Partner Network.** Os arquivos foram
  enviados pelo Thiago e ficam em `src/assets/parceiros/`. Só a margem transparente foi cortada,
  porque as regras dos dois programas proíbem editar o selo. Não recolora, não redesenhe e não
  troque por uma versão achada na internet. O campo `h` do array `partners` deixa os dois com
  cerca de 140 px de largura: 32 px de altura no Microsoft, que é mais largo, e 44 px no Claude,
  que tem duas linhas. O arquivo do Claude tem 195×62 px, então não passe de uns 60 px de altura.

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
- **Abaixo de `sm`, os botões dos cards têm `text-[13px]`, `px-4` e nenhuma seta.** Em 390 px, o
  card tem 302 px úteis, e "Quero avaliar para minha equipe" com a seta precisa de uns 330. Com
  14 px, o botão quebrava em duas linhas.
- **Os botões dos cards apontam para `#contato` e já levam o formato.** Cada botão tem
  `data-contact-plan` (`padrao` ou `personalizado`), vindo do campo `plan` do array `plans`.
  O `contact-form.ts` marca o rádio correspondente no formulário. Os valores precisam casar
  com o array `formats` do `Contact.astro`.
- **O botão do card personalizado diz "Quero avaliar para minha equipe"** desde 07/10/2026 (antes,
  "Fale conosco"). O texto é igual, mas o visual continua contornado, para a turma padrão seguir
  como a oferta em destaque.
- **Itens do card personalizado aprovados pelo Thiago:** tudo da turma padrão, práticas em
  jornadas reais, exemplos das áreas e carga horária e turmas ajustadas.

## Contato — decisões tomadas

Seção nova (`src/components/sections/Contact.astro`, `id="contato"`), logo após o Investment.
É o destino de todos os CTAs "Quero avaliar para minha equipe". A composição vem do topo do
`Footer.astro` ("Vamos colocar o trabalho sob controle."), com título grande à esquerda e
apoio à direita. O Footer continua intacto como template.

O título é o mesmo texto dos CTAs, "Quero avaliar para minha equipe", desde 07/10/2026.

- **O envio vai para o receptor de leads da Ivory (desde 07/10/2026).** É o mesmo backend da
  página de capacitação que está sendo descontinuada (`BACKEND_URL` + `/api/lead`, no topo de
  `src/scripts/contact-form.ts`), com o mesmo `campaign_id: 'capacitacao_ia'`. O corpo é JSON, e
  o sucesso é o status **202**. Com 400, aparece "Revise os campos…". Com outro status ou falha de
  rede, aparece "Não conseguimos enviar agora…", no `#contact-error`, e o botão volta.
  - **O payload mantém os nomes do contrato antigo:** `nome`, `email`, `cargo`, `whatsapp`,
    `funcionarios` (a faixa de colaboradores), `curso` (o rótulo do formato, "Turma padrão" ou
    "Personalizada"), `ferramentas` e as UTMs. Campo vazio não vai.
  - **UTMs:** `utm_source`, `utm_medium`, `utm_campaign` e `utm_content`, lidos da URL, como
    na página antiga.
  - **O backend é dinâmico.** Só exige nome e e-mail e aceita os demais campos sem mudança.
  - **CORS:** o domínio onde o site for publicado precisa estar liberado no backend. Sem isso,
    todo envio cai no erro de rede.
  - **Não envie lead de teste para produção.** Para testar, substitua o `window.fetch` no
    navegador por um stub que devolve 202.
  - **O pixel da Meta ficou de fora.** A página antiga disparava `fbq('track', 'Lead')`, mas
    este site não tem o pixel. O ponto do disparo está marcado no script.
- **Campos:** nome, e-mail corporativo, cargo, WhatsApp, colaboradores a capacitar,
  ferramentas de IA e formato. **Todos são obrigatórios** no formulário, por decisão do Thiago,
  embora o backend só exija nome e e-mail. Nas ferramentas, é preciso marcar pelo menos uma:
  checkbox não tem `required` de grupo, então o script põe a validade no primeiro checkbox, onde
  o navegador mostra o balão. Com "Outra" marcada, o texto de qual ferramenta também é obrigatório.
- **Ferramentas em múltipla escolha, enviadas num texto só, separado por vírgula.** As opções são
  Claude, ChatGPT, Gemini, Microsoft 365 Copilot e Outra. Marcar "Outra" abre um campo de texto,
  e o texto digitado entra na lista no lugar de "Outra". As pílulas ficam em fluxo
  (`flex-wrap`), com a largura do texto. Na grade de duas colunas, "Microsoft 365 Copilot"
  quebrava em três linhas em 390 px.
- **E-mail corporativo de verdade.** Domínios pessoais são recusados com `setCustomValidity`.
  A lista `PERSONAL_DOMAINS` junta a deste site com a da página antiga.
- **WhatsApp com máscara leve,** `(00) 0000-0000` ou `(00) 00000-0000`, e exige DDD.
- **Colaboradores em faixas** (até 50, 51 a 100, 101 a 250, mais de 250). As faixas partem
  da turma padrão de 50.
- **O formato chega preenchido.** Os botões dos cards de investimento levam
  `data-contact-plan`, e `?formato=padrao|personalizado` na URL faz o mesmo para links
  externos. Os CTAs das outras seções não escolhem: quem escolhe é o visitante.
- **Rádios "Turma padrão" / "Personalizada",** os mesmos nomes dos rótulos dos cards. Com
  "Capacitação personalizada", a pílula quebrava em duas linhas em 1440 px.
- **Validação nativa do navegador,** sem token de cor de erro novo. O `reportValidity()`
  mostra o balão do próprio navegador. O erro de envio usa o `ink` com o ícone
  `danger-circle-linear`, e não vermelho.
- **As duas colunas só começam em `xl`.** Em 1024 px o card do formulário ficava com cerca de
  390 px, o placeholder do telefone era cortado e os rótulos quebravam. Abaixo de `xl`, o
  formulário vem embaixo do texto, com `max-w-2xl`.
- **O botão de envio diz "Quero avaliar para minha equipe"** desde 07/10/2026 (antes, "Enviar
  contato"). Fecha o ciclo com os CTAs da página. Abaixo de `sm`, tem `text-[13px]`, `px-4` e nenhuma
  seta, como os botões dos cards de investimento: com 14 px, quebrava em duas linhas em 390 px. O
  `contact-form.ts` guarda esse texto e volta para ele depois do "Enviando…".
- **Frase de próximo passo embaixo do botão:** "Respondemos em até 1 dia útil, pelo WhatsApp ou
  e-mail. Sem compromisso." Ela reduz a fricção dizendo o que acontece depois. **O prazo de 1 dia
  útil precisa valer na prática.** Se o comercial mudar o prazo, mude a frase.
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

## Favicon — decisões tomadas

- **Onda turquesa num squircle navy,** como a §5 manda para favicon e ícone de app. A fonte é o
  `simbolo_onda.png` da skill da marca (`ia-para-equipes-brand/assets/`). Os arquivos estão em
  `public/`: `favicon.ico` (16, 32 e 48), `favicon-16.png`, `favicon-32.png` e
  `apple-touch-icon.png` (180). Os links ficam no `Base.astro`.
- **Traço engrossado só nos tamanhos de aba.** Em 16 e 32 px, as linhas finas da onda se misturavam
  ao navy e o ícone ficava apagado. Nesses tamanhos, o alfa da onda passa por um `MaxFilter(9)` na
  resolução original antes de reduzir. O desenho e o turquesa `#00A88E` não mudam. O ícone de
  180 px usa a onda sem alteração.
- **Sem SVG.** O `simbolo_onda.svg` tem 171 KB de linhas finas, pesado para favicon e ilegível em
  16 px.

## Materiais — decisões tomadas

Os materiais gratuitos ficam em `src/pages/materiais/`. O primeiro é o
`radar-de-pendencias-copilot.astro`, a entrega do reels do Radar de Pendências: quem comenta
RADAR recebe o link por Direct. Por isso o desenho é pensado primeiro para o celular.

- **Índice em `/materiais`, com um card por material.** Os cards saem de
  `src/data/materiais/index.ts`, em ordem do mais recente para o mais antigo, e a imagem de cada
  card é a capa og do material. Material novo precisa de três coisas: a página, a capa 1200×630 em
  `public/og/<slug>.png` e a entrada nessa lista. O material leva um link "Todos os materiais" de
  volta ao índice.
- **"Materiais" é o sexto item do `NAV_ITEMS`** (o quinto é o "Diagnóstico IA"), e por isso aparece
  no header, no drawer e na coluna Páginas do rodapé. O header usa `whitespace-nowrap`, `gap-3` e
  12 px no tablet e `gap-8` e 14 px a partir de `lg`. Com "Diagnóstico IA", o `gap-4` e 13 px
  encostavam o menu no logo em 768 px; com `gap-8`, o "Por que capacitar" quebrava.
- **O menu e o logo usam caminhos absolutos** (`/#contexto`, `/`), porque o header aparece fora da
  home. Na home, mesmo caminho com hash continua sendo rolagem na página.
- **O prompt mora em `src/data/materiais/radar-prompt.ts`,** sem reformatar. O botão copia o
  `textContent` do `<code>`, idêntico ao arquivo, e foi testado contra o clipboard real. O Windows
  troca `\n` por `\r\n` ao colar, o que é normal. Os emojis 🔴🟡🔵 ficam, porque são conteúdo do
  prompt e não decoração (§11). O botão do topo rola até `#prompt` e copia no mesmo clique, porque o
  clipboard só aceita escrita dentro de um gesto do usuário.
- **O bloco do prompt usa `whitespace-pre-wrap`,** que rola só na vertical e nunca de lado em
  375 px. O botão Copiar fica fora da área que rola.
- **Prints em `src/assets/materiais/radar/`, sem filtro,** com o componente
  `src/components/materiais/Shot.astro`. A miniatura sai em WebP de 480, 960 e 1600 px. A versão de
  1920 px só baixa no lightbox (`src/scripts/lightbox.ts`, com `<dialog>` nativo). No celular, um
  toque alterna entre "caber na tela" e "tamanho real", porque o print inteiro em 375 px fica
  ilegível.
- **Nenhum print com dado pessoal ou de cliente.** O print do prompt colado foi recortado na janela
  "Criar um agendamento", porque o canto mostrava a foto e o nome do Thiago. O print do e-mail de
  aviso (nome, razão social, reunião) e o do resultado (cliente Lundin, nome de colega, foto) **não
  foram publicados**. A seção "O que você recebe" fica só com texto até chegarem versões
  anonimizadas.
- **O og:image é uma capa da marca** (`public/og/radar-de-pendencias-copilot.png`, 1200×630), no
  lugar do print do resultado. O `Base.astro` aceita `image` e `ogType` por página. A URL absoluta
  sai do `site` do `astro.config.mjs` (`https://iaparaequipes.com.br`, ou o `SITE_URL`, se definido).
- **Os prints dos passos 4 a 6 (`radar-passo-4-dias-uteis.png` e `radar-passo-5-sem-termino.png`) mostram o título antigo do prompt** ("Assistente de Produtividade") e o horário
  16:30. O texto da página sugere 7h30 "por exemplo". Quando forem refeitos, mantenha os nomes dos
  arquivos.

## Radar IA — decisões tomadas

Jornada em `/diagnostico-ia`. O documento de referência é o "Radar IA — Jornada Interativa Completa", **v1.6**
(11/11/2026, "Chat progressivo"), que mantém o conteúdo e as regras e simplifica a experiência
(seções 3.6, 9.2, 10.6 e 12). A ilha React é `src/components/radar/RadarApp.tsx`; o copy está em
`src/data/radar/`; as regras, em `src/scripts/radar/engine.ts`; o roteiro, em
`src/components/radar/chat/script.ts`.

- **Endereço `/diagnostico-ia` (desde 11/11/2026, pedido do Thiago).** O `/radar` antigo e o
  redirect `/radar/video` saíram em 16/11/2026: o site nunca foi publicado, então não havia links a
  preservar. Os assets em `public/radar/` (logos, onda, vídeo) mantêm o caminho. O
  `/diagnostico-ia` tem `Referrer-Policy: no-referrer` no `vercel.json`.
- **Nomes (revistos em 16/11/2026, pedido do Thiago):**
  - **Dentro da ferramenta:** "Descubra seu próximo passo com IA" (cabeçalho do chat, `<title>` e
    `h1` da página).
  - **Para o visitante, fora dela:** "Diagnóstico IA", no menu, no destaque da home e na página do
    vídeo. O destaque da home (`RadarCta.astro`, `id="diagnostico"`) tem:
    - o título igual ao da ferramenta e o botão "Fazer o diagnóstico";
    - os três pontos do que a pessoa leva hoje (retrato, vídeo, plano em PDF), sem tempo
      estimado;
    - o anel do painel "Sua jornada" como desenho, no lugar dos pontos e losangos antigos.
    - **Sem "em PDF" e sem "em vídeo" (17/11/2026, pedido do Thiago, só na home):** o apoio diz
      "você recebe um plano", e os pontos são "O que a IA já pode fazer no trabalho" e "Um plano
      dos próximos passos para evoluir com a Inteligência Artificial e apresentar à liderança". A
      página do vídeo, a descrição do `/diagnostico-ia`, o chat e a imagem og continuam citando o
      PDF.
    - **Rótulos do anel no eixo de cada arco,** fora do círculo de fundo (`LABEL_R` 196, com a
      âncora voltada para o anel). Nos cantos fixos, caíam em cima da borda do círculo. O viewBox
      é `-64 0 528 400`, para "Disseminação" caber, e a fonte é 17.
  - **"Radar IA" ficou só no código** (`src/components/radar`, `RadarApp`…) e na origem do lead,
    `origem: 'Radar IA'`, para o CRM não mudar.
  - **A imagem de compartilhamento** é `public/og/diagnostico-ia.png` (1200×630), gerada de um
    HTML com as fontes e o logo do site e capturada pelo Playwright. A `radar.png` antiga, que
    dizia "Radar IA", saiu.

  O indicador de digitação diz só "Digitando…". O título do cabeçalho é grande (`text-lg`/`sm:text-xl`,
  com `text-balance`, para o "IA" não ficar sozinho em 390 px) e não tem avatar: a onda fica só
  nas mensagens.
- **O painel se chama "Sua jornada"** (antes "Radar Vivo"), sem frase de status. O componente
  continua `RadarVivo.tsx`.
- **Tela 01:**
  - o rótulo da etapa é "Meus desafios";
  - a fala de abertura é a pergunta direta, "Quais situações são realidade da sua organização?"
    (`CHALLENGES_INTRO.title`, no título grande). O apoio "Pode marcar mais de uma opção."
    (`CHALLENGES_INTRO.hint`) vem embaixo, em texto de fala comum: no título, a frase inteira
    pesava demais. O Thiago escreveu "é", e a concordância foi ajustada para "são".
  - a caixa de resposta das perguntas com cartões (Tela 01 e Tela 04) fica sem texto de apoio: a
    caixa de seleção de cada cartão já diz o que fazer;
  - a transição depois da dica (`TIP_TRANSITION`) e três perguntas do retrato (Pessoas,
    Segurança e Disseminação, em `mirror.ts`) foram reescritas pelo Thiago como perguntas
    completas. Em 12–13/11/2026, as perguntas passaram a dizer "a empresa"/"a equipe", e não
    "sua empresa"/"sua organização": a abertura virou "Quais situações são realidade na
    empresa?", a de Pessoas, "Como a equipe utiliza IA atualmente?", e o retrato, "Este é o
    retrato da empresa". As do documento eram frases abertas ("Quando alguém…"). As alternativas A–D não
    mudaram.
- **Opções com descrição viram cartões no compositor** (desafios e possibilidades), conforme a
  referência do Thiago:
  - ícone num círculo turquesa claro **ao lado do título** (desde 16/11/2026; antes, em cima),
    título em Sora, descrição embaixo e caixa de seleção no canto;
  - duas colunas a partir de `sm` e uma por linha no celular;
  - a área das opções sobe para 50vh quando há cartões.

  As outras respostas seguem como pílulas.
- **A coluna do chat tem `min-w-0`.** Sem ele, o título longo do cabeçalho estourava 8 px na
  horizontal em 390 px, porque um item de grid tem `min-width: auto`.

Histórico, para ninguém voltar atrás sem querer:
1. Uma tela por etapa. O Thiago achou informação demais e botões mudando de lugar.
2. Chat com barra de resposta fixa no rodapé e cards de pílula que viravam.
3. v1.5: chat com pílulas como mini editoriais, 4 motores visuais e "Adicionar ao meu plano". Ao
   testar, virou excesso de cliques: confirmar, abrir pílulas, salvar, expandir.
4. v1.6: poucos cliques, uma dica curta e o plano montado sozinho. Ao testar, o Thiago achou seco:
   tudo chegava de uma vez, a pessoa tinha de ler a tela inteira para se situar, e não parecia um
   chat de IA.
5. **Atual:** a v1.6 com ritmo e cara de chat de IA (ver os dois itens a seguir).

- **Ritmo de chat de IA (decisão do Thiago, diverge da v1.6).** Uma mensagem por vez:
  1. pontos de digitação (`TypingDots`, ~450 ms + 6 ms por caractere, até 1,1 s);
  2. o texto palavra a palavra (`Typewriter`, ~30 ms por palavra);
  3. a mensagem seguinte. Cartões (dica, retrato…) entram com fade depois dos pontos.

  As opções só aparecem quando a última fala termina. Tocar na conversa durante a digitação
  mostra tudo de uma vez, sem frase de apoio junto aos pontos (a "Toque na conversa para ver tudo" saiu em 16/11/2026). A v1.6 proíbe "pensando"/streaming simulado (§10.6); o Thiago decidiu
  ter o ritmo porque a conversa estava seca. O conteúdo continua o roteiro fixo, e nenhum texto diz
  que a IA está "analisando".

  Implementação (`RadarApp.tsx`): a conversa vira uma lista plana de itens (falas, resposta,
  `after`), e `played` diz quantos já foram entregues. No servidor e no 1º render, tudo sai
  completo (HTML útil, hidratação igual) e escondido com `motion-safe:invisible`. Se a hidratação
  falhar (rede caiu, servidor local reiniciado com a aba aberta), a animação `radar-unhide`
  mostra a conversa depois de 2,5 s, em vez de deixar a tela em branco (bug visto em 12/11/2026). Depois da
  hidratação, o ritmo começa do zero. Com movimento reduzido, tudo aparece completo. O cabeçalho
  ("Etapa X de 5", ver "Jornada curta") acompanha a mensagem que está chegando.
- **Compositor fixo no rodapé** (`chat/Composer.tsx`), com a cara do campo de mensagem dos chats de
  IA e sem texto livre:
  - as respostas da vez aparecem como sugestões;
  - na múltipla escolha e no "Continuar", um botão redondo de enviar **ao lado das opções**,
    alinhado ao pé delas. Não há faixa embaixo nem texto de apoio ("Escolha uma resposta" saiu,
    12/11/2026). A linha de status aparece só com aviso do PDF ou erro de campo, e "Digitando…"
    ocupa o lugar das opções enquanto o Radar escreve;
  - os cartões ficam em 2 colunas em todas as larguras a partir de `sm` (16/11/2026). Em 4
    colunas, com o ícone ao lado, o título quebrava em 3 linhas. O "Continuar sem escolher" ocupa
    `sm:col-span-2`: um `col-span-4` recriaria as 4 colunas;
  - o chat (cabeçalho, conversa e compositor) tem até 860 px de largura (antes 760);
  - nas perguntas de contato, um campo de texto; na entrega, "Baixar de novo" (ou "Tentar de novo").

  Mensagens da IA sem balão, com o avatar da onda; as do visitante, em balão navy à direita.
  `FollowLatest` rola até o fim quando as opções surgem: o compositor cresce e, no celular, a
  pergunta ficava escondida.
- **Revisão de clareza da conversa (16/11/2026, pedido do Thiago, sem as skills de design).**
  O objetivo era deixar a conversa mais fácil de acompanhar, sem mudar a estrutura nem a cara do
  site. O marco antes da revisão é o commit `677a787`.
  - **A conversa cresce de baixo para cima** (`min-h-full justify-end` no `ConversationContent`).
    Antes, a pergunta ficava no topo e as opções no pé, com até ~500 px de vão. Agora a pergunta
    da vez fica colada às opções que a respondem, como em qualquer app de chat.
  - **Um só indicador de progresso:** a régua de 5 segmentos com o nome das etapas (`Progress`
    no `RadarApp.tsx`; nomes em `STEP_NAMES`: Meus desafios, Retrato, Possibilidades, Objetivo,
    Seu plano).
    - As etapas feitas ficam em turquesa e a atual enche em `accent-ink`. No retrato, enche em
      quartos; em "Seu plano", pergunta a pergunta (`progressWithin`).
    - No celular aparecem só os segmentos, e "Etapa X de 5 · Nome" vai para a linha da pílula "Sua
      jornada" (ver "Celular", abaixo).
    - Saíram o "Etapa 2 de 5 · Retrato" em texto e o "· 1 de 4" do selo das perguntas do retrato,
      porque eram dois contadores diferentes.
  - **Sem a fala de abertura (desde 17/11/2026, pedido do Thiago).** A Tela 01 abre direto na
    pergunta. A frase "São 5 etapas rápidas. No fim, você recebe um plano em PDF para levar à
    liderança." (`CHALLENGES_INTRO.opening`) saiu.
  - **Celular: a pergunta sempre à vista (17/11/2026).** No Android do Thiago (~360×625 px úteis),
    a caixa de cartões tinha `50vh` (~330 px). Sobravam uns 50 px para a conversa, e a pergunta
    da Tela 01 ficava escondida. O retrato, o objetivo e o indicador tinham o mesmo problema. Abaixo
    de `sm`, quatro regras:
    - **Limite da caixa de opções:** `max-h-[calc(100dvh-24rem)]` em qualquer resposta, o que
      deixa uns 11rem para a conversa. Se as opções passarem disso, rolam dentro da caixa. De `sm`
      para cima ficam `50dvh` nos cartões e `36dvh` nas pílulas. É `dvh`, e não `vh`, porque no
      Android o `vh` passa da área visível.
    - **Cartões (desafios e possibilidades):** só ícone e título, uns 50 px cada. A descrição fica
      em `sr-only`, para o leitor de tela continuar lendo, e a caixa de seleção fica centrada.
    - **Pílulas:** `py-1.5` e `gap-1.5`. As empilhadas (retrato e indicador) perdem o ícone, e o
      texto ganha a largura toda.
    - **Topo do chat:** sem o título visível (o `h1` em `sr-only` continua). A linha "Etapa X de 5 ·
      Nome", em 12 px e numa linha só, fica ao lado da pílula "Sua jornada", com a régua embaixo.

    Medido com Playwright em 360×640 e 390×844, passo a passo: a pergunta fica acima das opções
    em todos os 11 passos. No retrato, no objetivo e no indicador em 360 px, a última opção rola
    dentro da caixa.
  - **"Preocupação com segurança" no lugar de "Segurança e governança" (17/11/2026, pedido do
    Thiago).** No celular o cartão mostra só o nome, e "Segurança e governança" não soava como
    desafio, ao lado de "Pouca aplicação prática" e "Falta de direcionamento". O nome novo repete
    a descrição do cartão. Ele vai ao cartão, ao PDF e ao `radar_desafios` do CRM, porque todos
    leem o `label`. O id `seguranca` e o chip "Segurança" do painel não mudaram.
  - **O retrato abre do começo quando não cabe (17/11/2026).** A conversa sempre rola até o fim
    (`FollowLatest`), e no celular a pessoa via só o fim do cartão do retrato.
    - **Como funciona:** no passo `retrato`, a fala "Pronto. Este é o retrato…" leva
      `data-anchor`. Se do topo dela até o fim da conversa não cabe na área visível, o
      `FollowLatest` chama o `stopScroll()` do `use-stick-to-bottom` e rola até a âncora.
    - **Quando cabe** (o desktop), segue até o fim, como antes.
    - Medido: em 360 e 390 px a âncora fica a 8 px do topo, e em 1440 px a conversa vai até o fim.
  - **O painel mostra o que vai ser montado.** Cada bloco (desafios, descoberta, interesses,
    objetivo, caminho) nasce em cinza com "A definir". Interesses vira "Nenhum em especial" se a
    pessoa pula as possibilidades.
  - **O painel mostra o que acabou de mudar.** O bloco ou o rótulo do arco que a última resposta
    alterou ganha um fundo turquesa por ~1,6 s (`useChanged` em `RadarVivo.tsx`, que compara uma
    assinatura do estado). Antes, o painel mudava calado ao lado.
  - **O cartão do retrato não repete o anel em `lg`,** porque o painel ao lado já o mostra. O texto
    ganha a largura toda. Abaixo de `lg` o painel fica escondido, e o anel volta ao cartão. O
    "Próximo passo" tem um filete turquesa à esquerda: é o que a pessoa leva.
  - **Um nome por dado** (`PATH_LABEL` em `src/data/radar/path.ts`): Objetivo, Primeiro grupo a
    capacitar, Ferramenta de IA e Sinal de sucesso, iguais no cartão do cenário, no painel e no
    PDF. Antes eram "Grupo inicial", "Ambiente", "Indicador" ou "Indicador de acompanhamento",
    conforme o lugar.
  - **Sem as letras A–D nas opções do retrato.** Vêm da matriz e não dizem nada a quem responde.
    Continuam nos dados, para a lógica.
  - **Opção que está saindo não responde a pergunta seguinte.** Cada sugestão guarda o passo em
    que nasceu (`live` no `Composer.tsx`). Durante os 180 ms da saída, um clique numa opção antiga
    chegou a responder Processos com uma opção de Pessoas.
  - **Celular:** o botão do painel virou a pílula "Sua jornada", com o mini-anel. Antes era um
    anel de 40 px com texto ilegível.
- **Sem "Alterar" nem "Minha jornada" (decisão do Thiago, diverge da v1.6, critério 7).** As
  respostas não são editáveis; para refazer, recarrega-se a página. No celular, o botão do
  cabeçalho abre só o Radar Vivo.
- **Conversa guiada, sem LLM.** Pergunta curta → opções → o Radar Vivo reage na hora → dica ou
  confirmação breve → próxima pergunta. Sem "digitando…", streaming simulado ou "analisando".
  Resposta única envia no toque; a múltipla (desafios e possibilidades) tem um único botão de
  enviar, desabilitado sem seleção.
- **Nada é salvo à mão.** Não existem "Salvar", "Adicionar ao meu plano", "Remover", "Ver método",
  "Próxima descoberta" nem contador. O plano é derivado (`derivedActions` em `engine.ts`): as 3
  pílulas de cada desafio marcado (origem `declarado`), depois o próximo passo e as duas ações
  complementares do retrato e a do objetivo (`sugerido`), sem duplicar por ID. O PDF separa "Você indicou" de "O Radar sugere".
- **As 12 pílulas são biblioteca do PDF,** não do chat. Cada desafio marcado leva as três, com
  texto integral, para o apêndice "Recomendações para os desafios indicados" (4 desafios = 12).
  Não volte a mostrá-las como cards: a v1.6 proíbe.
- **Uma dica curta na Tela 01** (`TIPS` em `src/data/radar/reactions.ts`, uma por pílula). É sorteada
  uma vez, ao confirmar os desafios, entre as pílulas deles (`pickTip`, ação `pickTip` com o
  número sorteado no despacho, para o reducer ficar puro). Fica estável na sessão e só muda se a
  pílula deixar de pertencer aos desafios marcados. Só a dica "Comece pelas atividades, não pelas
  ferramentas." vem do documento; as outras 11 foram escritas para o site e **estão em revisão com
  o Thiago**. O Radar destaca o ponto do desafio da dica (`highlight`).
- **Um estilo de cartão de opção e um de dica** (`Note` em `chat/blocks.tsx`). Composições fora do
  balão só onde a v1.6 manda: retrato, vídeo, síntese do caminho e fechamento.
- **Avatar: a onda oficial** (`public/radar/onda.png`, recortada do `simbolo_onda.png` da skill da
  marca, sem redesenhar) num círculo navy. Nada de ícone genérico ou robô.
- **shadcn/ui AI Elements, por decisão do Thiago.** Foram trazidos só o `Conversation` (com
  `use-stick-to-bottom`, que acompanha a pergunta atual sem pular o texto em leitura) e o `Message`,
  em `src/components/ai-elements/`, mais o `Button` em `src/components/ui/`. O `components.json` e o
  `cn` (`src/lib/utils.ts`) foram criados à mão, sem `shadcn init`, para o init não reescrever o
  `global.css`. Ajustes nos arquivos gerados, registrados no topo de cada um:
  - o `Message` perdeu o SDK `ai`, o `streamdown`, anexos e ramificações (não há LLM);
  - o `Conversation` usa ícone Solar;
  - o `Button` usa `muted` no hover, porque aqui `accent` é o turquesa.

  As variáveis do shadcn (`--color-background`, `--color-primary`…) apontam para os tokens da marca
  num `@theme inline` do `global.css`, sem nenhuma cor nova, e a home ficou idêntica (captura antes
  e depois). Componente novo: `npx shadcn@latest add <url do registry>`. Confira o `global.css` e
  troque imports de `lucide-react`.
- **Motion for React** (`motion/react`) nas entradas das falas e dos cartões e no `whileTap`. As
  animações só começam depois da hidratação (`hydrated`), porque o `useReducedMotion` dá valores
  diferentes no servidor e no navegador e quebrava a hidratação. Com movimento reduzido, nada anima.
- **Ícones Solar, não Lucide.** A v1.6 cita Lucide; o Thiago decidiu manter o Solar, que é o do
  resto do site. `scripts/radar-icons.mjs` copia só os usados para `src/components/radar/icons.ts`.
- **O chat tem altura fixa** (tela menos header): o `Conversation` rola por dentro e o compositor
  fica no pé. O Radar Vivo
  (variantes `full`, `mini` e `portrait`) fica ao lado no desktop.
- **Dependências novas no `optimizeDeps.include`** do `astro.config.mjs` (`motion/react`,
  `use-stick-to-bottom`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`). Sem isso,
  o Vite as descobre no meio da sessão e as ilhas somem (504 "Outdated Optimize Dep"). Acrescentou
  dependência ao Radar, acrescente aqui também.
- **Copy em dados, não no markup.** São cerca de 250 trechos (pílulas, perguntas, cenários,
  textos do PDF). Cada arquivo de `src/data/radar/` corresponde a uma tela do documento. Ação
  sugerida aponta para um id de `actions.ts`, nunca repete o texto: é o id que impede ação
  duplicada no plano (§9.2).
- **Retrato consultivo da Tela 02 (matriz revisada pelo Thiago, 11/11/2026).** Os 10 cenários
  do documento deram lugar a 22 regras consultivas (G1–G4 segurança aplicada, V1–V4 mapeamento e
  priorização, C capacitação, N visibilidade, I primeiro piloto, D/E disseminação e expansão, B
  fundamentos). Elas dividem as 256 combinações sem sobra. Na versão antiga, duas frases cobriam
  metade dos casos e a combinação ABBB caía numa frase genérica.
  - **Fonte da verdade:** a planilha `docs/radar/matriz-retrato-tela02.xlsx` (abas "Regras
    consultivas" e "Matriz revisada").
    - **Revisão de linguagem (16/11/2026, pedido do Thiago: "genérico, pouco consultivo, parece
      IA").** As regras não mudaram; mudaram os 122 textos (22 regras, 12 blocos de valor, 9 atenções
      e 13 ações complementares). Critérios:
      - o "Por que essa leitura?" diz o que acontece na empresa e o risco, sem repetir as respostas
        ("Você informou…");
      - a descoberta é um diagnóstico em linguagem de gestor;
      - o passo diz quem envolver e o que decidir, sem jargão ("multiplicadores", "inventário",
        "protocolo");
      - a atenção é um risco de verdade, e não um elogio.

      A aba "Revisão 16-11" traz antes e depois. A versão anterior está em
      `matriz-retrato-tela02-v1.xlsx`, ao lado.
    - **Passada da skill `humanizer-br` (16/11/2026, pedido do Thiago).** A skill veio de um
      `.skill` enviado por ele e não foi instalada: serviu só de referência. Ela trocou 22 textos.
      - Saíram "na prática" (palavra proibida da skill), o jargão da matriz "resultado
        acompanhado" (8 vezes), dois "não é X, é Y", os bordões "Agora é hora de" e "A base está
        pronta", o "caso a caso" repetido e "referências internas".
      - Nenhum histórico inventado: a regra de "experiência real" da skill pede frases como "temos
        visto em projetos", e nada disso entrou.
      - A aba "Revisão humanizer-br" traz antes e depois. A versão anterior está em
        `matriz-retrato-tela02-v2.xlsx`.
    - O script `scripts/radar-import-retrato.py` (openpyxl) gera `src/data/radar/portrait.ts`.
      Não edite esse arquivo à mão.
    - Antes de gravar, o script confere três coisas: que há 256 códigos, que cada código casa só
      com o critério da sua regra e que os textos de cada regra são iguais em todas as linhas.
    - Mudou a planilha: rode `python scripts/radar-import-retrato.py docs/radar/matriz-retrato-tela02.xlsx`
      e depois `npm run check:radar`.
  - **O que cada combinação devolve:**
    - da regra: descoberta, "Por que essa leitura?", próximo passo e entrega;
    - da combinação: o bloco de valor ("O que já existe a favor" ou, em AAAA e DAAA, "O que
      ainda precisamos descobrir"), a nota de atenção e duas ações complementares.
  - **No chat (cartão do retrato):**
    - o anel com rótulos é o único resumo por dimensão: a lista de estágios saiu, e a
      "Leitura atual" do painel também (regra da planilha: não repetir o gráfico em texto);
    - ao lado do anel, a descoberta e o porquê; embaixo, o bloco de valor e o próximo passo com
      a entrega. A nota de atenção saiu do cartão em 13/11/2026 (pedido do Thiago) e ficou só no
      PDF.
  - **No PDF:**
    - as ações complementares saem só no PDF, por decisão do Thiago;
    - no plano de ação, o próximo passo e as duas ações complementares entram como "O Radar
      sugere" (ids `retrato-passo`, `retrato-extra-1` e `retrato-extra-2`);
    - a página 02 traz a descoberta e o porquê; a página 03, a tabela de dimensões, o bloco de
      valor, o próximo passo e a atenção.
  - **"Não sei" em Pessoas:** nas regras N é a própria descoberta. Nas demais combinações com
    Pessoas D, a atenção avisa que falta visibilidade, não competência. A checagem garante as 64.
  - **Pessoas nunca chega a "Mais estruturado".** A D de Pessoas é "Não sei", e o arco de Pessoas
    nunca fica cheio. Ficou assim por enquanto.
- **Checagem.** `node scripts/radar-engine-check.ts` (ou `npm run check:radar`) cobre:
  - as 256 combinações contra a contagem da planilha;
  - os exemplos validados (ABBB → B2, AAAA → B1, CCCC → E1, DDDD → N2);
  - o "Não sei" em Pessoas;
  - o plano derivado sem id repetido;
  - a dica e o nome do PDF.

  Os imports desses arquivos têm `.ts` para o `node` rodar sem build.
- **Sem persistência.** Estado só em memória (`state.ts`), sem banco e sem localStorage. A página
  avisa antes de sair quando há respostas. O PDF é gerado no navegador (`@react-pdf/renderer` e
  `qrcode`, carregados só no clique: o react-pdf tem 1,2 MB).
- **Contato pedido no chat, sem modal (desde 11/11/2026, decisão do Thiago).** Na conversa a pessoa
  já está no ritmo de responder, e cada pergunta é pequena, o que costuma converter melhor que um
  formulário num modal.
  - **As perguntas:** depois do cenário, o Radar emenda "Seu plano está quase pronto. Como posso te
    chamar?", com a nota de privacidade ("As respostas do diagnóstico vão junto"). Em seguida vêm:
    1. o cargo, em opções (Diretoria ou C-level, Gestão de área, RH ou T&D, TI; "Outro" abre o
       texto);
    2. o e-mail corporativo;
    3. o WhatsApp.

    Os textos estão em `src/data/radar/contact.ts`.
  - **No compositor,** as perguntas de texto viram um campo de uma linha, com o botão de enviar
    (resposta `kind: 'text'` em `script.ts`).
    - A validação usa `emailError`, que recusa domínio pessoal e formato incompleto, e
      `phoneError`/`maskPhone`.
    - O erro aparece na linha de status (`aria-live`). Sem erro, a linha não tem altura: antes sobrava uma faixa vazia
      embaixo do campo.
  - **Na entrega,** o lead vai ao receptor pelo `src/scripts/lead-api.ts` (`sendLead`) com o
    contato, `origem: 'Radar IA'` e as respostas da jornada (`leadFields`). Com 202, o PDF é
    gerado sozinho, e o compositor fica com "Baixar de novo". Com falha, aparece "Tentar de
    novo".
    - **Exceção para testes locais:** em `localhost`, `127.0.0.1` ou `[::1]` (`isLocalHost`), uma
      falha no envio libera o PDF com o aviso "Ambiente local: o envio do lead falhou (CORS)…".
      O backend não libera `localhost` no CORS, e sem isso não dava para testar o PDF. Em
      produção não há exceção.
    - Para testar sem bater no backend, intercepte `**/api/lead` (`route.abort()` simula o CORS). O contato fica só em memória, em `RadarState.contact`.
  - **Com `?access` na URL** (`RadarState.directPdf`), as perguntas são puladas: depois do
    cenário vem só "Baixar meu plano em PDF", e nenhum lead é enviado.
  - **Saíram** o modal `#radar-lead`, o "Quero conversar com a Ivory" e a nota "Você escolheu onde
    começar" depois do objetivo.
  - **O `LeadForm.astro` e o `lead-form.ts` voltaram a ser só da home.** O envio e as validações
    passaram para o `lead-api.ts`, compartilhado. O payload da home não mudou (testado com stub).
    `utm_term` está na lista de UTMs.
- **As respostas vão ao CRM (desde 11/11/2026, decisão do Thiago; antes o diagnóstico não era
  enviado).** Campos:
  - `funcionarios` (grupo inicial) e `ferramentas` (rótulos separados por vírgula), com os nomes
    do formulário da home;
  - `radar_desafios`, `radar_pessoas`, `radar_processos`, `radar_seguranca` e
    `radar_disseminacao` ("Estado: alternativa");
  - `radar_codigo` (ex.: ABBB), `radar_regra` (ex.: B2) e `radar_descoberta`;
  - `radar_possibilidades`, `radar_objetivo` e `radar_indicador`.

  Só vai o que foi respondido. O backend aceita campos novos sem mudança.
- **Jornada curta (desde 11/11/2026, pedido do Thiago).**
  - "Descobrir oportunidades para minha equipe" leva direto ao vídeo: saiu a descoberta em
    diálogo (Tela 03).
  - Depois de "Este é o seu cenário inicial." vêm as perguntas de contato e o PDF: saiu a Tela 07,
    com a linha do tempo, a prévia e o nome da empresa. O PDF sai sem a empresa na capa e no
    nome do arquivo.
  - O cabeçalho mostra a régua de 5 etapas (`DISPLAY_STEP`, `STEP_NAMES` e `progressWithin` em
    `script.ts`; ver "Revisão de clareza"). As telas internas seguem a numeração do documento,
    que o painel e o motor usam.
  - Com o caminho completo, o centro do anel vira "Síntese".
  - O cartão "Este é o seu cenário inicial." mostra só objetivo, grupo, ambiente e indicador. O
    roteiro (Preparar → Expandir) e o "Como o IA para Equipes se encaixa" saíram do chat em
    13/11/2026 (pedido do Thiago) e seguem no PDF.
  - A pergunta das possibilidades segue o padrão da Tela 01: título grande e "Pode marcar mais
    de uma opção." embaixo.
- **Ferramentas em múltipla escolha:** Microsoft 365 Copilot, Claude, Gemini, ChatGPT, Outros
  (antes "Ambos") e "Ainda estamos avaliando". Com uma marcada, aparece a nota dela; com várias,
  a `TOOLS_MULTI_NOTE`. O `RadarState.tools` é uma lista.
  Desde 13/11/2026, as opções mostram os **logos reais das ferramentas, em cinza**
  (`src/data/radar/tool-logos.ts`, campo `logo` da opção, em `currentColor`): Microsoft Copilot do
  selfh.st/icons (CC BY 4.0, o mesmo do `Structure.astro`), e Claude, ChatGPT e Gemini
  (`googlegemini`) do simple-icons (CC0). Selecionado, o logo fica verde-escuro, como os ícones.
  "Outros" e "Ainda estamos avaliando" seguem com ícone Solar.
- **Acesso direto (`?access`), desde 16/11/2026 (decisão do Thiago).**
  - **Como funciona:** qualquer valor do parâmetro, por exemplo `/diagnostico-ia?access=1`,
    dispensa as perguntas de contato antes do PDF.
    - Depois do cenário vem só "Baixar meu plano em PDF".
    - Nenhum lead é enviado, e a capa sai sem nome.
    - Quem lê o parâmetro é o `src/components/radar/access.ts`, no `useEffect` (para não quebrar
      a hidratação). Ele tira o parâmetro da barra de endereço.
  - **O que saiu:** antes era um token assinado (HMAC, com validade) gerado por script e
    validado numa rota de servidor. O Thiago achou complexo demais. Saíram:
    - `src/lib/radar-token.ts`, `scripts/radar-token.ts` e `/api/radar/verify-access`;
    - o `RADAR_ACCESS_SECRET` e o `.env.example`;
    - o adapter `@astrojs/vercel`, que existia só por causa da rota. O site voltou a ser 100%
      estático.
  - **A troca:** quem conhecer o parâmetro baixa o PDF sem deixar contato. O cadastro é convenção
    comercial, não proteção. Já era assim em parte, porque o PDF nasce no navegador.
- **Vídeo "A IA pode fazer muito mais do que você imagina" (desde 16/11/2026).** Tela 04 do chat e
  página pública `/diagnostico-ia/video`, com o mesmo `VideoSlot.tsx`.
  - **Duas versões em `public/radar/video/`**, servidas como estão. São recompressões dos renders
    de `ivory-videos/projects/2026-11-ia-possibilidades/renders/`; os originais (~36 MB cada)
    ficam lá.
    - `ia-possibilidades-desktop.mp4`: 1920×1080, 10,3 MB;
    - `ia-possibilidades-reels.mp4`: 720×1280, 6,2 MB.

    Mesmo comando para as duas (no reels, com `-vf scale=720:1280`):
    `ffmpeg -i <render> -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart <saída>`.
    Para uma v2, recomprima e mantenha os nomes.
  - **Capas:** `ia-possibilidades-desktop.jpg` e `ia-possibilidades-reels.jpg`, o quadro de 0:12.
  - **Escolha da versão:** `VIDEO_MOBILE_QUERY` (celular em pé até 767 px) fica com o reels; o
    resto fica com o desktop. A escolha é feita depois da hidratação (o servidor sempre desenha a
    versão desktop) e acompanha a orientação até o primeiro play. Depois disso não troca, para
    não reiniciar o vídeo.
  - **Começa com um toque** (decisão do Thiago): capa e `preload="none"`, porque tem narração e
    nada deve baixar antes do play. Testado: nenhuma requisição ao `.mp4` antes do play.
  - **Botão de tela cheia no celular (17/11/2026, pedido do Thiago).** No player nativo do
    Android, a tela cheia fica no menu de três pontinhos.
    - **Onde:** um botão redondo no canto de cima, à direita (`full-screen`, Solar), abaixo de
      `sm`.
    - **O toque:** chama o `requestFullscreen()` (no iOS, o `webkitEnterFullscreen()`) e dá
      `play()`.
    - **Durante a reprodução:** o botão some, e volta na pausa ou no fim.
    - **Testado:** nenhum `.mp4` baixado antes do toque, e depois dele o vídeo fica em tela cheia
      e tocando.
  - **A legenda está gravada na imagem.** A faixa `ia-possibilidades.vtt` vai no player desligada,
    para não duplicar o texto.
  - **No chat, primeiro o vídeo, depois a pergunta (16/11/2026, pedido do Thiago).** Antes, título,
    vídeo e "Qual dessas possibilidades mais chamou sua atenção?" chegavam juntos. Com os quatro
    cartões no compositor (~290 px), o vídeo aparecia cortado, e a pessoa era perguntada sobre um
    vídeo que não tinha visto. Agora são dois passos em `script.ts`:
    - `video`: o título, a frase `VIDEO_SCREEN.intro` ("Veja no vídeo quatro formas… Depois, me
      conte qual chamou mais sua atenção.") e o vídeo, com o compositor só com "Continuar";
    - `possibilidades`: a pergunta e os cartões, com o vídeo logo acima na conversa.

    A régua enche em 0,4 e 0,8 da etapa.
  - **Moldura que cabe na tela.**
    - **Desktop:** 16:9 com `max-w-[calc((100dvh-27rem)*16/9)]`, que só encolhe em telas baixas
      (em 1366×768, o título e o vídeo cabem inteiros).
    - **Reels:** 9:16 centralizado com `max-h-[max(16rem,calc(100dvh-30rem))]`. Em 390×844 a frase
      e o vídeo cabem inteiros, e só o título rola para cima.

    A página pública `/diagnostico-ia/video` usa o mesmo limite.
  - **Só o player, sem atalhos de capítulo** (pedido do Thiago, 16/11/2026). Os tempos continuam
    em `chapterStart` (`capabilities.ts`, do `capitulos.txt` do render: Sistemas 0:17, Tarefas
    programadas 1:28, Arquivos 1:48, Entregas 2:08), para quando voltarem a ser usados.
  - **Config:** `VIDEO_READY`, `VIDEO_SOURCES`, `VIDEO_MOBILE_QUERY` e `VIDEO_CAPTIONS`, em
    `src/data/radar/config.ts`. O PDF aponta para `/diagnostico-ia/video`.
- **O link e o QR do vídeo no PDF usam o domínio do site**, `https://iaparaequipes.com.br` (padrão
  do `astro.config.mjs` desde 11/11/2026; `SITE_URL` sobrescreve). O QR e o link do site, na
  contracapa, vêm de `PDF.social`.
- **Radar Vivo híbrido (desde 11/11/2026, referência do Thiago).** A versão anterior juntava
  anéis tracejados, pontos de desafio, losangos de possibilidade e a trilha num SVG só, e ficou
  poluída. Agora (`RadarVivo.tsx`):
  - **em cima, um anel com quatro arcos nomeados** (Pessoas, Processos, Segurança, Disseminação)
    e um disco navy no centro ("Sua empresa" → "Retrato atual" → "Síntese" com o caminho completo; o mini do celular não tem texto).
    O arco fica cinza até a pergunta da dimensão ser respondida e então ganha cor e estágio.
    O nome e o estágio ficam em cima e embaixo do anel, em linhas: sobrepostos ao anel, quebravam
    em 280 px;
  - **traço fino (desde 17/11/2026, pedido do Thiago: "muito grosseiro").** Num viewBox de 400,
    o raio é 150, o traço 12 e a meia abertura 39°. Antes eram raio 128 e traço 30.
    - Com a ponta redonda menor, sobra um vão visível de uns 10° entre os arcos. Antes, os arcos
      quase se encostavam.
    - Os fios-guia até os rótulos saíram: pareciam sobra, e os rótulos já ficam nos cantos.
    - O "Não identificado" é tracejado com ponta reta (`5 7`). Com ponta redonda e traço 12, os
      traços se fundiriam numa linha cheia.
    - A trilha cinza de antes da resposta tem opacidade 0,1: com 0,07 e traço fino, sumia.
    - O mini do celular usa o viewBox `36 36 328 328`, para o anel maior não ser cortado.

    A mesma proporção vale no destaque da home (`RadarCta.astro`), no `Ring` do PDF (viewBox
    200: raio 75, traço 6, disco 42) e na `og/diagnostico-ia.png`. Mudou um, mude os outros;
  - **embaixo, um bloco de texto que cresce por etapa:**
    1. Desafios identificados (chips; o da dica ganha anel turquesa);
    2. Leitura atual e Principal descoberta (`scenario.insight`);
    3. Interesses no mapa (Telas 3–4);
    4. Objetivo;
    5. Caminho inicial (grupo, ambiente, sinal de sucesso).

    Fecha com o Próximo foco (`NEXT_FOCUS`, uma frase por etapa, em `reactions.ts`, em revisão
    com o Thiago).
  - **Preenchimento em quatro degraus fixos, diverge do §10.1** ("sem área proporcional"):
    Primeiros passos ¼ do arco, Em desenvolvimento ½, Em estruturação ¾, Mais estruturado cheio,
    com o turquesa mais forte a cada degrau. "Não identificado" é a trilha tracejada. A referência
    do Thiago pede isso. Para não virar nota, o estágio está sempre escrito, não há número nem
    porcentagem, e o rodapé diz que não é medição.
  - **Variantes:** `full` (painel e folha do celular, com `heading={false}` na folha, que já tem
    título), `mini` (só o anel, no botão do cabeçalho) e `portrait` (anel com rótulos, no cartão
    do retrato). A trilha saiu do Radar: continua no cartão de cenário e no PDF.
  - As coordenadas são arredondadas: sem isso, servidor e navegador divergiam no último dígito e
    o React acusava erro de hidratação.
  - **Painel lateral:** `top-[6rem]` e `max-h-[calc(100dvh-6.5rem)]`, o máximo abaixo do header,
    com `p-4`, espaçamentos justos e o anel em 48% da largura (66% no cartão do retrato). Assim, o
    fim da jornada cabe sem rolagem em 1440×900 (medido: `scrollHeight` igual a `clientHeight`).
    A rolagem interna fica como reserva para telas mais baixas.
  - **Ao responder, a página volta ao topo** (`window.scrollTo` em `respond`). A página e o chat
    têm rolagem, e a da página às vezes rolava sem querer.
  - **Sem a nota de turma grande no chat:** "Mais de 50 colaboradores" não traz mais a fala sobre
    turmas de 50. A nota continua no PDF.
  - Sem rodapé "Não é uma nota": o Thiago tirou essa frase do painel e do cartão do retrato.
- **O plano em PDF é uma apresentação 16:9 (desde 16/11/2026, pedido do Thiago).** Quem fez o
  diagnóstico leva o arquivo para a liderança, sem a Ivory na sala. O Thiago pediu uma interface
  que se explique sozinha, com pouco texto e diagramas no lugar de parágrafos, e sem guia de
  apresentador. A versão A4 anterior (documento de leitura, de 11/11) saiu.
  - **Formato:** páginas de 960×540 pt, o 16:9 do PowerPoint, em `PlanDocument.tsx`.
    - **Não use `wrap={false}` na `<Page>`:** no react-pdf 4.9 ele faz a altura virar automática.
    - Cada slide precisa caber em 398 pt de altura útil. Quando passa, o react-pdf cria uma página
      a mais, quase vazia. **Confira sempre a contagem de páginas:** 10 slides, mais 1 de abertura
      do apêndice e 4 por desafio marcado (com 4 desafios, 27; com 1, 15). Um título que passa a
      ter duas linhas já basta para transbordar.
    - As notas de rodapé e a faixa do apêndice são absolutas e têm `fixed`. Sem isso, um conteúdo
      que encosta no limite empurra a nota para outra página.
  - **Regras do deck:**
    - **Um slide, uma mensagem:** o título já é a conclusão e o visual a prova.
    - **A régua do topo:** quatro etapas, Onde a empresa está · O que identificamos · O que é
      possível · O que recomendamos (`DECK_STAGES`), a mesma ideia da régua do chat.
    - **Voz de consultoria (desde 16/11/2026, pedido do Thiago).** A IA para Equipes entrega à
      empresa a leitura e a recomendação ("A empresa reconhece", "Nossa leitura", "Recomendamos").
      A primeira versão falava como a pessoa apresentando ("Reconhecemos", "nosso retrato"), e o
      Thiago não gostou. A capa diz "Preparado para".
    - **O conteúdo vem do chat e da matriz,** e os textos fixos do deck ficam no objeto `DECK`, em
      `story.ts`.
  - **Slides:**
    0. **Capa:** Navy com a onda, "Preparado para {nome} · {cargo}", o mês e "por IA para Equipes
       by Ivory". Com `?access`, só o mês.
    1. **Os desafios:** "A empresa reconhece N desafios", um cartão por desafio, com a frase do
       chat como citação.
    2. **O retrato:** o anel com os nomes das dimensões e uma linha por dimensão (medidor de 4
       degraus, estágio e resumo), mais a nota "Não é uma medição".
    3. **A descoberta:** Navy, a citação grande, o porquê e o tema da regra (`axis`).
    4. **A base e o ponto de atenção:** valor e atenção, lado a lado. Com o bloco "descobrir", o
       título muda.
    5. **As possibilidades:** as 4, cada uma com um mini fluxo de onde vem → IA → o que entrega
       (campo `flow` em `capabilities.ts`), no lugar do exemplo em texto. As marcadas ganham
       "Chamou a atenção" e as outras ficam esmaecidas. Ao lado, o cartão Navy com o QR do vídeo.
    **"O que recomendamos" (simplificado em 16/11/2026, pedido do Thiago).** Antes misturava o
    piloto, a linha Preparar → Expandir, o primeiro passo da matriz, as decisões e o apoio. Agora
    são só as respostas da empresa e a capacitação, como o site apresenta:
    6. **Aonde a empresa quer chegar:** só as respostas do chat. Objetivo → como perceber que deu
       certo; embaixo, o primeiro grupo e as ferramentas, com os logos.
    7. **Recomendamos a capacitação IA para Equipes:** os 4 cartões da seção "Como funciona" do
       site (`Structure.astro`), com o mesmo texto (`DECK.facts`). **Se o site mudar, mude o
       `DECK` também.**
       - **Personalizado só onde ajuda:** "Para vocês: 1 turma" (ou "turmas de até 50,
         definidas juntos") e os logos das ferramentas marcadas. Sem ferramenta concreta, vão os
         3 logos do site e "ou outras soluções homologadas".
       - **Embaixo,** as 3 competências do objetivo.
       - **Sem preço.**
    8. **Como a capacitação se estrutura:** as 3 etapas do site (Diagnóstico de maturidade →
       Sessão 1 · Fundamentos → Sessão 2 · Aplicação). A Sessão 2 ganha "Com exemplos de vocês:"
       com as duas atividades candidatas do objetivo. O `TECH_BOUNDARY` fica no rodapé.
    9. **Contracapa:** o logo empilhado branco, o site, as redes e o QR do site.

    **Saíram** o quadro do piloto, a linha do tempo de 5 marcos (o `TRACK` segue nos dados), "O
    primeiro passo que recomendamos" (o passo e a entrega continuam no cartão do retrato, no
    chat), as decisões e o slide de apoio.

    **Cartões de altura fixa:** os cartões do slide 7 têm `height` fixo. Com `minHeight` e a faixa
    de competências embaixo, o react-pdf media o slide mais alto do que ele é e criava uma página
    em branco (a imagem cabia). Para depurar a paginação sem percorrer o chat, renderize o
    `PlanDocument` no Node: `esbuild --bundle --platform=node --packages=external` e
    `renderToFile`, com as fontes servidas pelo `astro dev`.

    **Apêndice "Como colocar em prática" (diagramas desde 16/11/2026, pedido do Thiago: "mais
    criativo, que deixe a pessoa empolgada em implementar"):**
    - **Abertura:** o que é o apêndice, como ler cada página (etapa, modelo, resultado) e o mapa
      dos desafios marcados com as 3 práticas de cada um.
    - **Um divisor por desafio,** com os 3 títulos como sumário.
    - **Um slide por prática:**
      - à esquerda, a etapa, o título, a frase de abertura e "Entra no plano";
      - à direita, **um diagrama próprio**;
      - embaixo, a faixa com o resultado.
    - **Os 12 diagramas** ficam em `pdf/diagrams.tsx`, e os rótulos em
      `src/data/radar/practice-visuals.ts`. O tipo de cada um segue a forma do conteúdo (regra da
      guizang):

      | Forma | Práticas |
      |---|---|
      | Leque convergente | áreas → inventário |
      | Ficha modelo × "só o prompt" | — |
      | Ciclo | 15 minutos de IA |
      | Matriz 2×2 | frequência × tempo |
      | Placar | antes × com IA |
      | Trilha | 4 passos → entregas |
      | Mapa da política | quem define → 3 grupos de temas |
      | Fluxograma Sim/Não | — |
      | Documento fictício marcado | com hachura no que exige proteção |
      | Funil | 4 filtros |
      | Linha | Hoje → 30 dias |
      | Montagem do piloto | medidores vazios |
    - **Nenhum número inventado:** os campos de medida ficam em branco ("a medir") e os medidores
      não têm valor.
    - **Só Navy e Turquesa:** o "Não" e o "proteger" usam contorno ou hachura Navy.
    - Peças comuns (cores, `SolarIcon`, `IconBadge`, setas, selo "IA") em `pdf/kit.tsx`.
  - **Saíram do PDF:** `NEXT_STEPS` e `CONDITIONS` (as decisões também saíram, em 16/11), a malha do
    topo, o rodapé de texto e os "Três argumentos"/FAQ, que já tinham saído em 13/11.
  - **Ícones:** o PDF desenha os Solar de `icons.ts` (`SolarIcon`). Ícone novo vai em
    `scripts/radar-icons.mjs`; depois rode o script.
  - **Arquivos em `public/radar/`:** `onda-capa.png`, `logo-empilhado-branco.png` e os logos
    horizontais, recortados da skill da marca sem outra edição.
  - **Fontes:** em WOFF em `public/fonts/radar/` (o react-pdf não lê WOFF2).
  - **Peso:** cerca de 3 MB com 4 desafios, quase todo em fontes e na onda.
  - **Revisão visual:** percorra o chat pelo Playwright até o download (com `/api/lead`
    interceptado devolvendo 202) e renderize as páginas com PyMuPDF (`fitz`) em PNG.
- **Menu com seis itens.** No tablet, `gap-3` e 12 px (ver "Materiais"): com o "Diagnóstico IA", o menu encostava no logo em 768 px.
- **Teste sem lead real:** intercepte `**/api/lead` (Playwright `page.route`) devolvendo 202.

## Skill de design Taste (instalada em 16/11/2026)

A skill `design-taste-frontend` (Taste Skill 2.5.1, de `Leonxlnx/taste-skill`) fica em
`.claude/skills/design-taste-frontend/`. A versão está travada no `skills-lock.json`, e
`npx skills update -p` atualiza.

**A Taste é uma consultora, não executora (decisão do Thiago, 16/11/2026).** Ela só entra quando o
Thiago pede, e o que ela indica é sugestão para ele decidir, nunca mudança aplicada direto.

- **Só sob pedido.** O `SKILL.md` instalado tem `disable-model-invocation: true`: o agente não
  aciona a skill sozinho, nem quando a tarefa parece de design. O Thiago chama com
  `/design-taste-frontend` ou pedindo em palavras ("pergunta para a Taste", "o que a Taste acha").
  Fora disso, a skill não é lida nem usada.
  - **Depois de `npx skills update`,** recoloque essa linha no frontmatter, porque a atualização
    sobrescreve o arquivo.
- **Como responder a uma consulta:**
  1. Leia o `SKILL.md` e as referências que tocam o pedido (`copy.md`, `layout-v4.md`,
     `sections.md`, `motion.md`…).
  2. Olhe a página ou a seção pedida, com captura em 1440 e 390 px se for visual.
  3. Devolva um parecer, e não um diff. Para cada recomendação, diga:
     - o que a Taste observa;
     - onde (arquivo ou seção);
     - por que importa;
     - se é compatível com a marca e com este arquivo ou se conflita (e com qual decisão).
  4. Separe o que dá para fazer já do que pediria rever uma decisão registrada. Uma decisão
     registrada só muda com o aval do Thiago.
  5. **Não mexa em nada.** O que for aplicado sai de um pedido seguinte do Thiago e segue o fluxo
     normal (branch, check, build, registro aqui).
- **O que não rodar neste projeto:**
  - o `gate.mjs` com `--start` (ele arma uma "build" e trava o fim das respostas até passar);
  - o `start.mjs deal`/`css`/`brand` e o `deal.mjs` do layout;
  - o `photos.mjs` e o `icons.mjs` (baixam fotos e ícones de fora);
  - a cópia do kit `assets/` para `public/`.

  Os checadores só de leitura (`copy-lint.mjs`, `consistency.mjs`, `shoot.mjs`, `perf.mjs`) podem
  servir de apoio ao parecer, quando o Thiago pedir.
- **O que vale registrar.** Quando o Thiago aprovar uma recomendação, a decisão entra na seção da
  página correspondente, com o racional, como as demais.
- **O que o Thiago já respondeu às consultas (16/11/2026):**
  - **Bordões comerciais ficam.** "Toda transformação começa com um primeiro grupo." e "E se você
    pudesse começar a transformar sua equipe amanhã?" são de propósito: o Radar é entrada de lead.
    Não aponte de novo a §8 nem as regras de copy da Taste para eles.
  - **Nenhum rótulo de formulário no chat.** As perguntas de contato são uma conversa de agente de
    IA, e o campo segue só com o placeholder.

### Segunda skill: `redesign-existing-projects` (auditoria de site existente)

- **O que é:** um checklist de auditoria para sites prontos (tipografia, cor, layout, estados,
  conteúdo, componentes, ícones, código e o que costuma faltar). Fica em
  `.claude/skills/redesign-existing-projects/SKILL.md`.
- **De onde veio:** o autor aposentou essa skill na v2.1.1 do `leonxlnx/taste-skill` e depois a
  removeu do repositório, então o `npx skills add` não acha mais. O arquivo foi copiado da última
  versão no histórico (commit `e04409a`, de 08/10/2026), sem edição além do frontmatter. Não está
  no `skills-lock.json`, e o `npx skills update` não mexe nele.
- **Segurança:** é só texto. Não tem script, hook nem acesso à rede.
- **Uso:** o mesmo modo consultor da Taste.
  - Tem `disable-model-invocation: true`. O Thiago chama com `/redesign-existing-projects` ou
    pedindo a revisão "com a redesign".
  - O método dela é Scan → Diagnose → Fix. Neste projeto vale só Scan e Diagnose: o Fix vira
    parecer.
- **O que conflita com a marca:**
  - a troca de fonte (Geist, Outfit, Satoshi), que é o primeiro item da prioridade dela;
  - o grão, os gradientes e o glassmorphism;
  - as fotos placeholder do Picsum;
  - o smooth scroll com inércia;
  - a troca de ícones (Phosphor, Heroicons).

  Aqui ficam Sora + Poppins, Solar, os tokens do `global.css` e a rolagem nativa.

### Terceira skill: `guizang-ppt-skill` (referência de apresentação)

- **O que é:** a skill de op7418 (歸藏) que gera apresentações em HTML de arquivo único, nos
  estilos revista e suíço. Fica em `.claude/skills/guizang-ppt-skill/`, com a versão travada no
  `skills-lock.json`. Instalada em 16/11/2026 a pedido do Thiago, para redesenhar o plano em PDF.
- **Só como referência, sob pedido.** Tem `disable-model-invocation: true`; recoloque depois de
  `npx skills update`. Ela gera um HTML estático escrito pelo agente, e o nosso PDF é montado no
  navegador com as respostas de cada pessoa. Por isso usamos as ideias e não o gerador:
  - o tipo de conteúdo escolhe o diagrama (ciclo, trilha, matriz, comparação…);
  - nunca inventar dado num gráfico;
  - cada slide com uma composição diferente.
- **Licença AGPL-3.0.** Não copie código, CSS nem templates dela para o site: a AGPL obrigaria a
  abrir o código do site. Use só como leitura.
- **O que não rodar:**
  - o `git fetch`/`git pull` do passo 0 do `SKILL.md`;
  - os validadores (`validate-*.mjs`);
  - o `gz-theme.mjs`;
  - a geração de imagem.
- **O que conflita com a marca:** as serifas (Playfair, Noto Serif), as cores de acento dela
  (azul Klein, amarelo, laranja), o fundo WebGL, os cantos retos obrigatórios do estilo suíço e
  os ícones Lucide. Aqui ficam Sora + Poppins, Navy + Turquesa, cantos arredondados e Solar.

Ela foi feita para criar sites do zero e traz regras próprias. Neste projeto, **a marca e as
decisões deste arquivo vencem**:

- **Ícones.** A Taste pede ícones coloridos de verdade e Lucide. Aqui valem o Solar e a regra
  anti-rainbow (§11): logos de terceiros em cinza, a não ser os selos já aprovados.
- **Paleta e fontes.** A Taste sorteia paleta e par tipográfico (`start.mjs deal`). Aqui são os
  tokens do `global.css` e Sora + Poppins. Não rode o `deal` nem o `css` neste projeto.
- **Movimento.** A Taste proíbe fade-in no scroll. O `reveal.ts` do site é uma decisão do projeto e
  fica.
- **Fotos e efeitos.** A Taste busca fotos de banco (Wikimedia, Picsum) e põe shaders em páginas de
  tecnologia. Aqui só entram fotos e efeitos aprovados pelo Thiago.

Onde ela mais ajuda: um olhar de fora sobre layout, hierarquia, ritmo das seções, copy genérica
("cara de IA"), estados de hover e foco, e como a página se comporta em 390 px.

Quando o Thiago aciona a skill, ela registra um hook de `Stop` que roda o `scripts/gate.mjs`. Sem
uma build armada pelo `--start`, o gate não bloqueia. Os checadores gravam em `.taste-skill/`, que
está no `.gitignore`.

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
- **Captura do vídeo do "Como funciona".** Role até `[data-journey]` e espere uns 4 s, porque o
  vídeo só começa a baixar perto da seção. Para ver o quadro final, espere o vídeo inteiro
  (uns 45 s) e confira que o `currentTime` parou no `HOLD_AT`. O header sticky pode aparecer por
  cima da seção na captura do elemento: é efeito da captura, não da página.

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
