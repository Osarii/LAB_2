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

        <h3>Miembros ({miembrosSeleccionados.length})</h3>
        <div style={{ marginBottom: '15px' }}>
          {personas.map(p => (
            <label key={p.id} style={{ display: 'block', marginBottom: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={miembrosSeleccionados.includes(p.id)}
                onChange={() => handleToggleMiembro(p.id)}
                style={{ marginRight: '8px' }}
              />
              {p.nombre} ({p.email})
            </label>
          ))}
        </div>

        <button type="submit" className="btn btn-success">Crear Grupo</button>
      </form>
    </div>
  );
}
