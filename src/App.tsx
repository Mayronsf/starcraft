import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PluginsPage from './pages/PluginsPage';
import WikiLayout from './pages/wiki/WikiLayout';
import WikiIndex from './pages/wiki/WikiIndex';
import WikiStarcraftPage from './pages/wiki/WikiStarcraftPage';
import WikiTimelinePage from './pages/wiki/WikiTimelinePage';
import WikiKingdomsPage from './pages/wiki/WikiKingdomsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plugins" element={<PluginsPage />} />
      <Route path="/wiki" element={<WikiLayout />}>
        <Route index element={<WikiIndex />} />
        <Route path="starcraft" element={<WikiStarcraftPage />} />
        <Route path="linha-do-tempo" element={<WikiTimelinePage />} />
        <Route path="kingdoms" element={<WikiKingdomsPage />} />
      </Route>
    </Routes>
  );
}
