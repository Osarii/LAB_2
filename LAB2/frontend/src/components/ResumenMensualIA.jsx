import { useState } from 'react';
import * as api from '../services/api';

const COLORES_CATEGORIA = {
  'alquiler': '#FF6B6B',
  'comida': '#4ECDC4',
  'transporte': '#FFE66D',
  'entretenimiento': '#95E1D3',
  'servicios': '#A8E6CF',
  'salud': '#FFD3B6',
  'educacion': '#FFAAA5',
  'compras': '#AA96DA',
  'otro': '#FCBAD3',
  'sin categoría': '#A8DADC'
};

export default function ResumenMensualIA({ grupo_id }) {
  const [cargando, setCargando] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);

  const generarResumen = async () => {
    setCargando(true);
    setError(null);
    setResumen(null);

    try {
      const res = await api.generarResumenMensual(grupo_id);
      if (res.ok) {
        setResumen(res.data);
      } else {
        setError(res.error || 'Error al generar resumen');
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setCargando(false);
    }
  };

  const getColorCategoria = (categoria) => COLORES_CATEGORIA[categoria] || '#A8DADC';

  const renderizarResumenVisual = () => {
    if (!resumen || !resumen.detallesPorCategoria) return null;

    const categorias = Object.entries(resumen.detallesPorCategoria);
    const maxMonto = Math.max(...categorias.map(([, monto]) => monto));

    return (
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Total */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Total del mes</div>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>
            ${resumen.totalMes.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.85em', opacity: 0.9 }}>{resumen.cantidadGastos} transacciones</div>
        </div>

        {/* Gráfico de barras */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Desglose por categoría</h4>
          {categorias.map(([categoria, monto]) => {
            const porcentaje = (monto / resumen.totalMes) * 100;
            const ancho = (monto / maxMonto) * 100;
            const color = getColorCategoria(categoria);

            return (
              <div key={categoria} style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                  fontSize: '0.95em'
                }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </span>
                  <span style={{ color: '#666' }}>
                    ${monto.toLocaleString('es-CR', { minimumFractionDigits: 2 })} ({porcentaje.toFixed(1)}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${ancho}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Texto original del resumen */}
        <div style={{
          background: '#f9f9f9',
          padding: '15px',
          borderRadius: '6px',
          fontSize: '0.9em',
          color: '#555',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          borderLeft: '4px solid #667eea'
        }}>
          {resumen.resumen}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: '0 2px 6px rgba(102, 126, 234, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Resumen Mensual con IA</h3>
      </div>

      <button
        onClick={generarResumen}
        disabled={cargando}
        className="btn btn-primary"
        style={{
          marginTop: '10px',
          background: cargando ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
        }}
        onMouseDown={(e) => !cargando && (e.target.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => !cargando && (e.target.style.transform = 'scale(1)')}
      >
        {cargando ? 'Analizando...' : 'Generar Resumen'}
      </button>

      {error && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          background: '#ffe6e6',
          color: '#d32f2f',
          borderRadius: '6px',
          border: '1px solid #ffcccc'
        }}>
          {error}
        </div>
      )}

      {resumen && renderizarResumenVisual()}
    </div>
  );
}
