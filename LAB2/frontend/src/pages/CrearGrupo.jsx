import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import ErrorMsg from '../components/ErrorMsg';

export default function CrearGrupo() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [personas, setPersonas] = useState([]);
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.obtenerPersonas();
        setPersonas(res);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const handleToggleMiembro = (persona_id) => {
    setMiembrosSeleccionados(prev =>
      prev.includes(persona_id)
        ? prev.filter(id => id !== persona_id)
        : [...prev, persona_id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!nombre.trim()) {
        setError('El nombre del grupo es requerido');
        return;
      }

      if (miembrosSeleccionados.length === 0) {
        setError('Selecciona al menos un miembro');
        return;
      }

      await api.crearGrupo(nombre, miembrosSeleccionados);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  if (cargando) return <div className="contenedor loading">Cargando...</div>;

  return (
    <div className="contenedor">
      <h1>Crear Nuevo Grupo</h1>
      <Link to="/" className="btn btn-primary">← Volver</Link>

      <ErrorMsg error={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', marginTop: '20px' }}>
        <div className="form-group">
          <label>Nombre del grupo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Piso San José"
            required
          />
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '25px',
          marginBottom: '25px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#667eea' }}>
            Miembros del grupo ({miembrosSeleccionados.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {personas.map(p => (
              <label
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: miembrosSeleccionados.includes(p.id)
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                    : 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: miembrosSeleccionados.includes(p.id)
                    ? '2px solid #667eea'
                    : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={miembrosSeleccionados.includes(p.id)}
                  onChange={() => handleToggleMiembro(p.id)}
                  style={{
                    marginRight: '12px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#667eea'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#333' }}>{p.nombre}</div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>{p.email}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '12px 20px', fontSize: '1.05em' }}>
          Crear Grupo
        </button>
      </form>
    </div>
  );
}
