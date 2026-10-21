-- Laboratorio #2: Control de gastos compartidos con liquidaciones
-- Caso 3 - Dificultad: Muy alta

CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grupos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grupo_personas (
  grupo_id INT REFERENCES grupos(id) ON DELETE CASCADE,
  persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
  PRIMARY KEY (grupo_id, persona_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de reparto: 'igual', 'porcentaje', 'exacto'
CREATE TABLE gastos (
  id SERIAL PRIMARY KEY,
  grupo_id INT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
  pagado_por INT NOT NULL REFERENCES personas(id),
  fecha DATE NOT NULL,
  tipo_reparto VARCHAR(20) NOT NULL CHECK (tipo_reparto IN ('igual', 'porcentaje', 'exacto')),
  categoria VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pagado_por) REFERENCES personas(id)
);

-- Participaciones: quién participa en cada gasto y cuánto le corresponde
CREATE TABLE participaciones (
  id SERIAL PRIMARY KEY,
  gasto_id INT NOT NULL REFERENCES gastos(id) ON DELETE CASCADE,
  persona_id INT NOT NULL REFERENCES personas(id),
  monto_asignado NUMERIC(10, 2) NOT NULL CHECK (monto_asignado >= 0),
  UNIQUE(gasto_id, persona_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Liquidaciones: pagos realizados para saldar deudas
CREATE TABLE liquidaciones (
  id SERIAL PRIMARY KEY,
  grupo_id INT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  de_persona INT NOT NULL REFERENCES personas(id),
  a_persona INT NOT NULL REFERENCES personas(id),
  monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas comunes
CREATE INDEX idx_grupo_personas_grupo ON grupo_personas(grupo_id);
CREATE INDEX idx_grupo_personas_persona ON grupo_personas(persona_id);
CREATE INDEX idx_gastos_grupo ON gastos(grupo_id);
CREATE INDEX idx_gastos_pagado_por ON gastos(pagado_por);
CREATE INDEX idx_participaciones_gasto ON participaciones(gasto_id);
CREATE INDEX idx_liquidaciones_grupo ON liquidaciones(grupo_id);

-- Datos de ejemplo
INSERT INTO personas (nombre, email) VALUES
  ('Ana García', 'ana@example.com'),
  ('Bruno López', 'bruno@example.com'),
  ('Carla Díaz', 'carla@example.com'),
  ('David Rojas', 'david@example.com');

INSERT INTO grupos (nombre) VALUES
  ('Piso San José'),
  ('Viaje a Limón');

INSERT INTO grupo_personas (grupo_id, persona_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3);

-- Ejemplo: Ana paga 30.000 por alquiler (dividido en 4 partes iguales)
INSERT INTO gastos (grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria)
VALUES (1, 'Alquiler mes octubre', 120000.00, 1, '2024-10-01', 'igual', 'alquiler');

INSERT INTO participaciones (gasto_id, persona_id, monto_asignado) VALUES
  (1, 1, 30000.00),
  (1, 2, 30000.00),
  (1, 3, 30000.00),
  (1, 4, 30000.00);

-- Ejemplo: Bruno paga comida en viaje (reparto desigual)
INSERT INTO gastos (grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria)
VALUES (2, 'Comida en Limón', 45000.00, 2, '2024-11-15', 'exacto', 'comida');

INSERT INTO participaciones (gasto_id, persona_id, monto_asignado) VALUES
  (2, 1, 15000.00),
  (2, 2, 15000.00),
  (2, 3, 15000.00);

-- Ejemplo de liquidación
INSERT INTO liquidaciones (grupo_id, de_persona, a_persona, monto, fecha)
VALUES (1, 2, 1, 30000.00, '2024-10-05');
