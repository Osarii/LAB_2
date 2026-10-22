import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/gastos.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Convertir placeholders de PostgreSQL a SQLite
function convertSql(sql) {
  let index = 1;
  return sql.replace(/\$(\d+)/g, '?');
}

// Adapter para que las funciones del código funcionen igual
class DatabaseAdapter {
  async query(sql, params = []) {
    try {
      const convertedSql = convertSql(sql);

      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = db.prepare(convertedSql);
        const rows = stmt.all(...params);
        return { rows };
      } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const stmt = db.prepare(convertedSql);
        const info = stmt.run(...params);

        // Para INSERT ... RETURNING, obtener el último ID insertado
        if (sql.includes('RETURNING')) {
          // Asumir que queremos retornar el id
          const lastId = info.lastInsertRowid;
          return {
            rows: [{ id: lastId }],
            info
          };
        }

        return { rows: [], info };
      } else if (sql.trim().toUpperCase().startsWith('UPDATE') ||
                 sql.trim().toUpperCase().startsWith('DELETE')) {
        const stmt = db.prepare(convertedSql);
        const info = stmt.run(...params);
        return { rows: [], info };
      } else if (sql.trim().toUpperCase().startsWith('BEGIN') ||
                 sql.trim().toUpperCase().startsWith('COMMIT') ||
                 sql.trim().toUpperCase().startsWith('ROLLBACK')) {
        db.exec(convertedSql);
        return { rows: [] };
      }
    } catch (e) {
      console.error('Error de BD:', sql, params, e);
      throw e;
    }
  }

  async connect() {
    return this;
  }

  release() {
    // No-op para SQLite
  }
}

class DatabasePool {
  async query(sql, params = []) {
    const adapter = new DatabaseAdapter();
    return adapter.query(sql, params);
  }

  async connect() {
    return new DatabaseAdapter();
  }
}

export default new DatabasePool();
