-- ============================================================
-- TRABAJO DE EXTENSION - BASE DE DATOS RELACIONAL
-- Caso de uso: Tienda en Linea (E-commerce)
-- Autor: Usuario
-- Fecha: Octubre 2026
-- SGBD: MySQL / MariaDB / PostgreSQL compatible
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

-- ============================================================
-- TABLA 1: CLIENTE (Entidad padre, lado uno de 1:N)
-- Relacion 1:N con Pedido
-- ============================================================
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'Costa Rica',
    fecha_registro DATE NOT NULL,
    estado VARCHAR(15) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Suspendido')),
    credito_disponible DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (credito_disponible >= 0)
);

-- ============================================================
-- TABLA 2: CATEGORIA (Entidad padre, lado uno de 1:N)
-- Relacion 1:N con Producto
-- ============================================================
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABLA 3: PROVEEDOR (Entidad padre, lado uno de 1:N)
-- Relacion 1:N con Producto
-- ============================================================
CREATE TABLE proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL UNIQUE,
    contacto VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'Costa Rica',
    fecha_vinculacion DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABLA 4: PRODUCTO (Entidad hija de CATEGORIA y PROVEEDOR)
-- Relacion 1:N hacia Detalle_Pedido
-- ============================================================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precio DECIMAL(8,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    fecha_agregado DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

-- ============================================================
-- TABLA 5: PEDIDO (Entidad hija de CLIENTE)
-- Relacion 1:N hacia Detalle_Pedido, Pago, Envio
-- ============================================================
CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado')),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    impuesto DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (impuesto >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total > 0),
    observaciones VARCHAR(300),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE RESTRICT
);

-- ============================================================
-- TABLA 6: DETALLE_PEDIDO (Tabla intermedia para relacion N:M)
-- Conecta PEDIDO y PRODUCTO
-- Relacion N:M entre Pedido y Producto
-- ============================================================
CREATE TABLE detalle_pedido (
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(8,2) NOT NULL CHECK (precio_unitario > 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal > 0),
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE RESTRICT
);

-- ============================================================
-- TABLA 7: PAGO (Entidad hija de PEDIDO)
-- Relacion 1:N con Pedido (un pedido puede tener multiples pagos parciales)
-- ============================================================
CREATE TABLE pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    metodo_pago VARCHAR(30) NOT NULL DEFAULT 'Tarjeta' CHECK (metodo_pago IN ('Tarjeta', 'Transferencia', 'Efectivo', 'Cheque')),
    fecha_pago DATE NOT NULL,
    referencia_transaccion VARCHAR(100),
    estado VARCHAR(15) NOT NULL DEFAULT 'Completado' CHECK (estado IN ('Completado', 'Pendiente', 'Rechazado')),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE
);

