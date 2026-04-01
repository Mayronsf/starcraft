import { Link } from 'react-router-dom';
import { renderWikiText } from '../../utils/renderWikiText';

const wikiLinkClass = 'text-[#3366cc] hover:underline underline-offset-2';

export default function WikiIndex() {
  return (
    <article className="wiki-prose">
      <h1 className="wiki-h1">Página principal</h1>

      <p className="mb-4">
        Bem-vindo à <strong>Wiki do StarCraft — A Gênese</strong>. Aqui ficam textos de apoio ao servidor:
        história oficial, linha do tempo e os <strong>Kingdoms</strong> (clãs) do mundo. Use os atalhos abaixo
        como na organização de wikis clássicas.
      </p>

      <p className="mb-4 text-[#54595d] text-xs sm:text-sm italic">
        Esta wiki não substitui o Discord nem as regras do jogo; é um arquivo público da narrativa e da
        estrutura do servidor.
      </p>

      <h2 className="wiki-h2">Páginas da Wiki:</h2>
      <hr className="wiki-rule" />

      <ul className="wiki-list">
        <li>
          <Link to="/wiki/starcraft" className={wikiLinkClass}>
            StarCraft — A Gênese
          </Link>
          <span className="text-[#54595d]"> — história do servidor e informações técnicas</span>
        </li>
        <li>
          <Link to="/wiki/linha-do-tempo" className={wikiLinkClass}>
            Linha do tempo
          </Link>
          <span className="text-[#54595d]"> — eventos por data</span>
        </li>
        <li>
          <Link to="/wiki/kingdoms" className={wikiLinkClass}>
            Kingdoms
          </Link>
          <span className="text-[#54595d]"> — clãs e facções do servidor</span>
        </li>
      </ul>

      <p className="mt-8 text-xs text-[#72777d] border-t border-[#eaecf0] pt-4">
        Jogadores e projetos de construção ficam de fora deste índice por enquanto, conforme o escopo atual.
      </p>

      <p className="mt-2 text-xs text-[#72777d]">
        {renderWikiText(
          'Para contribuir com correções ou novos artigos, use o **Discord** oficial do servidor.',
        )}
      </p>
    </article>
  );
}
