/**
 * Leis do mundo — StarCraft: A Gênese (fonte: documento oficial do servidor).
 */

export const WIKI_LEIS_TITLE = 'Leis do mundo';
export const WIKI_LEIS_SUBTITLE = 'StarCraft — A Gênese';

export const WIKI_LEIS_EPIGRAPH =
  'Estas são as leis que regem esta terra. Quebrá-las é desafiar a própria ordem do mundo — e o mundo sempre cobra.';

export type WikiLeisItem = {
  id: string;
  title: string;
  body: string;
  /** Linhas extras (ex.: escala de punições com emojis) */
  sublines?: string[];
  /** Parágrafo após sublines (ex.: 6.3) */
  extraAfterSublines?: string;
};

export type WikiLeisSection = {
  title: string;
  emoji?: string;
  items: WikiLeisItem[];
};

export const WIKI_LEIS_SECTIONS: WikiLeisSection[] = [
  {
    emoji: '📜',
    title: 'I. Leis da convivência',
    items: [
      {
        id: '1.1',
        title: 'Respeito acima de tudo',
        body:
          'Somos todos recém-chegados nesta terra. Ofensas, discriminação, assédio, racismo, homofobia ou qualquer forma de hostilidade fora do roleplay são proibidos. Dentro do jogo, seja o vilão que quiser. Fora dele, seja humano.',
      },
      {
        id: '1.2',
        title: 'Sem conteúdo impróprio',
        body:
          'É proibido compartilhar conteúdo NSFW, gore, pornografia ou qualquer material impróprio em qualquer canal do Discord ou no servidor de Minecraft.',
      },
      {
        id: '1.3',
        title: 'Sem spam ou flood',
        body:
          'Não encha os canais com mensagens repetidas, links aleatórios, autopromoção de outros servidores ou correntes. O Discord é parte do mundo — trate-o como tal.',
      },
      {
        id: '1.4',
        title: 'Nomes e skins adequados',
        body:
          'Nicks ofensivos ou skins com conteúdo impróprio não são permitidos. Você pode ser um guerreiro sombrio, não precisa ser desrespeitoso.',
      },
    ],
  },
  {
    emoji: '⚔️',
    title: 'II. Leis do roleplay',
    items: [
      {
        id: '2.1',
        title: 'O roleplay é sagrado',
        body:
          'Este é um servidor de história. Suas ações dentro do jogo fazem parte da narrativa do mundo. Mate, roube, traia — se fizer sentido para sua história. Mas griefing sem propósito (destruir por destruir, sem contexto narrativo) é proibido.',
      },
      {
        id: '2.2',
        title: 'Construções são legado',
        body:
          'Construções de outros jogadores são parte da história do mundo. Não destrua construções alheias sem um motivo narrativo legítimo (guerra declarada, conquista de território, cerco). Destruição gratuita será punida.',
      },
      {
        id: '2.3',
        title: 'Morte em RP',
        body:
          'PvP é permitido e faz parte do mundo. Porém, matar o mesmo jogador repetidamente sem motivo (spawn kill, perseguição) é considerado abuso e será punido.',
      },
      {
        id: '2.4',
        title: 'Declare suas intenções',
        body:
          'Guerras entre clãs, cercos a territórios e ataques em larga escala devem ser comunicados à staff para serem registrados nas Crônicas do Mundo. Conflitos não declarados são apenas brigas — conflitos declarados são história.',
      },
    ],
  },
  {
    emoji: '🌾',
    title: 'III. Leis da economia',
    items: [
      {
        id: '3.1',
        title: 'Comércio livre',
        body:
          'Compre, venda, troque, monopolize. A economia é selvagem como o mundo. Golpes comerciais fazem parte do jogo — mas lembre-se: a reputação é o bem mais valioso que existe.',
      },
      {
        id: '3.2',
        title: 'Sem exploits econômicos',
        body:
          'Duplicação de itens, bugs de farm ou qualquer exploração de falhas para ganho econômico é proibida. Quem for pego será punido e terá seus itens removidos.',
      },
    ],
  },
  {
    emoji: '🛡',
    title: 'IV. Leis do servidor',
    items: [
      {
        id: '4.1',
        title: 'Hacks e trapaças são banimento',
        body:
          'Clientes modificados, x-ray, fly, kill aura, auto-clicker ou qualquer forma de trapaça resultam em banimento permanente. Sem exceções. Sem apelação. Sem segunda chance.',
      },
      {
        id: '4.2',
        title: 'Mods permitidos',
        body:
          'Apenas mods de performance e visuais são permitidos (Optifine, Sodium, shaders, minimapa). Qualquer mod que dê vantagem em combate, mineração ou exploração é proibido. Em caso de dúvida, pergunte à staff antes de usar.',
      },
      {
        id: '4.3',
        title: 'Contas alternativas',
        body:
          'Cada jogador deve usar apenas uma conta. Alts para espionagem, evasão de ban ou qualquer outro propósito são proibidas.',
      },
    ],
  },
  {
    emoji: '🔮',
    title: 'V. Leis do desconhecido',
    items: [
      {
        id: '5.1',
        title: 'O End é selado',
        body:
          'A dimensão do End está trancada por forças além da nossa compreensão. Tentar acessá-la antes que o selo seja quebrado oficialmente é proibido. Quando chegar a hora, todos saberão.',
      },
      {
        id: '5.2',
        title: 'Os sussurros',
        body:
          'Pelo mundo existem escritos antigos escondidos em baús e cavernas. Se você encontrar um, a descoberta é sua — compartilhe com quem quiser, guarde para si ou use como moeda de troca. Mas não fabrique sussurros falsos. Falsificar livros de lore é proibido.',
      },
      {
        id: '5.3',
        title: 'Eventos do mundo',
        body:
          'A staff pode lançar eventos narrativos a qualquer momento — invasões, anomalias, escassez, descobertas. Esses eventos são parte da história do mundo. Participe, adapte-se, sobreviva.',
      },
    ],
  },
  {
    emoji: '👑',
    title: 'VI. Leis da ordem',
    items: [
      {
        id: '6.1',
        title: 'A staff é o destino',
        body:
          'A equipe de administração atua como as forças do mundo. Suas decisões são finais. Se discordar de uma decisão, abra um ticket com respeito — o Destino ouve, mas não tolera desaforo.',
      },
      {
        id: '6.2',
        title: 'Tickets e denúncias',
        body:
          'Problemas, denúncias e dúvidas devem ser enviados pelo canal de tickets. Não marque a staff em canais públicos para reclamar. O mundo tem seus meios formais.',
      },
      {
        id: '6.3',
        title: 'Punições',
        body:
          'As punições seguem uma escala progressiva dependendo da gravidade:',
        sublines: [
          '🟡 Advertência — para infrações leves ou primeira vez.',
          '🟠 Mute temporário — para reincidência ou desrespeito.',
          '🔴 Ban temporário — para infrações graves.',
          '⛔ Ban permanente — para hacks, trapaças, discriminação grave ou infrações extremas.',
        ],
        extraAfterSublines:
          'A staff reserva o direito de aplicar a punição que julgar adequada de acordo com a situação.',
      },
    ],
  },
  {
    emoji: '🎮',
    title: 'VII. Lei suprema',
    items: [
      {
        id: '7.1',
        title: 'Divirta-se',
        body:
          'Acima de tudo, este mundo existe para ser vivido. Faça amigos, faça inimigos, construa impérios ou ande sozinho. Mas aproveite cada momento.',
      },
    ],
  },
];

/** Parágrafo após VII (citação) */
export const WIKI_LEIS_CLOSING_QUOTE = 'O mundo está assistindo. Não o decepcionem.';

export const WIKI_LEIS_ACCEPTANCE = {
  title: 'Aceitação',
  paragraphs: [
    'Ao permanecer neste Discord e jogar no servidor, você concorda com todas as leis acima. O desconhecimento das regras não isenta de punição.',
  ],
  closing:
    'Cada era termina com fogo. Mas do fogo, sempre nasce algo novo. Que sua passagem por este mundo valha a pena.',
  signoff: 'StarCraft — A Gênese · A história é sua.',
};
