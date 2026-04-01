import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PluginsPage from './pages/PluginsPage';
import WikiLayout from './pages/wiki/WikiLayout';
import WikiIndex from './pages/wiki/WikiIndex';
import WikiTimelinePage from './pages/wiki/WikiTimelinePage';
import WikiKingdomsPage from './pages/wiki/WikiKingdomsPage';
import WikiLeisPage from './pages/wiki/WikiLeisPage';
import WikiGenesisLivroPage from './pages/wiki/WikiGenesisLivroPage';
import WikiGeneseLivrosIndex from './pages/wiki/WikiGeneseLivrosIndex';
import WikiLivroIIPage from './pages/wiki/WikiLivroIIPage';
import WikiLivroIIIPage from './pages/wiki/WikiLivroIIIPage';
import WikiLivroIVPage from './pages/wiki/WikiLivroIVPage';
import WikiLivroVPage from './pages/wiki/WikiLivroVPage';
import WikiCharacterSheetsPage from './pages/wiki/WikiCharacterSheetsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plugins" element={<PluginsPage />} />
      <Route path="/wiki" element={<WikiLayout />}>
        <Route index element={<WikiIndex />} />
        <Route path="genese" element={<WikiGenesisLivroPage />} />
        <Route path="genese-livros" element={<WikiGeneseLivrosIndex />} />
        <Route path="livro-ii" element={<WikiLivroIIPage />} />
        <Route path="livro-iii" element={<WikiLivroIIIPage />} />
        <Route path="livro-iv" element={<WikiLivroIVPage />} />
        <Route path="livro-v" element={<WikiLivroVPage />} />
        <Route path="linha-do-tempo" element={<WikiTimelinePage />} />
        <Route path="kingdoms" element={<WikiKingdomsPage />} />
        <Route path="fichas" element={<WikiCharacterSheetsPage />} />
        <Route path="leis" element={<WikiLeisPage />} />
      </Route>
    </Routes>
  );
}
