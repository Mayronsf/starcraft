import WikiBookPage from './WikiBookPage';
import {
  WIKI_LIVRO_III_CHAPTERS,
  WIKI_LIVRO_III_CLOSING_ATTRIBUTION,
  WIKI_LIVRO_III_CLOSING_BLOCKQUOTE,
  WIKI_LIVRO_III_EPIGRAPH,
  WIKI_LIVRO_III_EPIGRAPH_ATTRIBUTION,
  WIKI_LIVRO_III_FIN,
  WIKI_LIVRO_III_SUBTITLE,
  WIKI_LIVRO_III_TITLE,
} from '../../data/wikiLivroIII';

export default function WikiLivroIIIPage() {
  return (
    <WikiBookPage
      navParentHref="/wiki/genese-livros"
      navParentLabel="Crônicas (livros)"
      navCurrentLabel="Livro III"
      title={WIKI_LIVRO_III_TITLE}
      subtitle={WIKI_LIVRO_III_SUBTITLE}
      epigraph={WIKI_LIVRO_III_EPIGRAPH}
      epigraphAttribution={WIKI_LIVRO_III_EPIGRAPH_ATTRIBUTION}
      chapters={WIKI_LIVRO_III_CHAPTERS}
      closingBlockquote={WIKI_LIVRO_III_CLOSING_BLOCKQUOTE}
      closingAttribution={WIKI_LIVRO_III_CLOSING_ATTRIBUTION}
      fin={WIKI_LIVRO_III_FIN}
    />
  );
}
