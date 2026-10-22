-- Laboratorio #2: Control de gastos compartidos con liquidaciones
-- Caso 3 - Dificultad: Muy alta
-- SQLite version

CREATE TABLE IF NOT EXISTS personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupo_personas (
  grupo_id INTEGER NOT NULL,
  persona_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (grupo_id, persona_id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grupo_id INTEGER NOT NULL,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  pagado_por INTEGER NOT NULL,
  fecha DATE NOT NULL,
  tipo_reparto VARCHAR(20) NOT NULL CHECK (tipo_reparto IN ('igual', 'porcentaje', 'exacto')),
  categoria VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (pagado_por) REFERENCES personas(id)
);

CREATE TABLE IF NOT EXISTS participaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gasto_id INTEGER NOT NULL,
  persona_id INTEGER NOT NULL,
  monto_asignado DECIMAL(10, 2) NOT NULL CHECK (monto_asignado >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(gasto_id, persona_id),
  FOREIGN KEY (gasto_id) REFERENCES gastos(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES personas(id)
);

CREATE TABLE IF NOT EXISTS liquidaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grupo_id INTEGER NOT NULL,
  de_persona INTEGER NOT NULL,
  a_persona INTEGER NOT NULL,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (de_persona) REFERENCES personas(id),
  FOREIGN KEY (a_persona) REFERENCES personas(id)
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_grupo_personas_grupo ON grupo_personas(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupo_personas_persona ON grupo_personas(persona_id);
CREATE INDEX IF NOT EXISTS idx_gastos_grupo ON gastos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_gastos_pagado_por ON gastos(pagado_por);
CREATE INDEX IF NOT EXISTS idx_participaciones_gasto ON participaciones(gasto_id);
CREATE INDEX IF NOT EXISTS idx_liquidaciones_grupo ON liquidaciones(grupo_id);

-- Datos de ejemplo
INSERT OR IGNORE INTO personas (id, nombre, email) VALUES
  (1, 'Ana García', 'ana@example.com'),
  (2, 'Bruno López', 'bruno@example.com'),
  (3, 'Carla Díaz', 'carla@example.com'),
  (4, 'David Rojas', 'david@example.com');

INSERT OR IGNORE INTO grupos (id, nombre) VALUES
  (1, 'Piso San José'),
  (2, 'Viaje a Limón');

INSERT OR IGNORE INTO grupo_personas (grupo_id, persona_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3);

-- Ejemplo: Ana paga 120.000 por alquiler (dividido en 4 partes iguales)
INSERT OR IGNORE INTO gastos (id, grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria) VALUES
  (1, 1, 'Alquiler mes octubre', 120000.00, 1, '2024-10-01', 'igual', 'alquiler');

INSERT OR IGNORE INTO participaciones (id, gasto_id, persona_id, monto_asignado) VALUES
  (1, 1, 1, 30000.00),
  (2, 1, 2, 30000.00),
  (3, 1, 3, 30000.00),
  (4, 1, 4, 30000.00);

-- Ejemplo: Bruno paga comida en viaje (reparto desigual)
INSERT OR IGNORE INTO gastos (id, grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria) VALUES
  (2, 2, 'Comida en Limón', 45000.00, 2, '2024-11-15', 'exacto', 'comida');

INSERT OR IGNORE INTO participaciones (id, gasto_id, persona_id, monto_asignado) VALUES
  (5, 2, 1, 15000.00),
  (6, 2, 2, 15000.00),
  (7, 2, 3, 15000.00);

-- Ejemplo de liquidación
INSERT OR IGNORE INTO liquidaciones (id, grupo_id, de_persona, a_persona, monto, fecha) VALUES
  (1, 1, 2, 1, 30000.00, '2024-10-05');
