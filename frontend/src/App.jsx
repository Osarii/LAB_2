import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PanelGrupos from './pages/PanelGrupos';
import DetalleGrupo from './pages/DetalleGrupo';
import CrearGasto from './pages/CrearGasto';
import CrearGrupo from './pages/CrearGrupo';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Panel
      </Link>
      <Link to="/crear-grupo" className={location.pathname === '/crear-grupo' ? 'active' : ''}>
        + Nuevo Grupo
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<PanelGrupos />} />
        <Route path="/grupo/:grupo_id" element={<DetalleGrupo />} />
        <Route path="/crear-gasto/:grupo_id" element={<CrearGasto />} />
        <Route path="/crear-grupo" element={<CrearGrupo />} />
      </Routes>
    </Router>
  );
}