-- ============================================================
-- TABLA 8: ENVIO (Entidad hija de PEDIDO)
-- Relacion 1:1 con Pedido (cada pedido tiene un envio)
-- ============================================================
CREATE TABLE envio (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL UNIQUE,
    transportista VARCHAR(80) NOT NULL,
    numero_seguimiento VARCHAR(100) NOT NULL UNIQUE,
    fecha_envio DATE NOT NULL,
    fecha_entrega_estimada DATE NOT NULL,
    fecha_entrega_real DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En transito', 'Entregado', 'Devuelto')),
    costo_envio DECIMAL(8,2) NOT NULL DEFAULT 0.00 CHECK (costo_envio >= 0),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE
);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA CLIENTE (10 registros)
-- ============================================================
INSERT INTO cliente (nombre, email, telefono, direccion, ciudad, pais, fecha_registro, estado, credito_disponible)
VALUES
    ('Juan Perez', 'juan@email.com', '2222-1111', 'Calle Principal 123', 'San Jose', 'Costa Rica', '2026-01-15', 'Activo', 5000.00),
    ('Maria Garcia', 'maria@email.com', '2222-2222', 'Avenida Central 456', 'San Jose', 'Costa Rica', '2026-02-20', 'Activo', 3000.00),
    ('Carlos Rodriguez', 'carlos@email.com', '2222-3333', 'Calle Secundaria 789', 'Alajuela', 'Costa Rica', '2026-03-10', 'Activo', 7500.00),
    ('Ana Martinez', 'ana@email.com', '2222-4444', 'Paseo del Bosque 321', 'Cartago', 'Costa Rica', '2026-04-05', 'Activo', 2000.00),
    ('Luis Gonzalez', 'luis@email.com', '2222-5555', 'Calle Del Comercio 654', 'San Jose', 'Costa Rica', '2026-05-12', 'Activo', 4500.00),
    ('Sofia Ramirez', 'sofia@email.com', '2222-6666', 'Avenida Occidente 987', 'Heredia', 'Costa Rica', '2026-06-08', 'Inactivo', 0.00),
    ('Diego Fernandez', 'diego@email.com', '2222-7777', 'Calle Este 147', 'Limon', 'Costa Rica', '2026-07-14', 'Activo', 6000.00),
    ('Elena Vargas', 'elena@email.com', '2222-8888', 'Paseo Norte 258', 'Puntarenas', 'Costa Rica', '2026-08-20', 'Activo', 3500.00),
    ('Ricardo Ortiz', 'ricardo@email.com', '2222-9999', 'Calle Sur 369', 'San Jose', 'Costa Rica', '2026-09-03', 'Suspendido', 0.00),
    ('Valentina Lopez', 'valentina@email.com', '2222-0000', 'Avenida Principal 111', 'San Jose', 'Costa Rica', '2026-09-25', 'Activo', 8000.00);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA CATEGORIA (8 registros)
-- ============================================================
INSERT INTO categoria (nombre, descripcion, activa)
VALUES
    ('Electronica', 'Dispositivos electronicos y computadoras', TRUE),
    ('Ropa', 'Prendas de vestir para hombres y mujeres', TRUE),
    ('Libros', 'Libros de diferentes generos y autores', TRUE),
    ('Deportes', 'Articulos y equipos deportivos', TRUE),
    ('Hogar', 'Articulos para el hogar y decoracion', TRUE),
    ('Alimentos', 'Productos alimentarios frescos y procesados', TRUE),
    ('Juguetes', 'Juguetes para ninos de diferentes edades', TRUE),
    ('Belleza', 'Productos de cosmetica y cuidado personal', FALSE);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA PROVEEDOR (6 registros)
-- ============================================================
INSERT INTO proveedor (nombre_empresa, contacto, email, telefono, pais, fecha_vinculacion, activo)
VALUES
    ('TechGlobal S.A.', 'Roberto Chen', 'tech@global.com', '2333-1111', 'Costa Rica', '2025-01-10', TRUE),
    ('Fashion World Inc.', 'Patricia Molina', 'fashion@world.com', '2333-2222', 'Mexico', '2025-03-15', TRUE),
    ('Editorial Latinoamericana', 'Marco Reyes', 'editorial@latin.com', '2333-3333', 'Colombia', '2025-05-20', TRUE),
    ('SportEquip Ltd.', 'Angela Gutierrez', 'sport@equip.com', '2333-4444', 'Costa Rica', '2025-07-08', TRUE),
    ('Home Decor Distributors', 'Oscar Vega', 'homedecor@dist.com', '2333-5555', 'Guatemala', '2025-08-12', TRUE),
    ('Organic Foods Co.', 'Laura Jimenez', 'organic@foods.com', '2333-6666', 'Costa Rica', '2025-09-30', FALSE);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA PRODUCTO (15 registros)
