import app from './app.mjs';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Verificar que la base de datos existe
    const dbPath = path.join(__dirname, '../../data/gastos.db');
    if (!fs.existsSync(dbPath)) {
      console.error('ERROR: Base de datos no encontrada');
      console.log('Ejecuta primero: npm run init-db');
      process.exit(1);
    }

    // Verificar conexión a la BD
    const result = await pool.query('SELECT COUNT(*) as count FROM personas');
    console.log('OK: Conectado a SQLite - Personas en BD:', result.rows[0].count);

    app.listen(PORT, () => {
      console.log(`OK: Servidor escuchando en puerto ${PORT}`);
      console.log(`OK: API disponible en http://localhost:${PORT}/api`);
      console.log(`OK: Endpoints disponibles:`);
      console.log(`     - GET http://localhost:${PORT}/api/personas`);
      console.log(`     - GET http://localhost:${PORT}/api/grupos`);
      console.log(`     - GET http://localhost:${PORT}/api/gastos/resumen/1`);
    });
  } catch (e) {
    console.error('ERROR: No se pudo conectar a la base de datos:', e.message);
    process.exit(1);
  }
}

start();
