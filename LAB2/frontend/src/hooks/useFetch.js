import { useState, useEffect } from 'react';

export function useFetch(fetchFunction, dependencies = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        setError(null);
        const resultado = await fetchFunction();
        setDatos(resultado);
      } catch (e) {
        setError(e.response?.data?.error || e.message);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, dependencies);

  return { datos, cargando, error, setDatos };
}