-- ============================================================
INSERT INTO producto (nombre, descripcion, precio, stock, id_categoria, id_proveedor, fecha_agregado, activo)
VALUES
    ('Laptop ASUS 15', 'Laptop de 15 pulgadas, procesador Intel i7', 850.00, 25, 1, 1, '2026-01-05', TRUE),
    ('Mouse Logitech', 'Mouse inalambrico de precision', 35.00, 150, 1, 1, '2026-01-10', TRUE),
    ('Camiseta Basica Azul', 'Camiseta de algodon puro, ajuste regular', 22.00, 200, 2, 2, '2026-01-15', TRUE),
    ('Pantalon Denim Negro', 'Pantalon de denim oscuro, corte moderno', 48.00, 120, 2, 2, '2026-01-20', TRUE),
    ('El Quijote - Cervantes', 'Novela clasica de la literatura espanola', 18.00, 75, 3, 3, '2026-02-01', TRUE),
    ('Cien Anos de Soledad', 'Novela de Gabriel Garcia Marquez', 16.00, 60, 3, 3, '2026-02-05', TRUE),
    ('Pelota de Futbol', 'Balon profesional FIFA', 45.00, 100, 4, 4, '2026-02-10', TRUE),
    ('Zapatos Deportivos', 'Zapatillas para correr, comodidad premium', 120.00, 80, 4, 4, '2026-02-15', TRUE),
    ('Almohada Memory Foam', 'Almohada ergonomica con espuma viscoelastica', 55.00, 60, 5, 5, '2026-03-01', TRUE),
    ('Juego de Sabanas', 'Sabanas de algodon 100%, 4 piezas', 38.00, 90, 5, 5, '2026-03-05', TRUE),
    ('Crema Facial Hidratante', 'Crema diaria para piel seca', 28.00, 110, 8, 6, '2026-03-10', TRUE),
    ('Teclado Mecanico RGB', 'Teclado gaming con luces RGB programables', 95.00, 45, 1, 1, '2026-03-15', TRUE),
    ('Monitor LG 27 pulgadas', 'Monitor 4K de alta resolucion', 320.00, 20, 1, 1, '2026-03-20', TRUE),
    ('Sudadera Deportiva', 'Sudadera tecnologica para ejercicio', 65.00, 140, 2, 2, '2026-03-25', TRUE),
    ('Set de Herramientas', 'Set basico de 50 herramientas', 75.00, 35, 5, 5, '2026-04-01', TRUE);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA PEDIDO (12 registros)
-- ============================================================
INSERT INTO pedido (id_cliente, fecha_pedido, estado, subtotal, impuesto, total, observaciones)
VALUES
    (1, '2026-09-01 10:30:00', 'Entregado', 350.00, 52.50, 402.50, 'Entrega exitosa'),
    (1, '2026-09-15 14:20:00', 'Entregado', 145.00, 21.75, 166.75, 'Sin incidentes'),
    (2, '2026-09-05 09:15:00', 'Entregado', 750.00, 112.50, 862.50, 'Cliente satisfecho'),
    (3, '2026-09-10 16:45:00', 'Enviado', 180.00, 27.00, 207.00, 'En transito'),
    (4, '2026-09-18 11:00:00', 'Procesando', 95.00, 14.25, 109.25, 'Preparandose para envio'),
    (5, '2026-09-20 13:30:00', 'Entregado', 425.00, 63.75, 488.75, 'Entrega sin problemas'),
    (6, '2026-09-12 08:45:00', 'Cancelado', 200.00, 30.00, 230.00, 'Cliente solicito cancelacion'),
    (7, '2026-09-22 15:20:00', 'Pendiente', 520.00, 78.00, 598.00, 'Aguardando confirmacion de pago'),
    (8, '2026-09-25 10:00:00', 'Procesando', 310.00, 46.50, 356.50, 'En proceso de embalaje'),
    (9, '2026-09-03 12:30:00', 'Cancelado', 150.00, 22.50, 172.50, 'Sin motivo especificado'),
    (10, '2026-09-28 09:30:00', 'Entregado', 880.00, 132.00, 1012.00, 'Gran compra, satisfecho cliente'),
    (1, '2026-09-29 14:15:00', 'Pendiente', 240.00, 36.00, 276.00, 'Esperando pago');

