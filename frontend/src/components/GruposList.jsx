import { Link } from 'react-router-dom';
import './Components.css';

export default function GruposList({ grupos, cargando, error }) {
  if (cargando) return <div className="loading">Cargando grupos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="lista">
      <h2>Grupos</h2>
      {!grupos || grupos.length === 0 ? (
        <p>No hay grupos. Crea uno nuevo.</p>
      ) : (
        <ul className="items">
          {grupos.map(grupo => (
            <li key={grupo.id} className="item">
              <Link to={`/grupo/${grupo.id}`} className="item-link">
                <strong>{grupo.nombre}</strong>
                <span className="miembros">{grupo.cantidad_miembros} miembros</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/crear-grupo" className="btn btn-primary">
        + Crear grupo
      </Link>
    </div>
  );
}
