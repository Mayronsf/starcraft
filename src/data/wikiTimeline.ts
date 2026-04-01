/**
 * Linha do tempo no estilo wiki: ano → meses → entradas (com sub-itens opcionais).
 * Deixe TIMELINE anos vazio para mostrar só o texto introdutório; preencha com eventos reais.
 */
export type WikiTimelineLine = {
  text: string;
  sublines?: WikiTimelineLine[];
};

export type WikiTimelineMonth = {
  label: string;
  lines: WikiTimelineLine[];
};

export type WikiTimelineYear = {
  year: string;
  months: WikiTimelineMonth[];
};

export const WIKI_TIMELINE_INTRO: string[] = [
  'Esta **linha do tempo** registra o que aconteceu no servidor **ordenado por data**: fundações, guerras, resets, lançamentos de temporada e outros marcos. Eventos podem ser expandidos com subtópicos (por exemplo, clãs fundados num mesmo período).',
  '**Importante:** defina aqui a partir de qual data a linha passa a valer (por exemplo, após um reset de mapa), para evitar confusão com eras antigas.',
];

/**
 * Preencha com os anos reais do servidor.
 * Exemplo de estrutura (comente ou copie):
 *
 * export const WIKI_TIMELINE_YEARS: WikiTimelineYear[] = [
 *   {
 *     year: '2025',
 *     months: [
 *       {
 *         label: 'Março de 2025',
 *         lines: [
 *           { text: '01 de março — Abertura da Season One.' },
 *           {
 *             text: 'Final de março — Vários clãs fundam bases perto do spawn.',
 *             sublines: [{ text: '15 de março — **Reino X** é fundado.' }],
 *           },
 *         ],
 *       },
 *     ],
 *   },
 * ];
 */
export const WIKI_TIMELINE_YEARS: WikiTimelineYear[] = [];
