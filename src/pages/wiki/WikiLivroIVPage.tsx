import WikiBookPage from './WikiBookPage';
import {
  WIKI_LIVRO_IV_CHAPTERS,
  WIKI_LIVRO_IV_CLOSING_ATTRIBUTION,
  WIKI_LIVRO_IV_CLOSING_BLOCKQUOTE,
  WIKI_LIVRO_IV_EPIGRAPH,
  WIKI_LIVRO_IV_EPIGRAPH_ATTRIBUTION,
  WIKI_LIVRO_IV_FIN,
  WIKI_LIVRO_IV_SUBTITLE,
  WIKI_LIVRO_IV_TITLE,
} from '../../data/wikiLivroIV';

export default function WikiLivroIVPage() {
  return (
    <WikiBookPage
      navParentHref="/wiki/genese-livros"
      navParentLabel="Crônicas (livros)"
      navCurrentLabel="Livro IV"
      title={WIKI_LIVRO_IV_TITLE}
      subtitle={WIKI_LIVRO_IV_SUBTITLE}
      epigraph={WIKI_LIVRO_IV_EPIGRAPH || undefined}
      epigraphAttribution={WIKI_LIVRO_IV_EPIGRAPH_ATTRIBUTION || undefined}
      chapters={WIKI_LIVRO_IV_CHAPTERS}
      closingBlockquote={WIKI_LIVRO_IV_CLOSING_BLOCKQUOTE}
      closingAttribution={WIKI_LIVRO_IV_CLOSING_ATTRIBUTION || undefined}
      fin={WIKI_LIVRO_IV_FIN}
    />
  );
}
