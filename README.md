# Laboratorio #2: Control de gastos compartidos con liquidaciones

**Caso 3 - Dificultad: Muy alta**

Sistema para administrar gastos compartidos entre grupos de personas con cálculo automático de liquidaciones mínimas.

## Características

- **Base de datos relacional** con 6 tablas relacionadas (PostgreSQL)
- **API REST** con operaciones CRUD para personas, grupos, gastos y liquidaciones
- **Cálculo de balance** con transacciones seguras
- **Liquidaciones mínimas** usando algoritmo greedy
- **Validaciones de negocio** en el servidor (códigos HTTP correctos)
- **Agente IA en n8n** para categorización de gastos

## Stack

- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL (o SQLite)
- **Frontend**: React + Vite (mañana)
- **IA**: n8n con AI Agent (mañana)

## Instalación

### 1. Base de datos

```bash
createdb gastos_compartidos
psql -d gastos_compartidos -f schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tu DATABASE_URL
npm install
npm run dev
```

El servidor estará en `http://localhost:3000`

## Endpoints de la API

### Personas
- `POST /api/personas` - Crear persona
- `GET /api/personas` - Listar personas
- `GET /api/personas/:persona_id` - Obtener persona

### Grupos
- `POST /api/grupos` - Crear grupo
- `GET /api/grupos` - Listar grupos
- `GET /api/grupos/:grupo_id` - Obtener grupo con miembros
- `POST /api/grupos/:grupo_id/miembros/:persona_id` - Añadir miembro
- `DELETE /api/grupos/:grupo_id/miembros/:persona_id` - Quitar miembro

### Gastos
- `POST /api/gastos` - Crear gasto
- `GET /api/gastos/grupo/:grupo_id` - Listar gastos del grupo
- `DELETE /api/gastos/:gasto_id` - Eliminar gasto
- `GET /api/gastos/balance/:grupo_id/:persona_id` - Balance de persona
- `GET /api/gastos/resumen/:grupo_id` - Resumen del grupo

### Liquidaciones
- `POST /api/liquidaciones` - Registrar liquidación
- `GET /api/liquidaciones/grupo/:grupo_id` - Listar liquidaciones
- `GET /api/liquidaciones/recomendadas/:grupo_id` - Liquidaciones mínimas sugeridas

## Reglas de negocio implementadas

✓ Tres tipos de reparto: partes iguales, porcentaje, montos exactos
✓ Redondeo de centavos cuadra exactamente
✓ Balance por persona (pagado - debe - liquidaciones)
✓ Cálculo de número mínimo de pagos para saldar
✓ No permite remover persona con balance pendiente
✓ Transacciones ACID para operaciones críticas

## Bitácora de IA

(Se llenará conforme se desarrolle)

## Estado del desarrollo

**Día 1:**
- [x] Esquema SQL con 6 tablas
- [x] API REST con CRUD completo
- [x] Validaciones y códigos HTTP
- [x] Cálculo de balances y liquidaciones mínimas
- [ ] Pruebas de endpoints con Postman

**Día 2:**
- [ ] Frontend React con Router
- [ ] Vistas de grupos, gastos, liquidaciones
- [ ] Formularios con validación
- [ ] Panel de métricas
- [ ] Agente de IA en n8n
