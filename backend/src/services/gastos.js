import pool from '../db.js';

export async function crearGasto(grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria, participaciones) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validar que la suma de participaciones coincida con el monto
    const totalParticipaciones = Object.values(participaciones).reduce((a, b) => a + b, 0);
    if (Math.abs(totalParticipaciones - monto) > 0.01) {
      throw new Error(`Suma de participaciones (${totalParticipaciones}) no coincide con monto (${monto})`);
    }

    // Insertar gasto
    const gastoResult = await client.query(
      'INSERT INTO gastos (grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria]
    );

    const gasto_id = gastoResult.rows[0].id;

    // Insertar participaciones
    for (const [persona_id, monto_asignado] of Object.entries(participaciones)) {
      await client.query(
        'INSERT INTO participaciones (gasto_id, persona_id, monto_asignado) VALUES ($1, $2, $3)',
        [gasto_id, parseInt(persona_id), monto_asignado]
      );
    }

    await client.query('COMMIT');
    return { id: gasto_id, ...{ grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria } };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function calcularBalance(grupo_id, persona_id) {
  // Dinero que pagó
  const pagadoResult = await pool.query(
    'SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE grupo_id = $1 AND pagado_por = $2',
    [grupo_id, persona_id]
  );
  const pagado = parseFloat(pagadoResult.rows[0].total);

  // Dinero que le corresponde pagar
  const debeResult = await pool.query(
    'SELECT COALESCE(SUM(monto_asignado), 0) as total FROM participaciones p INNER JOIN gastos g ON p.gasto_id = g.id WHERE g.grupo_id = $1 AND p.persona_id = $2',
    [grupo_id, persona_id]
  );
  const debe = parseFloat(debeResult.rows[0].total);

  // Liquidaciones recibidas (dinero que otros le pagaron)
  const recibidoResult = await pool.query(
    'SELECT COALESCE(SUM(monto), 0) as total FROM liquidaciones WHERE grupo_id = $1 AND a_persona = $2',
    [grupo_id, persona_id]
  );
  const recibido = parseFloat(recibidoResult.rows[0].total);

  // Liquidaciones pagadas (dinero que pagó para saldar)
  const pagadoLiqResult = await pool.query(
    'SELECT COALESCE(SUM(monto), 0) as total FROM liquidaciones WHERE grupo_id = $1 AND de_persona = $2',
    [grupo_id, persona_id]
  );
  const pagadoLiq = parseFloat(pagadoLiqResult.rows[0].total);

  // Balance final: pagó + recibió - debe - pagadoLiq
  const balance = pagado + recibido - debe - pagadoLiq;

  return {
    persona_id,
    pagado,
    debe,
    balance: parseFloat(balance.toFixed(2)),
    detalles: { recibido, pagadoLiq }
  };
}

export async function calcularLiquidacionesMinimas(grupo_id) {
  // Obtener todas las personas del grupo
  const personasResult = await pool.query(
    'SELECT DISTINCT persona_id FROM grupo_personas WHERE grupo_id = $1',
    [grupo_id]
  );

  const personas = personasResult.rows.map(r => r.persona_id);

  // Calcular balance para cada persona
  const balances = {};
  for (const persona_id of personas) {
    const balance = await calcularBalance(grupo_id, persona_id);
    balances[persona_id] = balance.balance;
  }

  // Algoritmo greedy: emparejar deudores con acreedores
  const liquidaciones = [];
  const deudores = Object.entries(balances)
    .filter(([_, b]) => b < -0.01)
    .map(([p, b]) => ({ id: parseInt(p), monto: -b }))
    .sort((a, b) => b.monto - a.monto);

  const acreedores = Object.entries(balances)
    .filter(([_, b]) => b > 0.01)
    .map(([p, b]) => ({ id: parseInt(p), monto: b }))
    .sort((a, b) => b.monto - a.monto);

  let d = 0, a = 0;
  while (d < deudores.length && a < acreedores.length) {
    const deuda = deudores[d];
    const acreedor = acreedores[a];

    const pagar = Math.min(deuda.monto, acreedor.monto);

    liquidaciones.push({
      de_persona: deuda.id,
      a_persona: acreedor.id,
      monto: parseFloat(pagar.toFixed(2))
    });

    deuda.monto -= pagar;
    acreedor.monto -= pagar;

    if (deuda.monto < 0.01) d++;
    if (acreedor.monto < 0.01) a++;
  }

  return liquidaciones;
}

export async function obtenerGastosGrupo(grupo_id) {
  const gastos = await pool.query(
    'SELECT id, grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria, created_at FROM gastos WHERE grupo_id = $1 ORDER BY fecha DESC',
    [grupo_id]
  );

  // Agregar nombre de quien pagó y participaciones
  for (const gasto of gastos.rows) {
    const personaResult = await pool.query(
      'SELECT nombre FROM personas WHERE id = $1',
      [gasto.pagado_por]
    );
    gasto.pagado_por_nombre = personaResult.rows[0]?.nombre || 'Desconocido';

    const partsResult = await pool.query(
      'SELECT persona_id, monto_asignado FROM participaciones WHERE gasto_id = $1',
      [gasto.id]
    );
    gasto.participaciones = partsResult.rows;
  }

  return gastos.rows;
}

export async function obtenerResumen(grupo_id) {
  // Balances de todas las personas
  const personasResult = await pool.query(
    'SELECT DISTINCT persona_id FROM grupo_personas WHERE grupo_id = $1',
    [grupo_id]
  );

  const personas = personasResult.rows.map(r => r.persona_id);

  const balances = {};
  for (const persona_id of personas) {
    const balance = await calcularBalance(grupo_id, persona_id);
    balances[persona_id] = balance;
  }

  // Total gastado
  const totalResult = await pool.query(
    'SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE grupo_id = $1',
    [grupo_id]
  );

  const liquidacionesMinimas = await calcularLiquidacionesMinimas(grupo_id);

  return {
    grupo_id,
    balances,
    totalGastado: parseFloat(totalResult.rows[0].total),
    liquidacionesMinimas,
    cantidadPersonas: personas.length
  };
}
