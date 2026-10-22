import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import ErrorMsg from '../components/ErrorMsg';

export default function CrearGasto() {
  const { grupo_id } = useParams();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [form, setForm] = useState({
    descripcion: '',
    monto: '',
    pagado_por: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo_reparto: 'igual',
    categoria: '',
  });

  const [participaciones, setParticipaciones] = useState({});

  useEffect(() => {
    const cargar = async () => {
      try {
        const grupoRes = await api.obtenerGrupo(grupo_id);
        setGrupo(grupoRes);

        const personasRes = await api.obtenerPersonas();
        setPersonas(personasRes);

        // Inicializar participaciones
        const parts = {};
        grupoRes.miembros.forEach(m => {
          parts[m.id] = '';
        });
        setParticipaciones(parts);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [grupo_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipacion = (persona_id, valor) => {
    setParticipaciones(prev => ({
      ...prev,
      [persona_id]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validar
      if (!form.descripcion || !form.monto || !form.pagado_por) {
        setError('Completa todos los campos');
        return;
      }

      const monto = parseFloat(form.monto);
      if (monto <= 0) {
        setError('El monto debe ser mayor que 0');
        return;
      }

      // Validar participaciones
      const sumaParts = Object.values(participaciones)
        .reduce((a, b) => a + parseFloat(b || 0), 0);

      if (Math.abs(sumaParts - monto) > 0.01) {
        setError(`Suma de participaciones (${sumaParts}) no coincide con monto (${monto})`);
        return;
      }

      await api.crearGasto(
        parseInt(grupo_id),
        form.descripcion,
        monto,
        form.pagado_por,
        form.fecha,
        form.tipo_reparto,
        form.categoria,
        participaciones
      );

      navigate(`/grupo/${grupo_id}`);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  if (cargando) return <div className="contenedor loading">Cargando...</div>;
  if (!grupo) return <div className="contenedor">Grupo no encontrado</div>;

  return (
    <div className="contenedor">
      <h1>Crear Gasto - {grupo.nombre}</h1>
      <Link to={`/grupo/${grupo_id}`} className="btn btn-primary">← Volver</Link>

      <ErrorMsg error={error} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', marginTop: '20px' }}>
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Ej: Alquiler, Comida, etc"
            required
          />
        </div>

        <div className="form-group">
          <label>Monto</label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Pagado por</label>
          <select name="pagado_por" value={form.pagado_por} onChange={handleChange} required>
            <option value="">Seleccionar persona</option>
            {grupo.miembros.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de reparto</label>
          <select name="tipo_reparto" value={form.tipo_reparto} onChange={handleChange}>
            <option value="igual">Partes iguales</option>
            <option value="porcentaje">Porcentaje</option>
            <option value="exacto">Montos exactos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Ej: Alquiler, Comida, etc"
          />
        </div>

        <h3>Participaciones (suma debe ser ${form.monto || 0})</h3>
        {grupo.miembros.map(m => (
          <div className="form-group" key={m.id}>
            <label>{m.nombre}</label>
            <input
              type="number"
              value={participaciones[m.id] || ''}
              onChange={(e) => handleParticipacion(m.id, e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success">Crear Gasto</button>
      </form>
    </div>
  );
}
