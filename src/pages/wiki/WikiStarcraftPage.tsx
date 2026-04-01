import { renderWikiText } from '../../utils/renderWikiText';
import { WIKI_STARCRAFT_INTRO, WIKI_STARCRAFT_SECTIONS } from '../../data/wikiStarcraft';

export default function WikiStarcraftPage() {
  return (
    <article className="wiki-prose">
      <h1 className="wiki-h1">StarCraft — A Gênese</h1>

      {WIKI_STARCRAFT_INTRO.map((p, i) => (
        <p key={i}>{renderWikiText(p)}</p>
      ))}

      {WIKI_STARCRAFT_SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="wiki-h2">{section.title}</h2>
          <hr className="wiki-rule" />
          {section.paragraphs.map((p, i) => (
            <p key={i}>{renderWikiText(p)}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
