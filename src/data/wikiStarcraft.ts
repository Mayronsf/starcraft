/**
 * Conteúdo da página principal do servidor (história + informações técnicas).
 * Edite os parágrafos conforme a lore real do servidor.
 */
export const WIKI_STARCRAFT_INTRO: string[] = [
  'O **StarCraft — A Gênese** é um servidor de Minecraft sob a perspectiva de um mundo que nasce: facções, economia, diplomacia e conflitos ainda estão em formação. Esta página reúne a história acordada do servidor e dados técnicos úteis aos jogadores.',
];

export const WIKI_STARCRAFT_SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: 'História',
    paragraphs: [
      '_(Em construção.)_ Aqui entrará o relato de como o servidor foi concebido, marcos da **Season One** e decisões da equipe que moldaram o mundo.',
      'Inclua datas aproximadas, mudanças de mapa, eventos de abertura e qualquer narrativa oficial que queiram preservar.',
    ],
  },
  {
    title: 'Informações técnicas',
    paragraphs: [
      '_(Em construção.)_ **Versão do Minecraft**, host, **IP** (ou domínio), uso de **Forge/Fabric/Plugins** (Vanilla + plugins, modpack, etc.), **slots**, **região do servidor** e links oficiais (Discord, site).',
      'Exemplo de itens a detalhar: requisitos do cliente, resource packs obrigatórios, se há whitelist, e canais de suporte.',
    ],
  },
];
