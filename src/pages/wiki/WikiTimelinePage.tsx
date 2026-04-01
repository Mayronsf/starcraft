import type { WikiTimelineLine } from '../../data/wikiTimeline';
import { WIKI_TIMELINE_INTRO, WIKI_TIMELINE_YEARS } from '../../data/wikiTimeline';
import { renderWikiText } from '../../utils/renderWikiText';

function TimelineLines({ lines }: { lines: WikiTimelineLine[] }) {
  return (
    <ul className="wiki-list-nested mt-1">
      {lines.map((line, i) => (
        <li key={i}>
          {renderWikiText(line.text)}
          {line.sublines?.length ? <TimelineLines lines={line.sublines} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function WikiTimelinePage() {
  const hasYears = WIKI_TIMELINE_YEARS.length > 0;

  return (
    <article className="wiki-prose">
      <h1 className="wiki-h1">Linha do tempo</h1>

      {WIKI_TIMELINE_INTRO.map((p, i) => (
        <p key={i}>{renderWikiText(p)}</p>
      ))}

      {!hasYears ? (
        <div className="rounded border border-dashed border-[#a2a9b1] bg-[#f8f9fa] px-4 py-6 mt-6">
          <p className="mb-0 text-[#54595d] italic">
            Nenhum ano cadastrado ainda. Edite <code className="text-xs bg-[#eaecf0] px-1 rounded">src/data/wikiTimeline.ts</code> e preencha <strong>WIKI_TIMELINE_YEARS</strong> com meses e eventos (incluindo listas aninhadas).
          </p>
        </div>
      ) : (
        WIKI_TIMELINE_YEARS.map((y) => (
          <section key={y.year} className="mt-8">
            <h2 className="wiki-h2">{y.year}</h2>
            <hr className="wiki-rule" />
            <ul className="wiki-list">
              {y.months.map((m) => (
                <li key={m.label}>
                  <strong>{m.label}</strong>
                  {m.lines.length > 0 ? <TimelineLines lines={m.lines} /> : null}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </article>
  );
}
