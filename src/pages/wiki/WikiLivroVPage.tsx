import WikiBookPage from './WikiBookPage';
import {
  WIKI_LIVRO_V_CHAPTERS,
  WIKI_LIVRO_V_CLOSING_ATTRIBUTION,
  WIKI_LIVRO_V_CLOSING_BLOCKQUOTE,
  WIKI_LIVRO_V_EPIGRAPH,
  WIKI_LIVRO_V_EPIGRAPH_ATTRIBUTION,
  WIKI_LIVRO_V_FIN,
  WIKI_LIVRO_V_SUBTITLE,
  WIKI_LIVRO_V_TITLE,
} from '../../data/wikiLivroV';

export default function WikiLivroVPage() {
  return (
    <WikiBookPage
      navParentHref="/wiki/genese-livros"
      navParentLabel="Crônicas (livros)"
      navCurrentLabel="Livro V"
      title={WIKI_LIVRO_V_TITLE}
      subtitle={WIKI_LIVRO_V_SUBTITLE}
      epigraph={WIKI_LIVRO_V_EPIGRAPH || undefined}
      epigraphAttribution={WIKI_LIVRO_V_EPIGRAPH_ATTRIBUTION || undefined}
      chapters={WIKI_LIVRO_V_CHAPTERS}
      closingBlockquote={WIKI_LIVRO_V_CLOSING_BLOCKQUOTE}
      closingAttribution={WIKI_LIVRO_V_CLOSING_ATTRIBUTION || undefined}
      fin={WIKI_LIVRO_V_FIN}
    />
  );
}
