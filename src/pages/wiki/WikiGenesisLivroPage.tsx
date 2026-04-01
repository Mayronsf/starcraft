import { Link } from 'react-router-dom';
import {
  WIKI_GENESIS_LIVRO_I_CHAPTERS,
  WIKI_GENESIS_LIVRO_I_CLOSING_ATTRIBUTION,
  WIKI_GENESIS_LIVRO_I_CLOSING_BLOCKQUOTE,
  WIKI_GENESIS_LIVRO_I_EPIGRAPH,
  WIKI_GENESIS_LIVRO_I_EPIGRAPH_ATTRIBUTION,
  WIKI_GENESIS_LIVRO_I_FIN,
  WIKI_GENESIS_LIVRO_I_SUBTITLE,
  WIKI_GENESIS_LIVRO_I_TITLE,
} from '../../data/wikiGenesisLivroI';
import { renderWikiText } from '../../utils/renderWikiText';

export default function WikiGenesisLivroPage() {
  return (
    <article className="wiki-prose">
      <nav className="text-xs text-[#54595d] mb-6 font-body">
        <Link to="/wiki" className="text-[#3366cc] hover:underline">
          Página principal da Wiki
        </Link>
        <span className="mx-1.5">·</span>
        <Link to="/wiki/genese-livros" className="text-[#3366cc] hover:underline">
          Crônicas (livros)
        </Link>
        <span className="mx-1.5">·</span>
        <span>Livro I</span>
      </nav>

      <h1 className="wiki-h1">{WIKI_GENESIS_LIVRO_I_TITLE}</h1>
      <p className="text-center text-[#54595d] text-sm font-narrative mb-6 max-w-2xl mx-auto leading-snug">
        {WIKI_GENESIS_LIVRO_I_SUBTITLE}
      </p>

      <blockquote className="border-l-4 border-[#a2a9b1] pl-4 my-6 italic text-[#202122] font-narrative text-[0.95rem] leading-relaxed">
        <p className="mb-2">“{WIKI_GENESIS_LIVRO_I_EPIGRAPH}”</p>
        <footer className="text-[#54595d] not-italic text-sm">{WIKI_GENESIS_LIVRO_I_EPIGRAPH_ATTRIBUTION}</footer>
      </blockquote>

      {WIKI_GENESIS_LIVRO_I_CHAPTERS.map((chapter) => (
        <section key={chapter.title} className="mt-10 first:mt-6">
          <h2 className="wiki-h2">{chapter.title}</h2>
          <hr className="wiki-rule" />
          {chapter.paragraphs.map((para, i) => (
            <p key={i} className="text-justify hyphens-auto">
              {renderWikiText(para)}
            </p>
          ))}
        </section>
      ))}

      <blockquote className="border-l-4 border-ancient-gold/40 pl-4 my-10 py-2 italic font-narrative text-[#202122] leading-relaxed">
        {WIKI_GENESIS_LIVRO_I_CLOSING_BLOCKQUOTE.map((p, i) => (
          <p key={i} className="mb-0">
            “{p}”
          </p>
        ))}
        <footer className="mt-3 not-italic text-sm text-[#54595d]">{WIKI_GENESIS_LIVRO_I_CLOSING_ATTRIBUTION}</footer>
      </blockquote>

      <p className="text-center font-title text-ancient-gold/90 text-sm md:text-base mt-12 pt-6 border-t border-[#eaecf0]">
        {WIKI_GENESIS_LIVRO_I_FIN}
      </p>
    </article>
  );
}
