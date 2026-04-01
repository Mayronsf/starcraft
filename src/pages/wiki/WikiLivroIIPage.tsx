import WikiBookPage from './WikiBookPage';
import {
  WIKI_LIVRO_II_CHAPTERS,
  WIKI_LIVRO_II_CLOSING_ATTRIBUTION,
  WIKI_LIVRO_II_CLOSING_BLOCKQUOTE,
  WIKI_LIVRO_II_EPIGRAPH,
  WIKI_LIVRO_II_EPIGRAPH_ATTRIBUTION,
  WIKI_LIVRO_II_FIN,
  WIKI_LIVRO_II_SUBTITLE,
  WIKI_LIVRO_II_TITLE,
} from '../../data/wikiLivroII';

export default function WikiLivroIIPage() {
  return (
    <WikiBookPage
      navParentHref="/wiki/genese-livros"
      navParentLabel="Crônicas (livros)"
      navCurrentLabel="Livro II"
      title={WIKI_LIVRO_II_TITLE}
      subtitle={WIKI_LIVRO_II_SUBTITLE}
      epigraph={WIKI_LIVRO_II_EPIGRAPH}
      epigraphAttribution={WIKI_LIVRO_II_EPIGRAPH_ATTRIBUTION}
      chapters={WIKI_LIVRO_II_CHAPTERS}
      closingBlockquote={WIKI_LIVRO_II_CLOSING_BLOCKQUOTE}
      closingAttribution={WIKI_LIVRO_II_CLOSING_ATTRIBUTION}
      fin={WIKI_LIVRO_II_FIN}
    />
  );
}
