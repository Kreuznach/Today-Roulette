import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { RoulettePage } from './pages/RoulettePage';
import { ResultPage } from './pages/ResultPage';
import { FinalResultPage } from './pages/FinalResultPage';
import { HistoryPage } from './pages/HistoryPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/roulette" element={<RoulettePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/final" element={<FinalResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