-- ============================================================
-- INSERCIONES DE DATOS - TABLA DETALLE_PEDIDO (15 registros)
-- N:M entre PEDIDO y PRODUCTO
-- ============================================================
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
VALUES
    (1, 1, 1, 850.00, 850.00),
    (2, 2, 3, 35.00, 105.00),
    (2, 3, 2, 22.00, 44.00),
    (3, 4, 5, 48.00, 240.00),
    (3, 5, 2, 18.00, 36.00),
    (4, 6, 3, 16.00, 48.00),
    (4, 7, 2, 45.00, 90.00),
    (5, 8, 1, 120.00, 120.00),
    (5, 9, 1, 55.00, 55.00),
    (6, 10, 2, 38.00, 76.00),
    (6, 11, 5, 28.00, 140.00),
    (8, 12, 1, 95.00, 95.00),
    (8, 13, 2, 320.00, 640.00),
    (10, 14, 3, 65.00, 195.00),
    (11, 15, 4, 75.00, 300.00);

-- ============================================================
-- INSERCIONES DE DATOS - TABLA PAGO (15 registros)
-- ============================================================
INSERT INTO pago (id_pedido, monto, metodo_pago, fecha_pago, referencia_transaccion, estado)
VALUES
    (1, 402.50, 'Tarjeta', '2026-09-01', 'TXN-001-2026', 'Completado'),
    (2, 166.75, 'Tarjeta', '2026-09-15', 'TXN-002-2026', 'Completado'),
    (3, 862.50, 'Transferencia', '2026-09-06', 'TXN-003-2026', 'Completado'),
    (4, 207.00, 'Tarjeta', '2026-09-11', 'TXN-004-2026', 'Completado'),
    (5, 109.25, 'Cheque', '2026-09-21', 'CHQ-001-2026', 'Pendiente'),
    (6, 488.75, 'Tarjeta', '2026-09-21', 'TXN-006-2026', 'Completado'),
    (7, 230.00, 'Efectivo', '2026-09-12', 'EFC-001-2026', 'Completado'),
    (8, 300.00, 'Tarjeta', '2026-09-23', 'TXN-007-2026', 'Completado'),
    (8, 56.50, 'Tarjeta', '2026-09-23', 'TXN-008-2026', 'Completado'),
    (9, 356.50, 'Transferencia', '2026-09-26', 'TXN-009-2026', 'Completado'),
    (10, 172.50, 'Tarjeta', '2026-09-04', 'TXN-010-2026', 'Rechazado'),
    (11, 1012.00, 'Tarjeta', '2026-09-29', 'TXN-011-2026', 'Completado'),
    (12, 150.00, 'Tarjeta', '2026-09-30', 'TXN-012-2026', 'Pendiente'),
    (12, 126.00, 'Transferencia', '2026-09-30', 'TXN-013-2026', 'Pendiente'),
    (7, 0.00, 'Efectivo', '2026-09-13', 'EFC-002-2026', 'Completado');

