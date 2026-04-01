import { WIKI_KINGDOMS, WIKI_KINGDOMS_INTRO } from '../../data/wikiKingdoms';
import { renderWikiText } from '../../utils/renderWikiText';

export default function WikiKingdomsPage() {
  const hasKingdoms = WIKI_KINGDOMS.length > 0;

  return (
    <article className="wiki-prose">
      <h1 className="wiki-h1">Kingdoms</h1>

      {WIKI_KINGDOMS_INTRO.map((p, i) => (
        <p key={i}>{renderWikiText(p)}</p>
      ))}

      {!hasKingdoms ? (
        <div className="rounded border border-dashed border-[#a2a9b1] bg-[#f8f9fa] px-4 py-6 mt-6">
          <p className="mb-0 text-[#54595d] italic">
            Nenhum kingdom listado. Edite <code className="text-xs bg-[#eaecf0] px-1 rounded">src/data/wikiKingdoms.ts</code> e adicione entradas em <strong>WIKI_KINGDOMS</strong>.
          </p>
        </div>
      ) : (
        <ul className="wiki-list mt-4">
          {WIKI_KINGDOMS.map((k) => (
            <li key={k.name}>
              <strong>{k.name}</strong>
              {k.description ? (
                <span className="text-[#54595d]">
                  {' '}
                  — {renderWikiText(k.description)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
