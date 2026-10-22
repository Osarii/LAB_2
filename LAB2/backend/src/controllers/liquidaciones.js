import pool from '../db.js';
import * as gastosService from '../services/gastos.js';

export async function crearLiquidacion(req, res) {
  try {
    const { grupo_id, de_persona, a_persona, monto, fecha } = req.body;

    if (!grupo_id || !de_persona || !a_persona || !monto || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (monto <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor que 0' });
    }

    if (de_persona === a_persona) {
      return res.status(400).json({ error: 'No se puede hacer una transferencia a la misma persona' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar que ambas personas existen y están en el grupo
      const personaCheck = await client.query(
        `SELECT COUNT(*) as count FROM grupo_personas
         WHERE grupo_id = $1 AND persona_id IN ($2, $3)`,
        [grupo_id, de_persona, a_persona]
      );

      if (personaCheck.rows[0].count < 2) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Una o ambas personas no están en el grupo' });
      }

      const result = await client.query(
        'INSERT INTO liquidaciones (grupo_id, de_persona, a_persona, monto, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING id, grupo_id, de_persona, a_persona, monto, fecha',
        [grupo_id, de_persona, a_persona, monto, fecha]
      );

      await client.query('COMMIT');
      res.status(201).json(result.rows[0]);
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

export async function obtenerLiquidacionesGrupo(req, res) {
  try {
    const { grupo_id } = req.params;

    const result = await pool.query(
      `SELECT l.id, l.grupo_id, l.de_persona, l.a_persona, l.monto, l.fecha,
              p1.nombre as de_persona_nombre, p2.nombre as a_persona_nombre
       FROM liquidaciones l
       LEFT JOIN personas p1 ON l.de_persona = p1.id
       LEFT JOIN personas p2 ON l.a_persona = p2.id
       WHERE l.grupo_id = $1
       ORDER BY l.fecha DESC`,
      [grupo_id]
    );

    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerLiquidacionesRecomendadas(req, res) {
  try {
    const { grupo_id } = req.params;

    const liquidaciones = await gastosService.calcularLiquidacionesMinimas(parseInt(grupo_id));

    const resultado = [];
    for (const liq of liquidaciones) {
      const p1 = await pool.query('SELECT nombre FROM personas WHERE id = $1', [liq.de_persona]);
      const p2 = await pool.query('SELECT nombre FROM personas WHERE id = $1', [liq.a_persona]);

      resultado.push({
        ...liq,
        de_persona_nombre: p1.rows[0]?.nombre,
        a_persona_nombre: p2.rows[0]?.nombre
      });
    }

    res.json(resultado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
