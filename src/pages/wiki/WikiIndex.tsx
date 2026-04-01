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
          <Link to="/wiki/genese-livros" className={wikiLinkClass}>
            Crônicas (livros)
          </Link>
          <span className="text-[#54595d]">
            {' '}
            — índice dos Livros I a V (Gênese, Sementes, Mapa das Eras, Pergaminho, Sussurros)
          </span>
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
        <li>
          <Link to="/wiki/fichas" className={wikiLinkClass}>
            Fichas de personagens
          </Link>
          <span className="text-[#54595d]"> — cards de personagens e ficha expandida</span>
        </li>
        <li>
          <Link to="/wiki/leis" className={wikiLinkClass}>
            Leis do mundo
          </Link>
          <span className="text-[#54595d]"> — regras do Discord e do servidor</span>
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
