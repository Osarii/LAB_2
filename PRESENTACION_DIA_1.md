# Laboratorio #2 - Día 1: Backend completo

**Caso 3: Control de gastos compartidos con liquidaciones**  
**Dificultad: Muy alta**

---

## 📋 ¿Qué se entrega hoy?

### ✅ Base de datos relacional (SQLite)
- 6 tablas normalizadas: personas, grupos, grupo_personas, gastos, participaciones, liquidaciones
- Relaciones foráneas con CASCADE
- Índices para optimizar búsquedas
- Datos de ejemplo funcionales

### ✅ API REST con Express (Node.js)
**Estructura por capas:**
- `src/routes/` → Definen rutas HTTP
- `src/controllers/` → Reciben peticiones y responden
- `src/services/` → Lógica de negocio
- `src/db.js` → Conexión a base de datos

**Endpoints implementados (9 funcionales):**

| Recurso | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| Personas | POST | `/api/personas` | Crear persona |
| | GET | `/api/personas` | Listar personas |
| | GET | `/api/personas/:id` | Obtener persona |
| Grupos | POST | `/api/grupos` | Crear grupo |
| | GET | `/api/grupos` | Listar grupos |
| | GET | `/api/grupos/:id` | Obtener grupo con miembros |
| | POST | `/api/grupos/:id/miembros/:pid` | Añadir miembro |
| | DELETE | `/api/grupos/:id/miembros/:pid` | Remover miembro |
| Gastos | POST | `/api/gastos` | Crear gasto con participaciones |
| | GET | `/api/gastos/grupo/:id` | Listar gastos |
| | DELETE | `/api/gastos/:id` | Eliminar gasto |
| | GET | `/api/gastos/balance/:gid/:pid` | Balance de persona |
| | GET | `/api/gastos/resumen/:id` | Resumen del grupo |
| Liquidaciones | POST | `/api/liquidaciones` | Registrar pago |
| | GET | `/api/liquidaciones/grupo/:id` | Listar pagos |
| | GET | `/api/liquidaciones/recomendadas/:id` | Liquidaciones mínimas |

### ✅ Reglas de negocio implementadas

1. **Tres tipos de reparto:**
   - `igual`: cada persona paga lo mismo
   - `porcentaje`: porcentajes que suman 100%
   - `exacto`: montos exactos que suman el total

2. **Redondeo de centavos exacto:**
   - Validación: suma de participaciones = monto del gasto
   - Tolerancia: ±0.01

3. **Balance por persona:**
   - Dinero pagado
   - Menos: dinero que le corresponde pagar
   - Más: pagos recibidos de otros
   - Menos: pagos realizados para saldar

4. **Algoritmo de liquidaciones mínimas (greedy):**
   - Calcula el menor número de pagos para saldar todas las deudas
   - Empareja deudores con acreedores por montos
   - Ejemplo: 3 personas deudoras pueden saldar con 3 pagos (no 9)

5. **Restricciones de negocio:**
   - No se puede remover persona de grupo si su balance ≠ 0 → Error 409
   - No se puede crear gasto si faltan insumos → Error 409
   - Transacciones ACID para operaciones críticas

### ✅ Códigos HTTP correctos

- `200 OK` → Consulta exitosa
- `201 CREATED` → Creación exitosa
- `400 BAD REQUEST` → Datos inválidos
- `404 NOT FOUND` → Recurso no existe
- `409 CONFLICT` → Viola regla de negocio

---

## 🚀 Cómo levantar la demo

### Opción 1: Script automático (recomendado)

```bash
cd /Users/osariii/Documents/lab2-shared-expenses
bash run-demo.sh
```

Esto:
1. Inicializa la base de datos
2. Levanta el servidor
3. Ejecuta todas las pruebas de API
4. Mata el servidor

### Opción 2: Manual (para depurar)

```bash
# Terminal 1: Inicializar BD (primera vez)
cd /Users/osariii/Documents/lab2-shared-expenses/backend
npm install
npm run init-db

# Terminal 1: Iniciar servidor
npm run start
# Escucha en http://localhost:3000/api

# Terminal 2: Ejecutar pruebas
cd /Users/osariii/Documents/lab2-shared-expenses
bash test-api.sh
```

---

## 📊 Ejemplo de datos

### Grupo 1: Piso San José (4 personas)
- **Ana García** → Pagó 120.000 (alquiler)
- **Bruno López** → Debe 30.000 (su parte)
- **Carla Díaz** → Debe 30.000 (su parte)
- **David Rojas** → Debe 30.000 (su parte)

**Balances finales:**
- Ana: +120.000 neto (pagó todo, le deben)
- Bruno: -60.000 (ya pagó 30.000 el 5 de octubre, debe 30.000 más)
- Carla: -30.000 (no ha pagado nada)
- David: -30.000 (no ha pagado nada)

**Liquidaciones mínimas sugeridas:**
1. Bruno paga 60.000 a Ana
2. Carla paga 30.000 a Ana
3. David paga 30.000 a Ana
**Total: 3 pagos para saldar todas las deudas**

---

## 📁 Estructura del proyecto

```
lab2-shared-expenses/
├── backend/
│   ├── src/
│   │   ├── routes/          # 4 archivos de rutas
│   │   ├── controllers/     # 4 controladores
│   │   ├── services/        # gastos.js con toda la lógica
│   │   ├── db.js           # Adaptador SQLite
│   │   ├── app.mjs         # App Express
│   │   └── server.mjs      # Entry point
│   ├── scripts/
│   │   └── init-db.mjs     # Script para crear BD
│   └── package.json        # npm run init-db, npm run start
├── data/
│   ├── gastos.db           # Base de datos SQLite (no en git)
│   └── schema.sql          # Esquema con datos ejemplo
├── schema.sql              # Versión PostgreSQL (referencia)
├── README.md               # Documentación del proyecto
├── BITACORA_IA.md          # Prompts usados con IA
├── run-demo.sh            # Script para levantar demo
└── test-api.sh            # Script para probar API
```

---

## 🧪 Resultados de las pruebas

```
✓ Health check - Servidor respondiendo
✓ Personas - 4 personas cargadas
✓ Grupos - 2 grupos creados
✓ Grupo con miembros - Datos relacionados correctos
✓ Gastos del grupo - Alquiler cargado con participaciones
✓ Balance de persona - Cálculo correcto
✓ Resumen del grupo - Balances + liquidaciones mínimas
✓ Liquidaciones - Pagos registrados
✓ Liquidaciones recomendadas - Algoritmo funcionando
```

---

## 🎯 Checklist para el profesor

- [x] Base de datos: 6 tablas, llaves foráneas, restricciones
- [x] API REST: CRUD completo para 4 recursos
- [x] Códigos HTTP: 200, 201, 400, 404, 409 correctos
- [x] Validaciones en servidor (no en front)
- [x] Transacciones ACID (BEGIN/COMMIT/ROLLBACK)
- [x] Endpoint /api/resumen con indicadores (SUM, COUNT, etc.)
- [x] Seguridad: queries parametrizadas (sin SQL injection)
- [x] Bitácora de IA: 6 prompts documentados
- [x] README con instrucciones de setup
- [x] Commits pequeños y frecuentes

---

## 🔮 Para el Día 2 (mañana)

- Frontend React con Vite
- React Router (4+ vistas): panel, listado, detalle, formulario
- Custom hook useFetch para manejo de estados
- Formularios controlados con validación
- Búsqueda, filtros y ordenamiento
- Panel de métricas
- Agente de IA en n8n con webhook
- Componentes reutilizables

---

**Estado:** ✅ **LISTO PARA PRESENTAR**
