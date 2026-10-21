import app from './app.mjs';
import pool from './db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Verificar conexión a la BD
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Conectado a la base de datos:', result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`✓ Servidor escuchando en puerto ${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api`);
    });
  } catch (e) {
    console.error('✗ Error al conectar a la base de datos:', e.message);
    process.exit(1);
  }
}

start();
