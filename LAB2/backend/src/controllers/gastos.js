import * as gastosService from '../services/gastos.js';
import pool from '../db.js';

export async function crearGasto(req, res) {
  try {
    const { grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria, participaciones } = req.body;

    if (!grupo_id || !descripcion || !monto || !pagado_por || !fecha || !tipo_reparto || !participaciones) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (monto <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor que 0' });
    }

    const gasto = await gastosService.crearGasto(grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria, participaciones);

    res.status(201).json(gasto);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}

export async function obtenerGastosGrupo(req, res) {
  try {
    const { grupo_id } = req.params;

    const gastos = await gastosService.obtenerGastosGrupo(parseInt(grupo_id));

    res.json(gastos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function eliminarGasto(req, res) {
  try {
    const { gasto_id } = req.params;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM participaciones WHERE gasto_id = $1', [gasto_id]);
      const result = await client.query('DELETE FROM gastos WHERE id = $1 RETURNING id', [gasto_id]);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }

      await client.query('COMMIT');
      res.json({ ok: true, id: gasto_id });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerBalance(req, res) {
  try {
    const { grupo_id, persona_id } = req.params;

    const balance = await gastosService.calcularBalance(parseInt(grupo_id), parseInt(persona_id));

    res.json(balance);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerResumen(req, res) {
  try {
    const { grupo_id } = req.params;

    const resumen = await gastosService.obtenerResumen(parseInt(grupo_id));

    res.json(resumen);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
