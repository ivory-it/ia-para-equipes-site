/**
 * Tela 01 — A provocação. Quatro desafios, cada um com três pílulas práticas.
 * Texto do documento do Radar IA v1.4 (§3). `practice` aceita lista numerada
 * (`steps`) ou com marcadores (`bullets`).
 */
import type { ActionId } from './actions.ts';

export type ChallengeId = 'uso-individual' | 'pouca-aplicacao' | 'seguranca' | 'direcionamento';

export interface Pill {
  id: string;
  stage: string;
  title: string;
  /** Parágrafos de abertura. */
  body: string[];
  /** Texto do "Coloque em prática". */
  practice: string;
  steps?: string[];
  bullets?: string[];
  /** Parágrafo final (descoberta, dica ou resultado). */
  closing?: { label?: string; text: string };
  action: ActionId;
}

export interface Challenge {
  id: ChallengeId;
  /** Rótulo curto, usado no radar e no plano. */
  label: string;
  text: string;
  pills: [Pill, Pill, Pill];
}

export const CHALLENGES_INTRO = {
  eyebrow: 'Tela 1 de 7 · A provocação',
  /** Primeira fala: o combinado da conversa (revisão de clareza, 16/11/2026). */
  opening: 'São 5 etapas rápidas. No fim, você recebe um plano em PDF para levar à liderança.',
  title: 'Quais situações são realidade na empresa?',
  question: 'Quais destas situações se parecem com a realidade da sua organização?',
  hint: 'Pode marcar mais de uma opção.',
  savedToast: 'Ação adicionada ao seu plano de evolução com IA.',
  mapToast: 'Esta iniciativa agora faz parte do seu mapa.',
  conclusionTitle: 'Você acaba de identificar seus primeiros passos para evoluir com IA.',
  conclusionText: 'Agora vamos entender melhor a realidade da sua empresa para descobrir quais oportunidades podem fazer mais diferença.',
  next: 'Descobrir o potencial da minha equipe',
};

