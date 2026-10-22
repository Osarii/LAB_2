import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/gastos.db');
const schemaPath = path.join(__dirname, '../../data/schema.sql');

// Crear carpeta data si no existe
if (!fs.existsSync(path.join(__dirname, '../../data'))) {
  fs.mkdirSync(path.join(__dirname, '../../data'), { recursive: true });
}

// Conectar o crear base de datos
const db = new Database(dbPath);
console.log(`✓ Base de datos: ${dbPath}`);

// Leer y ejecutar schema
const schema = fs.readFileSync(schemaPath, 'utf-8');

try {
  db.exec(schema);
  console.log('✓ Schema cargado exitosamente');

  // Verificar datos
  const personas = db.prepare('SELECT COUNT(*) as count FROM personas').get();
  const gastos = db.prepare('SELECT COUNT(*) as count FROM gastos').get();
  const grupos = db.prepare('SELECT COUNT(*) as count FROM grupos').get();

  console.log(`✓ Datos de ejemplo:`);
  console.log(`  - ${personas.count} personas`);
  console.log(`  - ${grupos.count} grupos`);
  console.log(`  - ${gastos.count} gastos`);

  db.close();
  console.log('✓ Base de datos lista para usar');
  process.exit(0);
} catch (e) {
  console.error('✗ Error al cargar schema:', e.message);
  process.exit(1);
}
