import { Link } from 'react-router-dom';

const linkClass = 'text-[#3366cc] hover:underline underline-offset-2';

export default function WikiGeneseLivrosIndex() {
  return (
    <article className="wiki-prose">
      <nav className="text-xs text-[#54595d] mb-6 font-body">
        <Link to="/wiki" className={linkClass}>
          Página principal da Wiki
        </Link>
        <span className="mx-1.5">·</span>
        <span>Crônicas (livros)</span>
      </nav>

      <h1 className="wiki-h1">Crônicas (livros)</h1>
      <p className="mb-4">
        Textos oficiais do universo <strong>StarCraft — A Gênese</strong>, organizados como na série de livros do
        servidor.
      </p>
      <hr className="wiki-rule" />
      <ul className="wiki-list">
        <li>
          <Link to="/wiki/genese" className={linkClass}>
            Livro I — A Gênese de StarCraft
          </Link>
          <span className="text-[#54595d]"> — crônica dos primeiros dias</span>
        </li>
        <li>
          <Link to="/wiki/livro-ii" className={linkClass}>
            Livro II — As Sementes da Civilização
          </Link>
          <span className="text-[#54595d]"> — nascimento dos clãs (staff / condições narrativas)</span>
        </li>
        <li>
          <Link to="/wiki/livro-iii" className={linkClass}>
            Livro III — O Mapa das Eras
          </Link>
          <span className="text-[#54595d]"> — cronologia por eras</span>
        </li>
        <li>
          <Link to="/wiki/livro-iv" className={linkClass}>
            Livro IV — O Pergaminho do Aventureiro
          </Link>
          <span className="text-[#54595d]"> — guia in-world para jogadores</span>
        </li>
        <li>
          <Link to="/wiki/livro-v" className={linkClass}>
            Livro V — O Livro dos Sussurros
          </Link>
          <span className="text-[#54595d]"> — fragmentos e profecias para espalhar pelo mapa</span>
        </li>
      </ul>
    </article>
  );
}