export const CHALLENGES: Challenge[] = [
  {
    id: 'uso-individual',
    label: 'Uso individual',
    text: 'Algumas pessoas usam IA, mas cada uma do seu jeito.',
    pills: [
      {
        id: 'uso-individual-1',
        stage: 'Descobrir',
        title: 'Talvez sua empresa já tenha especialistas em IA. Só não sabe quem são.',
        body: ['Antes de investir em novos recursos, descubra como os colaboradores já estão utilizando IA.'],
        practice: 'Peça para cada área compartilhar uma tarefa que realiza com IA, qual ferramenta utiliza e quais benefícios percebeu.',
        closing: { text: 'Você terá o início de um inventário de aplicações reais, construído com conhecimento que já existe na empresa.' },
        action: 'mapear-aplicacoes',
      },
      {
        id: 'uso-individual-2',
        stage: 'Organizar',
        title: 'Não compartilhe apenas prompts. Compartilhe maneiras de trabalhar.',
        body: ['Um prompt que funciona para uma pessoa pode não funcionar para outra porque falta contexto.'],
        practice: 'Documente cada boa aplicação com quatro elementos:',
        steps: [
          'Objetivo da atividade.',
          'Informações necessárias para executá-la.',
          'Instruções fornecidas à IA.',
          'Critérios para revisar o resultado.',
        ],
        closing: { text: 'Assim, você cria uma biblioteca de práticas reutilizáveis, não apenas uma coleção de comandos.' },
        action: 'biblioteca-praticas',
      },
      {
        id: 'uso-individual-3',
        stage: 'Multiplicar',
        title: 'Crie um ritual de 15 minutos para multiplicar o conhecimento.',
        body: ['A cada duas semanas, convide um colaborador para demonstrar uma aplicação de IA que utiliza no trabalho. Ele apresenta o problema, o processo, o resultado e o que aprendeu.'],
        practice: 'Crie um encontro chamado “15 minutos de IA”, no qual uma pessoa compartilha uma experiência e responde às dúvidas dos colegas. Registre a prática em um espaço compartilhado para que outros possam adaptá-la.',
        action: 'encontros-quinzenais',
      },
    ],
  },
  {
    id: 'pouca-aplicacao',
    label: 'Pouca aplicação prática',
    text: 'Temos ferramentas disponíveis, mas pouca aplicação prática.',
    pills: [
      {
        id: 'pouca-aplicacao-1',
        stage: 'Identificar',
        title: 'Pare de perguntar o que a IA consegue fazer.',
        body: ['Comece perguntando: “Quais atividades mais consomem tempo da nossa equipe?”'],
        practice: 'Escolha três tarefas frequentes e avalie:',
        steps: [
          'Quanto tempo consomem?',
          'Quantas vezes são executadas?',
          'Quão simples e seguro seria experimentar IA nessas atividades?',
        ],
        closing: { text: 'Você terá um primeiro mapa de oportunidades, priorizando atividades recorrentes e de menor risco.' },
        action: 'priorizar-tres-atividades',
      },
      {
        id: 'pouca-aplicacao-2',
        stage: 'Experimentar',
        title: 'Uma demonstração convence. Uma comparação ensina.',
        body: ['Selecione uma atividade real e execute-a de duas formas: com o processo atual e com apoio da IA.'],
        practice: 'Compare três aspectos:',
        bullets: [
          'Tempo necessário para concluir a atividade.',
          'Qualidade da entrega produzida.',
          'Esforço necessário para revisar o resultado.',
        ],
        closing: { label: 'A descoberta', text: 'Nem sempre a melhor aplicação é a mais rápida. É aquela que melhora o trabalho sem comprometer a qualidade.' },
        action: 'experimento-com-sem-ia',
      },
      {
        id: 'pouca-aplicacao-3',
        stage: 'Desenvolver',
        title: 'Transforme o aprendizado em uma entrega real.',
        body: ['Em vez de ensinar dez funcionalidades isoladas, proponha que cada participante desenvolva uma aplicação relacionada à própria rotina: relatório, análise, apresentação ou procedimento.'],
        practice: 'Cada profissional:',
        steps: [
          'Escolhe uma tarefa do cotidiano.',
          'Experimenta executá-la com IA.',
          'Revisa e aperfeiçoa o resultado.',
          'Compartilha o que aprendeu.',
        ],
        action: 'desafios-praticos',
      },
    ],
  },
  {
    id: 'seguranca',
    label: 'Segurança e governança',
    text: 'Existe interesse, mas temos preocupações com segurança.',
    pills: [
      {
        id: 'seguranca-1',
        stage: 'Estabelecer diretrizes',
        title: 'Sua empresa já definiu as regras para o uso de IA?',
        body: ['Uma boa Política Corporativa de Uso de IA não precisa começar como um documento extenso e complicado. Ela precisa ajudar os colaboradores a entender o que podem fazer, quais cuidados tomar e quando buscar orientação.'],
        practice: 'Reúna TI, Segurança da Informação, Jurídico/Privacidade, RH e representantes das áreas de negócio para definir diretrizes. A política deve cobrir, pelo menos:',
        steps: [
          'Ferramentas autorizadas: quais soluções de IA podem ser usadas e em quais condições.',
          'Classificação e proteção de dados: regras para informações públicas, internas, confidenciais e pessoais.',
          'Privacidade e LGPD: finalidade, autorização e cuidados com dados pessoais e sensíveis.',
          'Usos permitidos e proibidos: atividades liberadas, restritas e sujeitas à aprovação.',
          'Validação humana: responsabilidade pela revisão, sobretudo em decisões importantes.',
          'Confidencialidade e propriedade intelectual: cuidado com clientes, contratos, estratégias e conteúdo protegido.',
          'Acessos e registros: contas corporativas, permissões, retenção e rastreabilidade quando aplicável.',
          'Incidentes e responsabilidades: procedimentos para comunicar vazamentos, compartilhamento indevido ou resultados inadequados.',
          'Capacitação e conscientização: como os colaboradores aprenderão as boas práticas.',
          'Revisão e atualização: responsáveis pela política e frequência de reavaliação.',
        ],
        closing: { label: 'Dica', text: 'Após aprovar as diretrizes, crie um guia visual de uma página com as regras mais importantes e exemplos reais. A política formaliza as decisões; o guia ajuda as pessoas a aplicá-las.' },
        action: 'politica-uso-ia',
      },
      {
        id: 'seguranca-2',
        stage: 'Desenvolver o julgamento',
        title: 'Ensine três perguntas antes de enviar informações para uma IA.',
        body: ['Não basta oferecer ferramentas seguras; os colaboradores precisam identificar situações que exigem cuidado.'],
        practice: 'Ensine cada profissional a perguntar:',
        steps: [
          'Estou utilizando uma ferramenta aprovada pela empresa?',
          'Tenho autorização para compartilhar essas informações nesse ambiente?',
          'Sei como verificar o resultado antes de utilizá-lo?',
        ],
        closing: { label: 'A descoberta', text: 'Segurança também depende das decisões das pessoas durante o trabalho. Essas perguntas podem integrar um guia, o onboarding e ações de capacitação.' },
        action: 'checklist-uso-responsavel',
      },
      {
        id: 'seguranca-3',
        stage: 'Praticar com segurança',
        title: 'Ensine com situações reais, sem expor dados reais.',
        body: ['Uma política estabelece regras; é na prática que o colaborador aprende a aplicá-las.'],
        practice: 'Crie exercícios com dados fictícios que reproduzam contratos, currículos, relatórios e documentos internos. Peça que participantes identifiquem:',
        steps: [
          'Quais informações podem ser utilizadas na ferramenta aprovada?',
          'Quais exigem proteção ou autorização adicional?',
          'Como verificar se a resposta da IA está correta?',
        ],
        closing: { label: 'O resultado', text: 'A equipe pratica decisões de segurança antes de lidar com informações corporativas.' },
        action: 'exercicios-cenarios-ficticios',
      },
    ],
  },
  {
    id: 'direcionamento',
    label: 'Falta de direcionamento',
    text: 'Queremos avançar, mas não sabemos por onde começar.',
    pills: [
      {
        id: 'direcionamento-1',
        stage: 'Priorizar',
        title: 'Seu primeiro projeto de IA não precisa ser o mais impressionante.',
        body: ['Comece por uma tarefa simples o suficiente para aprender e relevante o suficiente para despertar interesse.'],
        practice: 'Escolha uma atividade que:',
        steps: [
          'Aconteça frequentemente.',
          'Tenha entrada e saída bem definidas.',
          'Possa ser experimentada com baixo risco.',
          'Permita observar uma melhoria concreta.',
        ],
        closing: { text: 'Não tente mudar todos os processos ao mesmo tempo.' },
        action: 'primeira-atividade',
      },
      {
        id: 'direcionamento-2',
        stage: 'Direcionar',
        title: 'Comece pelo resultado que você quer alcançar em 30 dias.',
        body: [
          'Em vez de perguntar “Qual ferramenta devemos adotar?”, pergunte:',
          '“O que gostaríamos que nossa equipe conseguisse fazer melhor daqui a 30 dias?”',
        ],
        practice: 'Transforme a resposta em um objetivo observável, como:',
        bullets: [
          'Preparar relatórios com menos esforço.',
          'Melhorar a qualidade de documentos.',
          'Agilizar a preparação de reuniões.',
          'Desenvolver a capacidade de analisar informações.',
          'Organizar melhor o conhecimento da equipe.',
        ],
        closing: { text: 'Defina como perceber que houve evolução.' },
        action: 'objetivo-30-dias',
      },
      {
        id: 'direcionamento-3',
        stage: 'Experimentar',
        title: 'Não comece por toda a empresa. Comece por um grupo piloto.',
        body: ['Escolha um grupo de colaboradores, duas atividades e um período de experimentação.'],
        practice: 'Acompanhe:',
        steps: [
          'Adoção: frequência de uso de IA nas atividades selecionadas.',
          'Qualidade: atendimento aos critérios esperados.',
          'Eficiência: tempo necessário para executar as atividades.',
        ],
        closing: { text: 'Depois reúna aprendizados, dificuldades e decisões de expansão.' },
        action: 'piloto-indicadores',
      },
    ],
  },
];

export const challengeById = (id: ChallengeId) => CHALLENGES.find((c) => c.id === id)!;
