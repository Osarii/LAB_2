import { useState, useEffect } from 'react';
import * as api from '../services/api';
import './Components.css';

export default function ResumenGrupo({ grupo_id }) {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [personas, setPersonas] = useState({});

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const res = await api.obtenerResumen(grupo_id);
        setResumen(res);

        // Cargar nombres de personas
        const personasRes = await api.obtenerPersonas();
        const personasMap = {};
        personasRes.forEach(p => {
          personasMap[p.id] = p.nombre;
        });
        setPersonas(personasMap);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [grupo_id]);

  if (cargando) return <div className="loading">Cargando resumen...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!resumen) return <div>Sin datos</div>;

  return (
    <div className="resumen">
      <h2>Resumen del Grupo</h2>

      <div className="metricas">
        <div className="tarjeta-metrica">
          <div className="label">Total Gastado</div>
          <div className="valor">${resumen.totalGastado.toLocaleString()}</div>
        </div>
        <div className="tarjeta-metrica">
          <div className="label">Miembros</div>
          <div className="valor">{resumen.cantidadPersonas}</div>
        </div>
      </div>

      <div className="balances">
        <h3>Balances</h3>
        <ul>
          {Object.entries(resumen.balances).map(([pid, balance]) => (
            <li key={pid} className={`balance ${balance.balance > 0 ? 'positivo' : 'negativo'}`}>
              <strong>{personas[pid]}</strong>
              <span>${balance.balance.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="liquidaciones-minimas">
        <h3>Liquidaciones Sugeridas</h3>
        {resumen.liquidacionesMinimas.length === 0 ? (
          <p>Todo está saldado!</p>
        ) : (
          <ul>
            {resumen.liquidacionesMinimas.map((liq, idx) => (
              <li key={idx} className="liquidacion-sugerida">
                <strong>{personas[liq.de_persona]}</strong> paga{' '}
                <strong>${liq.monto.toLocaleString()}</strong> a{' '}
                <strong>{personas[liq.a_persona]}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
