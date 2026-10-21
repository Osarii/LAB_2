import pool from '../db.js';

export async function crearPersona(req, res) {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO personas (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email',
      [nombre, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerPersonas(req, res) {
  try {
    const result = await pool.query('SELECT id, nombre, email FROM personas ORDER BY nombre');

    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerPersona(req, res) {
  try {
    const { persona_id } = req.params;

    const result = await pool.query(
      'SELECT id, nombre, email FROM personas WHERE id = $1',
      [persona_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