-- ============================================================
-- INSERCIONES DE DATOS - TABLA ENVIO (12 registros)
-- ============================================================
INSERT INTO envio (id_pedido, transportista, numero_seguimiento, fecha_envio, fecha_entrega_estimada, fecha_entrega_real, estado, costo_envio)
VALUES
    (1, 'Courier Express', 'CE-001-2026-08-2026', '2026-09-02', '2026-09-05', '2026-09-04', 'Entregado', 25.00),
    (2, 'Logistica Nacional', 'LN-001-2026-08-2026', '2026-09-16', '2026-09-19', '2026-09-18', 'Entregado', 15.00),
    (3, 'Courier Express', 'CE-002-2026-08-2026', '2026-09-07', '2026-09-10', '2026-09-10', 'Entregado', 30.00),
    (4, 'FastShip', 'FS-001-2026-08-2026', '2026-09-11', '2026-09-14', NULL, 'En transito', 20.00),
    (5, 'Logistica Nacional', 'LN-002-2026-09-2026', '2026-09-21', '2026-09-24', NULL, 'Pendiente', 18.00),
    (6, 'Courier Express', 'CE-003-2026-09-2026', '2026-09-22', '2026-09-25', '2026-09-25', 'Entregado', 28.00),
    (8, 'FastShip', 'FS-002-2026-09-2026', '2026-09-24', '2026-09-27', NULL, 'Pendiente', 22.00),
    (9, 'Logistica Nacional', 'LN-003-2026-09-2026', '2026-09-26', '2026-09-29', NULL, 'Pendiente', 19.00),
    (10, 'Courier Express', 'CE-004-2026-09-2026', '2026-09-04', '2026-09-07', '2026-09-06', 'Entregado', 35.00),
    (11, 'FastShip', 'FS-003-2026-09-2026', '2026-09-30', '2026-10-03', NULL, 'Pendiente', 45.00),
    (12, 'Logistica Nacional', 'LN-004-2026-10-2026', '2026-10-01', '2026-10-04', NULL, 'Pendiente', 16.00),
    (3, 'Courier Express', 'CE-005-2026-09-2026', '2026-09-08', '2026-09-11', '2026-09-10', 'Entregado', 32.00);

-- ============================================================
-- CONSULTAS CON JOIN PARA VERIFICAR LAS RELACIONES (5 Consultas)
-- ============================================================

-- Consulta 1: Pedidos de cada cliente con montos totales (1:N Cliente-Pedido)
SELECT
    c.nombre AS cliente,
    COUNT(p.id_pedido) AS total_pedidos,
    SUM(p.total) AS monto_total,
    p.estado
FROM cliente c
LEFT JOIN pedido p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nombre, p.estado
ORDER BY c.nombre;

-- Consulta 2: Detalles completos de pedidos con productos (N:M mediante Detalle_Pedido)
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    pr.nombre AS producto,
    dp.cantidad,
    dp.precio_unitario,
    dp.subtotal,
    p.fecha_pedido
FROM pedido p
INNER JOIN cliente c ON p.id_cliente = c.id_cliente
INNER JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
INNER JOIN producto pr ON dp.id_producto = pr.id_producto
ORDER BY p.id_pedido, pr.nombre;

-- Consulta 3: Productos por categoria (1:N Categoria-Producto)
SELECT
    cat.nombre AS categoria,
    COUNT(pr.id_producto) AS total_productos,
    AVG(pr.precio) AS precio_promedio,
    SUM(pr.stock) AS stock_total
FROM categoria cat
LEFT JOIN producto pr ON cat.id_categoria = pr.id_categoria
GROUP BY cat.id_categoria, cat.nombre
ORDER BY total_productos DESC;

-- Consulta 4: Estado de pagos por pedido (1:N Pedido-Pago)
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    p.total AS total_pedido,
    COALESCE(SUM(pa.monto), 0) AS total_pagado,
    p.total - COALESCE(SUM(pa.monto), 0) AS saldo_pendiente,
    p.estado AS estado_pedido
FROM pedido p
INNER JOIN cliente c ON p.id_cliente = c.id_cliente
LEFT JOIN pago pa ON p.id_pedido = pa.id_pedido AND pa.estado = 'Completado'
GROUP BY p.id_pedido, c.nombre, p.total, p.estado
ORDER BY saldo_pendiente DESC;

-- Consulta 5: Informacion de envios con detalles del pedido (1:1 Pedido-Envio)
SELECT
    e.numero_seguimiento,
    c.nombre AS cliente,
    p.id_pedido,
    p.fecha_pedido,
    e.transportista,
    e.fecha_envio,
    e.fecha_entrega_estimada,
    e.fecha_entrega_real,
    e.estado AS estado_envio,
    e.costo_envio
FROM envio e
INNER JOIN pedido p ON e.id_pedido = p.id_pedido
INNER JOIN cliente c ON p.id_cliente = c.id_cliente
ORDER BY e.fecha_envio DESC;
