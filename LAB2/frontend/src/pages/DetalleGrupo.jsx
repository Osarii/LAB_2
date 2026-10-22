import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import ResumenGrupo from '../components/ResumenGrupo';
import ResumenMensualIA from '../components/ResumenMensualIA';
import ErrorMsg from '../components/ErrorMsg';

export default function DetalleGrupo() {
  const { grupo_id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [personas, setPersonas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('fecha');

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const grupoRes = await api.obtenerGrupo(grupo_id);
        setGrupo(grupoRes);

        const gastosRes = await api.obtenerGastosGrupo(grupo_id);
        setGastos(gastosRes);

        const personasRes = await api.obtenerPersonas();
        const personasMap = {};
        personasRes.forEach(p => {
          personasMap[p.id] = p.nombre;
        });
        setPersonas(personasMap);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [grupo_id]);

  const gastosFiltrados = gastos.filter(g =>
    g.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const gastosOrdenados = [...gastosFiltrados].sort((a, b) => {
    if (orden === 'fecha') {
      return new Date(b.fecha) - new Date(a.fecha);
    } else if (orden === 'monto') {
      return b.monto - a.monto;
    }
    return 0;
  });

  const handleEliminar = async (gasto_id) => {
    if (confirm('¿Eliminar este gasto?')) {
      try {
        await api.eliminarGasto(gasto_id);
        setGastos(gastos.filter(g => g.id !== gasto_id));
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      }
    }
  };

  if (cargando) return <div className="contenedor loading">Cargando...</div>;
  if (error) return <div className="contenedor"><ErrorMsg error={error} /></div>;
  if (!grupo) return <div className="contenedor">Grupo no encontrado</div>;

  return (
    <div className="contenedor">
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: 'white' }}>{grupo.nombre}</h1>
          <p style={{ margin: 0, opacity: 0.95 }}>{grupo.miembros.length} miembros</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/" className="btn btn-primary">← Volver</Link>
          <Link to={`/crear-gasto/${grupo_id}`} className="btn btn-primary">+ Nuevo gasto</Link>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <h2>Miembros ({grupo.miembros.length})</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {grupo.miembros.map(m => (
              <li key={m.id} style={{ padding: '8px', background: '#f5f5f5', margin: '5px 0', borderRadius: '4px' }}>
                {m.nombre} ({m.email})
              </li>
            ))}
          </ul>
        </div>

        <ResumenGrupo grupo_id={grupo_id} />
      </div>

      <ResumenMensualIA grupo_id={grupo_id} />

      <h2>Gastos</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Buscar gasto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <select value={orden} onChange={(e) => setOrden(e.target.value)} style={{ padding: '8px' }}>
          <option value="fecha">Fecha (reciente)</option>
          <option value="monto">Monto (mayor)</option>
        </select>
      </div>

      {gastosOrdenados.length === 0 ? (
        <p>No hay gastos registrados.</p>
      ) : (
        <ul className="gastos-lista">
          {gastosOrdenados.map(gasto => (
            <li key={gasto.id} className="gasto-item">
              <div className="gasto-header">
                <div>
                  <div className="gasto-descripcion">{gasto.descripcion}</div>
                  <div className="gasto-por">Pagado por: {personas[gasto.pagado_por]}</div>
                  <div className="gasto-por">{gasto.fecha} | {gasto.tipo_reparto}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="gasto-monto">${gasto.monto.toLocaleString()}</div>
                  <button
                    onClick={() => handleEliminar(gasto.id)}
                    className="btn btn-danger"
                    style={{ marginTop: '5px', padding: '5px 10px', fontSize: '0.9em' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="gasto-participaciones">
                {gasto.participaciones.map((p, idx) => (
                  <div key={idx} className="participacion">
                    <span>{personas[p.persona_id]}</span>
                    <span>${p.monto_asignado.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
