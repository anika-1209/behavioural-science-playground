import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Primer } from './pages/Primer';
import { Hub } from './pages/Hub';
import { ModulePage } from './pages/ModulePage';
import { Settings } from './pages/Settings';
import { useProgress } from './lib/hooks';

// First visit → primer; returning visit → hub (Feature 1 acceptance criteria).
function Home() {
  const { seenPrimer } = useProgress();
  return <Navigate to={seenPrimer ? '/hub' : '/about'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Primer />} />
          <Route path="hub" element={<Hub />} />
          <Route path="play/:id" element={<ModulePage />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="*"
            element={
              <div className="card stack">
                <h1>Page not found</h1>
                <Link className="btn" to="/hub">Back to all experiments</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
