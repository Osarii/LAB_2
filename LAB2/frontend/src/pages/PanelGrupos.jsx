import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import GruposList from '../components/GruposList';
import ErrorMsg from '../components/ErrorMsg';

export default function PanelGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.obtenerGrupos();
        setGrupos(res);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="contenedor">
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '30px',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{
          margin: '0 0 10px 0',
          color: '#ffffff',
          fontSize: '2.2em',
          fontWeight: 'bold'
        }}>Control de Gastos Compartidos</h1>
        <p style={{
          margin: 0,
          fontSize: '1.05em',
          color: '#ffffff'
        }}>Organiza tus gastos de grupo de forma fácil y transparente</p>
      </div>

      <ErrorMsg error={error} />
      <GruposList grupos={grupos} cargando={cargando} error={error} />
    </div>
  );
}
