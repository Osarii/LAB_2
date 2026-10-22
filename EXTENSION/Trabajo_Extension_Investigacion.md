# Investigacion Teorica - Bases de Datos Relacionales
## Tienda en Linea (E-commerce)

---

## 1. Modelo Relacional

El modelo relacional es un enfoque de organizacion de datos basado en tablas (relaciones) que se relacionan entre si mediante llaves. Sus componentes fundamentales son:

**Entidad**: Representa un objeto del mundo real (ejemplo: Cliente, Producto). En SQL se implementa como una tabla.

**Atributo**: Es una caracteristica o propiedad de una entidad (ejemplo: nombre_cliente, precio_producto). En SQL corresponde a una columna.

**Tupla**: Es una fila en una tabla que representa una instancia especifica de la entidad (ejemplo: un cliente particular). Cada tupla es unica en la tabla.

**Relacion**: En el contexto relacional, es la tabla en si misma. Contiene tuplas del mismo tipo de entidad, organizadas en filas y columnas.

### Ejemplo en nuestro caso:
- Tabla: Cliente (relacion)
- Columnas: id_cliente, nombre, email (atributos)
- Fila 1: (1, 'Juan Perez', 'juan@email.com') (tupla)

---

## 2. Llaves

Las llaves son atributos que identifican de forma unica las tuplas y establecen relaciones entre tablas.

**Llave Primaria (PK - Primary Key)**: Identifica unicamente cada tupla en una tabla. No puede ser NULL ni repetirse. Ejemplo: id_cliente en la tabla Cliente.

**Llave Foranea (FK - Foreign Key)**: Establece una relacion con la PK de otra tabla. Permite mantener la integridad referencial. Ejemplo: id_cliente en la tabla Pedido referencia id_cliente en Cliente.

**Llave Candidata**: Es un atributo que podria ser PK (cumple con ser unico y no nulo) pero no fue elegido como tal. Ejemplo: email en Cliente podria ser PK.

**Llave Compuesta**: Consiste en dos o mas atributos que juntos identifican unicamente una tupla. Se usa en tablas intermedias de relaciones N:M. Ejemplo: (id_pedido, id_producto) en Detalle_Pedido.

---

## 3. Tipos de Relaciones y Cardinalidad

**Uno a Uno (1:1)**
Descripcion: Un registro en tabla A se asocia con exactamente un registro en tabla B, y viceversa.
Ejemplo: Cliente - Historial_Compras (cada cliente tiene un historial unico)
Implementacion SQL: FK en una de las tablas con restriccion UNIQUE.

```sql
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL
);

CREATE TABLE historial_compras (
    id_historial INT PRIMARY KEY,
    id_cliente INT NOT NULL UNIQUE,
    total_gastado DECIMAL(10,2),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);
```

**Uno a Muchos (1:N)**
Descripcion: Un registro en tabla A se asocia con muchos registros en tabla B, pero cada registro en B pertenece a un solo A.
Ejemplo: Categoria - Producto (una categoria tiene muchos productos, pero cada producto pertenece a una categoria)
Implementacion SQL: FK en la tabla del lado "muchos".

```sql
CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);
```

**Muchos a Muchos (N:M)**
Descripcion: Muchos registros en tabla A se asocian con muchos registros en tabla B.
Ejemplo: Producto - Pedido (un producto puede aparecer en muchos pedidos, un pedido contiene muchos productos)
Implementacion SQL: Tabla intermedia con dos FK (y PK compuesta o propia).

```sql
CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE detalle_pedido (
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
```

---

## 4. Participacion y Cardinalidad

**Cardinalidad Minima**: Indicar si la participacion es obligatoria (minimo 1) u opcional (minimo 0).

**Cardinalidad Maxima**: Indicar si es 1 o N (muchos).

En un DER se representa: (min, max)

Ejemplo: Cliente participa en Pedido con (1, N) - cada cliente debe tener al menos 1 pedido, pero puede tener muchos.

---

## 5. Relaciones Recursivas (Reflexivas)

Una entidad se relaciona consigo misma. Ejemplo: Un empleado supervisa a otros empleados.

```sql
CREATE TABLE empleado (
    id_empleado INT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    id_supervisor INT,
    FOREIGN KEY (id_supervisor) REFERENCES empleado(id_empleado)
);
```

En este caso, id_supervisor es una FK que referencia la misma tabla.

---

## 6. Integridad Referencial

Significa que los valores de una FK siempre deben corresponder a un valor existente en la PK de la tabla referenciada, o ser NULL (si es permitido).

**ON DELETE CASCADE**: Si se elimina un registro padre, se eliminan automaticamente todos los registros hijos que lo referencian.

**ON DELETE SET NULL**: Si se elimina un registro padre, los registros hijos que lo referencian tienen su FK establecida a NULL.

**ON DELETE RESTRICT**: Impide eliminar un registro padre si existen registros hijos que lo referencian (accion por defecto).

---

## 7. Restricciones

**NOT NULL**: El atributo no puede ser nulo.
Ejemplo: `nombre VARCHAR(80) NOT NULL`

**UNIQUE**: El atributo no puede repetirse (pero SI puede ser NULL).
Ejemplo: `email VARCHAR(100) UNIQUE`

**CHECK**: Valida que el valor cumpla una condicion.
Ejemplo: `edad INT CHECK (edad >= 18)`

**DEFAULT**: Asigna un valor por defecto si no se proporciona.
Ejemplo: `estado VARCHAR(15) DEFAULT 'Activo'`

**AUTO_INCREMENT**: En algunos SGBD, genera automaticamente numeros secuenciales.
Ejemplo: `id INT AUTO_INCREMENT PRIMARY KEY`

---

## 8. Normalizacion

La normalizacion es un proceso para evitar redundancia y anomalias en la BD.

**Primera Forma Normal (1FN)**
- Todos los atributos deben ser atomicos (indivisibles).
- No se permiten atributos multivaluados.

Sin normalizar: `Producto(id, nombre, categorias)` donde categorias = "Electronica, Informatica"
Normalizado: Crear tabla Categoria y relacion N:M.

**Segunda Forma Normal (2FN)**
- Cumplir 1FN.
- Todo atributo no clave debe depender de la PK completa, no de parte de ella.

Ejemplo: En Detalle_Pedido, la descripcion del producto no debe estar aqui; debe estar en Producto.

**Tercera Forma Normal (3FN)**
- Cumplir 2FN.
- No puede haber dependencias transitivas entre atributos no clave.

Ejemplo: En Pedido, no incluir ciudad_cliente; esta debe estar en Cliente y accederse mediante cliente_id.

---

## 9. Notaciones del DER

**Notacion Chen**: Usa rectangulos para entidades, rombos para relaciones, y lineas con etiquetas.

**Notacion Crow's Foot (Pata de Gallo)**: Usa lineas con simbolos en los extremos:
- Linea recta = 1
- Tres patas = N (muchos)
- Circulo = Participacion opcional
- Linea transversal = Participacion obligatoria

Para este trabajo se utiliza notacion Crow's Foot.

---

## Fuentes consultadas

1. Date, C.J. (2003). An Introduction to Database Systems (8th ed.). Addison-Wesley.
2. Elmasri, R., & Navathe, S. B. (2010). Fundamentals of Database Systems (6th ed.). Pearson.
3. Ullman, J. D., & Widom, J. (2008). A First Course in Database Systems (3rd ed.). Pearson.
4. MySQL Documentation: https://dev.mysql.com/doc/
5. PostgreSQL Documentation: https://www.postgresql.org/docs/

---

**Fecha**: Octubre 2026
**Autor**: Usuario
