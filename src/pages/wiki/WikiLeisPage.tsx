import {
  WIKI_LEIS_ACCEPTANCE,
  WIKI_LEIS_CLOSING_QUOTE,
  WIKI_LEIS_EPIGRAPH,
  WIKI_LEIS_SECTIONS,
  WIKI_LEIS_SUBTITLE,
  WIKI_LEIS_TITLE,
} from '../../data/wikiLeis';
import { renderWikiText } from '../../utils/renderWikiText';

export default function WikiLeisPage() {
  return (
    <article className="wiki-prose">
      <h1 className="wiki-h1">{WIKI_LEIS_TITLE}</h1>
      <p className="text-center text-[#54595d] text-sm font-narrative mb-2">{WIKI_LEIS_SUBTITLE}</p>

      <blockquote className="border-l-4 border-[#a2a9b1] pl-4 my-6 italic text-[#202122] font-narrative text-[0.95rem] leading-relaxed">
        {renderWikiText(WIKI_LEIS_EPIGRAPH)}
      </blockquote>

      {WIKI_LEIS_SECTIONS.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="wiki-h2">
            {section.emoji ? <span className="mr-1.5">{section.emoji}</span> : null}
            {section.title}
          </h2>
          <hr className="wiki-rule" />

          {section.items.map((item) => (
            <div key={item.id} className="mb-5">
              <p className="mb-1.5">
                <strong className="font-semibold text-black">
                  {item.id} — {item.title}
                </strong>
              </p>
              <p className="mb-2">{renderWikiText(item.body)}</p>
              {item.sublines?.length ? (
                <ul className="wiki-list-nested list-none pl-0 space-y-1.5 my-2">
                  {item.sublines.map((line, i) => (
                    <li key={i} className="pl-0 text-[#202122]">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.extraAfterSublines ? (
                <p className="mt-2 mb-0">{renderWikiText(item.extraAfterSublines)}</p>
              ) : null}
            </div>
          ))}
        </section>
      ))}

      <blockquote className="border-l-4 border-ancient-gold/50 pl-4 my-8 italic font-narrative text-[#202122]">
        “{WIKI_LEIS_CLOSING_QUOTE}”
      </blockquote>

      <section className="mt-10 pt-6 border-t border-[#eaecf0]">
        <h2 className="wiki-h2">{WIKI_LEIS_ACCEPTANCE.title}</h2>
        <hr className="wiki-rule" />
        {WIKI_LEIS_ACCEPTANCE.paragraphs.map((p, i) => (
          <p key={i}>{renderWikiText(p)}</p>
        ))}
        <p className="italic font-narrative mt-4">“{WIKI_LEIS_ACCEPTANCE.closing}”</p>
        <p className="mt-4 text-[#54595d] text-sm">{WIKI_LEIS_ACCEPTANCE.signoff}</p>
      </section>
    </article>
  );
}
