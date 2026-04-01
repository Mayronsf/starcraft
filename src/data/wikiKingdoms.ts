/**
 * Kingdoms — clãs / reinos do servidor. (Equivalente a "Grupos" em wikis anárquicas.)
 */
export const WIKI_KINGDOMS_INTRO: string[] = [
  '**Kingdoms** são os grandes agrupamentos do servidor: clãs, nações, facções ou reinos que competem ou cooperam no mundo. Cada entrada pode ser expandida com descrição, líderes e períodos de atividade.',
];

export type WikiKingdom = {
  name: string;
  description?: string;
};

export const WIKI_KINGDOMS: WikiKingdom[] = [];
