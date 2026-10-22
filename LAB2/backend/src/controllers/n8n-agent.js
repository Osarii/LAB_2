import pool from '../db.js';

// Categorías posibles
const CATEGORIAS = [
  'alquiler', 'comida', 'transporte', 'entretenimiento',
  'servicios', 'salud', 'educacion', 'compras', 'otro'
];

// AI Agent simulado - en producción usaría Claude directamente
export async function categorizarGasto(req, res) {
  try {
    const { descripcion } = req.body;

    if (!descripcion || !descripcion.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Descripción requerida'
      });
    }

    // Clasificación simple basada en palabras clave
    const desc = descripcion.toLowerCase();
    let categoria = 'otro';

    if (desc.includes('alquiler') || desc.includes('renta') || desc.includes('casa')) {
      categoria = 'alquiler';
    } else if (desc.includes('comida') || desc.includes('almuerzo') || desc.includes('cena') || desc.includes('café') || desc.includes('restaurante')) {
      categoria = 'comida';
    } else if (desc.includes('transporte') || desc.includes('taxi') || desc.includes('uber') || desc.includes('bus')) {
      categoria = 'transporte';
    } else if (desc.includes('cine') || desc.includes('película') || desc.includes('concierto') || desc.includes('diversión')) {
      categoria = 'entretenimiento';
    } else if (desc.includes('luz') || desc.includes('agua') || desc.includes('internet') || desc.includes('teléfono')) {
      categoria = 'servicios';
    } else if (desc.includes('doctor') || desc.includes('medicina') || desc.includes('farmacia') || desc.includes('hospital')) {
      categoria = 'salud';
    } else if (desc.includes('curso') || desc.includes('libro') || desc.includes('clase')) {
      categoria = 'educacion';
    } else if (desc.includes('compra') || desc.includes('tienda') || desc.includes('mercado')) {
      categoria = 'compras';
    }

    res.json({
      ok: true,
      data: {
        categoria,
        confianza: 0.85,
        descripcion
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      ok: false,
      error: e.message
    });
  }
}

// Generar resumen mensual del grupo
export async function generarResumenMensual(req, res) {
  try {
    const { grupo_id } = req.body;

    if (!grupo_id) {
      return res.status(400).json({
        ok: false,
        error: 'grupo_id requerido'
      });
    }

    // Obtener datos del grupo
    const grupoResult = await pool.query(
      'SELECT nombre FROM grupos WHERE id = $1',
      [grupo_id]
    );

    if (grupoResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Grupo no encontrado'
      });
    }

    const grupoNombre = grupoResult.rows[0].nombre;

    // Obtener gastos del mes actual
    const gastosResult = await pool.query(
      `SELECT g.*, p.nombre as pagado_por_nombre
       FROM gastos g
       LEFT JOIN personas p ON g.pagado_por = p.id
       WHERE g.grupo_id = $1
       AND strftime('%Y-%m', g.fecha) = strftime('%Y-%m', date('now'))
       ORDER BY g.fecha DESC`,
      [grupo_id]
    );

    // Calcular totales por categoría
    const totalesPorCategoria = {};
    let totalMes = 0;

    gastosResult.rows.forEach(gasto => {
      const cat = gasto.categoria || 'sin categoría';
      totalesPorCategoria[cat] = (totalesPorCategoria[cat] || 0) + parseFloat(gasto.monto);
      totalMes += parseFloat(gasto.monto);
    });

    // Generar resumen en lenguaje natural
    const resumenNatural = generarTextoResumen(grupoNombre, totalMes, totalesPorCategoria, gastosResult.rows);

    res.json({
      ok: true,
      data: {
        resumen: resumenNatural,
        totalMes: parseFloat(totalMes.toFixed(2)),
        cantidadGastos: gastosResult.rows.length,
        detallesPorCategoria: totalesPorCategoria
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      ok: false,
      error: e.message
    });
  }
}

function generarTextoResumen(grupoNombre, total, porCategoria, gastos) {
  let texto = `Resumen del mes - ${grupoNombre}\n\n`;
  texto += `Total gastado: $${total.toLocaleString()}\n`;
  texto += `Cantidad de gastos: ${gastos.length}\n\n`;

  texto += `Desglose por categoría:\n`;
  Object.entries(porCategoria).forEach(([cat, monto]) => {
    const porcentaje = ((monto / total) * 100).toFixed(1);
    texto += `• ${cat}: $${monto.toLocaleString()} (${porcentaje}%)\n`;
  });

  if (gastos.length > 0) {
    texto += `\nGastos principales:\n`;
    gastos.slice(0, 5).forEach(g => {
      texto += `• ${g.descripcion} ($${g.monto.toLocaleString()}) - ${g.pagado_por_nombre}\n`;
    });
  }

  return texto;
}
