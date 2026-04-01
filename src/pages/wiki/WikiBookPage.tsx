import { Link } from 'react-router-dom';
import { renderWikiText } from '../../utils/renderWikiText';

export type WikiBookChapter = { title: string; paragraphs: string[] };

export type WikiBookPageProps = {
  navParentHref: string;
  navParentLabel: string;
  navCurrentLabel: string;
  title: string;
  subtitle?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  chapters: WikiBookChapter[];
  closingBlockquote?: string[];
  closingAttribution?: string;
  fin?: string;
};

export default function WikiBookPage({
  navParentHref,
  navParentLabel,
  navCurrentLabel,
  title,
  subtitle,
  epigraph,
  epigraphAttribution,
  chapters,
  closingBlockquote,
  closingAttribution,
  fin,
}: WikiBookPageProps) {
  return (
    <article className="wiki-prose">
      <nav className="text-xs text-[#54595d] mb-6 font-body">
        <Link to="/wiki" className="text-[#3366cc] hover:underline">
          Página principal da Wiki
        </Link>
        <span className="mx-1.5">·</span>
        <Link to={navParentHref} className="text-[#3366cc] hover:underline">
          {navParentLabel}
        </Link>
        <span className="mx-1.5">·</span>
        <span>{navCurrentLabel}</span>
      </nav>

      <h1 className="wiki-h1">{title}</h1>
      {subtitle && (
        <p className="text-center text-[#54595d] text-sm font-narrative mb-6 max-w-2xl mx-auto leading-snug">
          {subtitle}
        </p>
      )}

      {epigraph && (
        <blockquote className="border-l-4 border-[#a2a9b1] pl-4 my-6 italic text-[#202122] font-narrative text-[0.95rem] leading-relaxed">
          <p className="mb-2">“{epigraph}”</p>
          {epigraphAttribution && (
            <footer className="text-[#54595d] not-italic text-sm">{epigraphAttribution}</footer>
          )}
        </blockquote>
      )}

      {chapters.map((chapter) => (
        <section key={chapter.title} className="mt-10 first:mt-6">
          <h2 className="wiki-h2">{chapter.title}</h2>
          <hr className="wiki-rule" />
          {chapter.paragraphs.length === 0 ? (
            <p className="text-[#72777d] text-sm italic">—</p>
          ) : (
            chapter.paragraphs.map((para, i) => (
              <p key={i} className="text-justify hyphens-auto">
                {renderWikiText(para)}
              </p>
            ))
          )}
        </section>
      ))}

      {closingBlockquote && closingBlockquote.length > 0 && (
        <blockquote className="border-l-4 border-ancient-gold/40 pl-4 my-10 py-2 italic font-narrative text-[#202122] leading-relaxed">
          {closingBlockquote.map((p, i) => (
            <p key={i} className="mb-0">
              “{p}”
            </p>
          ))}
          {closingAttribution && (
            <footer className="mt-3 not-italic text-sm text-[#54595d]">{closingAttribution}</footer>
          )}
        </blockquote>
      )}

      {fin && (
        <p className="text-center font-title text-ancient-gold/90 text-sm md:text-base mt-12 pt-6 border-t border-[#eaecf0]">
          {fin}
        </p>
      )}
    </article>
  );
}
