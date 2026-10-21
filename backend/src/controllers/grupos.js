import pool from '../db.js';

export async function crearGrupo(req, res) {
  try {
    const { nombre, miembros } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre del grupo requerido' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const grupoResult = await client.query(
        'INSERT INTO grupos (nombre) VALUES ($1) RETURNING id, nombre',
        [nombre]
      );

      const grupo_id = grupoResult.rows[0].id;

      // Añadir miembros si se proporcionan
      if (miembros && Array.isArray(miembros)) {
        for (const persona_id of miembros) {
          await client.query(
            'INSERT INTO grupo_personas (grupo_id, persona_id) VALUES ($1, $2)',
            [grupo_id, persona_id]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        id: grupo_id,
        nombre,
        miembros: miembros || []
      });
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

export async function obtenerGrupos(req, res) {
  try {
    const result = await pool.query(
      `SELECT g.id, g.nombre, COUNT(gp.persona_id) as cantidad_miembros
       FROM grupos g
       LEFT JOIN grupo_personas gp ON g.id = gp.grupo_id
       GROUP BY g.id, g.nombre
       ORDER BY g.nombre`
    );

    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerGrupo(req, res) {
  try {
    const { grupo_id } = req.params;

    const grupoResult = await pool.query(
      'SELECT id, nombre FROM grupos WHERE id = $1',
      [grupo_id]
    );

    if (grupoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }

    const miembrosResult = await pool.query(
      `SELECT p.id, p.nombre, p.email FROM personas p
       INNER JOIN grupo_personas gp ON p.id = gp.persona_id
       WHERE gp.grupo_id = $1
       ORDER BY p.nombre`,
      [grupo_id]
    );

    res.json({
      ...grupoResult.rows[0],
      miembros: miembrosResult.rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function agregarMiembro(req, res) {
  try {
    const { grupo_id, persona_id } = req.params;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar que el grupo existe
      const grupoCheck = await client.query('SELECT id FROM grupos WHERE id = $1', [grupo_id]);
      if (grupoCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }

      // Verificar que la persona existe
      const personaCheck = await client.query('SELECT id FROM personas WHERE id = $1', [persona_id]);
      if (personaCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      // Agregar a grupo
      await client.query(
        'INSERT INTO grupo_personas (grupo_id, persona_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [grupo_id, persona_id]
      );

      await client.query('COMMIT');
      res.json({ ok: true });
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

export async function quitarMiembro(req, res) {
  try {
    const { grupo_id, persona_id } = req.params;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar balance
      const balanceResult = await client.query(
        `SELECT (
          COALESCE((SELECT SUM(monto) FROM gastos WHERE grupo_id = $1 AND pagado_por = $2), 0) +
          COALESCE((SELECT SUM(monto) FROM liquidaciones WHERE grupo_id = $1 AND a_persona = $2), 0) -
          COALESCE((SELECT SUM(monto_asignado) FROM participaciones p INNER JOIN gastos g ON p.gasto_id = g.id WHERE g.grupo_id = $1 AND p.persona_id = $2), 0) -
          COALESCE((SELECT SUM(monto) FROM liquidaciones WHERE grupo_id = $1 AND de_persona = $2), 0)
        ) as balance`,
        [grupo_id, persona_id]
      );

      const balance = parseFloat(balanceResult.rows[0].balance);

      if (Math.abs(balance) > 0.01) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: `No se puede remover: balance pendiente de ${balance}` });
      }

      const result = await client.query(
        'DELETE FROM grupo_personas WHERE grupo_id = $1 AND persona_id = $2',
        [grupo_id, persona_id]
      );

      await client.query('COMMIT');

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Miembro no encontrado en este grupo' });
      }

      res.json({ ok: true });
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
