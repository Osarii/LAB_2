# Bitácora de IA - Laboratorio #2

## Prompt 1: Diseño del esquema SQL
**Fecha**: 2024-10-21
**Objetivo**: Crear un modelo relacional para gastos compartidos con liquidaciones

**Prompt**:
```
Diseña un esquema SQL PostgreSQL para un sistema de gastos compartidos con:
- personas (id, nombre, email)
- grupos de personas
- gastos que puede pagar una persona
- participaciones (quién participa en cada gasto y cuánto le toca)
- liquidaciones (pagos para saldar deudas)

Requisitos:
1. Tres tipos de reparto: igual, porcentaje, exacto
2. Validar que la suma de participaciones = monto del gasto
3. Índices para búsquedas comunes
4. Datos de ejemplo realistas
```

**Respuesta**: Esquema con 6 tablas, relaciones foráneas, restricciones CHECK, índices y datos de ejemplo.

**Ajustes**: Ninguno necesario - respuesta completa y lista para usar.

---

## Prompt 2: Lógica de cálculo de balances
**Fecha**: 2024-10-21
**Objetivo**: Implementar calcularBalance() que considere pagos, deudas y liquidaciones

**Prompt**:
```
En un sistema de gastos compartidos, el balance de una persona es:
balance = dinero_pagado + dinero_recibido_como_deudor - dinero_que_debe - dinero_pagado_para_saldar

Escribe una función JavaScript/Node que:
1. Consulte PostgreSQL para calcular cada componente con SUM de SQL
2. Retorne el balance final redondeado a 2 decimales
3. Maneje el caso de no hay registros (retornar 0)
```

**Respuesta**: Función con 4 queries SQL correctas y parseFloat().toFixed(2).

**Ajustes**: Se agregó cálculo de balance.detalles para debugging.

---

## Prompt 3: Algoritmo de liquidaciones mínimas
**Fecha**: 2024-10-21
**Objetivo**: Calcular el número mínimo de pagos para saldar todas las deudas

**Prompt**:
```
Implementa el algoritmo greedy para liquidaciones mínimas:
1. Calcula balance de cada persona en el grupo
2. Separa en deudores (balance < 0) y acreedores (balance > 0)
3. Empareja el deudor con más deuda con el acreedor con más crédito
4. Genera el pago mínimo y reduce ambos
5. Repite hasta que no haya más deudas

Retorna array de: {de_persona, a_persona, monto}
```

**Respuesta**: Función greedy que ordena arrays y empareja eficientemente.

**Ajustes**: Se agregó .toFixed(2) para evitar errores de punto flotante.

---

## Prompt 4: Estructura de Express y modularización
**Fecha**: 2024-10-21
**Objetivo**: Organizar API en rutas, controladores y servicios

**Prompt**:
```
Estructura una API Express modularizada:
- src/routes/ para definir rutas REST
- src/controllers/ para recibir y responder
- src/services/ para lógica de negocio y consultas SQL
- src/db.js para pool de conexiones

Que todos los errores retornen { error: "mensaje" } con códigos 400, 404, 409 correctos.
```

**Respuesta**: 4 archivos de rutas, 4 controladores, 1 servicio, 1 db.js con pool.

**Ajustes**: Se separó bien la responsabilidad. Validaciones en controladores, lógica en servicios.

---

## Prompt 5: Validación al remover miembro de grupo
**Fecha**: 2024-10-21
**Objetivo**: Evitar remover persona si su balance no es cero

**Prompt**:
```
En quitarMiembro(), verifica que el balance de la persona sea exactamente 0.
Si no lo es, retorna 409 con mensaje diciendo cuánto debe.
La validación debe usar la misma lógica de calcularBalance().
```

**Respuesta**: Query SQL en una línea con los 4 componentes del balance, comparación y error 409.

**Ajustes**: Ninguno - funcionó a la primera.

---

## Prompt 6: Transacciones ACID en crearGasto
**Fecha**: 2024-10-21
**Objetivo**: Asegurar que gasto y participaciones se insertan juntos

**Prompt**:
```
crearGasto() debe:
1. BEGIN transacción
2. Verificar que sum(participaciones) == monto (error si no)
3. INSERT gasto y obtener ID
4. INSERT participaciones para cada persona
5. COMMIT

Si algo falla, ROLLBACK todo. Usa try/catch/finally.
```

**Respuesta**: Transacción completa con validación previa de sumas.

**Ajustes**: Se agregó Math.abs() para comparación de flotantes.

---

## Resumen de aprendizaje

- **IA fue útil para**: Queries SQL complejas, estructura de Express, algoritmos
- **Qué validé manualmente**: Lógica de redondeo de centavos, edge cases de transacciones
- **Qué cambié**: Math.abs() para flotantes, .toFixed(2) en balances
