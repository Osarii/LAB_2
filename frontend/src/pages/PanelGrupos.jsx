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
      <h1>Control de Gastos Compartidos</h1>
      <ErrorMsg error={error} />
      <GruposList grupos={grupos} cargando={cargando} error={error} />
    </div>
  );
}
