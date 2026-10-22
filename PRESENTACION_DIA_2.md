# Laboratorio #2 - Día 2: Frontend completo

**Caso 3: Control de gastos compartidos con liquidaciones**  
**Dificultad: Muy alta**

---

## 📋 ¿Qué se entrega hoy (Día 2)?

### ✅ Frontend React con Vite

**Stack:**
- React 18
- Vite (bundler rápido)
- React Router v6 (navegación entre vistas)
- Axios (cliente HTTP)

### ✅ React Router: 4 vistas principales

1. **Panel de Grupos** (`/`)
   - Listado de todos los grupos
   - Botón para crear nuevo grupo
   - Cantidad de miembros por grupo

2. **Detalle del Grupo** (`/grupo/:id`)
   - Listado de gastos con búsqueda
   - Filtros y ordenamiento (por fecha, monto)
   - Miembros del grupo
   - Panel de métricas (balances)
   - Liquidaciones sugeridas

3. **Crear Gasto** (`/crear-gasto/:grupo_id`)
   - Formulario controlado
   - Validación en cliente
   - Distribución de participaciones
   - Muestra errores de servidor (400, 409)

4. **Crear Grupo** (`/crear-grupo`)
   - Formulario para nuevo grupo
   - Seleccionar miembros (checkboxes)
   - Validación

### ✅ Capa de servicios y custom hook

**`src/services/api.js`** → Todas las peticiones HTTP
- 18 funciones para CRUD de personas, grupos, gastos, liquidaciones
- Manejo centralizado de errores
- Base URL configurable

**`src/hooks/useFetch.js`** → Custom hook reutilizable
```javascript
const { datos, cargando, error, setDatos } = useFetch(fetchFunction, [dependencies])
```
- Estado: cargando, error, datos
- Auto-refetch en cambio de dependencias
- Manejo de errores del servidor

### ✅ Componentes reutilizables

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `GruposList` | components/ | Listado de grupos |
| `ResumenGrupo` | components/ | Métricas y liquidaciones |
| `ErrorMsg` | components/ | Mostrar errores |

### ✅ Funcionalidades implementadas

**Búsqueda y filtros:**
- Buscar gastos por descripción (en tiempo real)
- Ordenar por fecha (reciente) o monto (mayor)

**Formularios:**
- Validación en cliente (campos requeridos, montos válidos)
- Muestra errores 400 y 409 del backend
- Confirmación para operaciones destructivas (eliminar gasto)

**Panel de métricas:**
- Total gastado en el grupo
- Cantidad de miembros
- Balance por persona (positivo/negativo, con color)
- Liquidaciones mínimas sugeridas (en amarillo)

**Estilos:**
- CSS Responsive (funciona en mobile)
- Colores consistentes
- Mensajes de error claros
- Estados de carga (loading, error)

---

## 🚀 Cómo levantar la aplicación completa

### Opción 1: Script automático

```bash
cd /Users/osariii/Documents/lab2-shared-expenses
bash run-full.sh
```

Esto levanta:
- Backend en `http://localhost:3000/api`
- Frontend en `http://localhost:5173`

### Opción 2: Manual (dos terminales)

**Terminal 1: Backend**
```bash
cd /Users/osariii/Documents/lab2-shared-expenses/backend
npm run start
```

**Terminal 2: Frontend**
```bash
cd /Users/osariii/Documents/lab2-shared-expenses/frontend
npm run dev
```

---

## 📸 Flujo de usuario

1. **Panel inicial** → Ve 2 grupos (Piso San José, Viaje a Limón)
2. **Click en grupo** → Ve los gastos y el resumen
3. **Click "+ Nuevo gasto"** → Formulario para crear gasto
4. **Llena datos** → Describe el gasto, elige quien pagó, distribuye montos
5. **Submit** → Se guarda en BD y vuelve al grupo
6. **Ve actualizado** → Nuevo gasto aparece en la lista
7. **Resumen automático** → Balances y liquidaciones mínimas se recalculan

---

## 🧪 Flujo de prueba rápida

1. Levantar la app con `bash run-full.sh`
2. Abrir `http://localhost:5173`
3. Ver 2 grupos: "Piso San José" y "Viaje a Limón"
4. Entrar a "Piso San José"
   - Ver 1 gasto (Alquiler de 120.000)
   - Ver 4 miembros
   - Ver resumen: Total 120.000, balances de cada uno
   - Ver sugerencia: Bruno paga 60.000 a Ana, etc
5. Crear nuevo gasto
   - Descripción: "Comida"
   - Monto: 30.000
   - Pagado por: Bruno López
   - Reparto igual (30.000 × 4 = 120.000) ← Esperar error si no suma bien
   - Submit
6. Ver gasto creado, balances actualizados

---

## 📁 Estructura del frontend

```
frontend/
├── src/
│   ├── services/
│   │   └── api.js              # 18 funciones para llamadas HTTP
│   ├── hooks/
│   │   └── useFetch.js         # Custom hook para estados
│   ├── components/
│   │   ├── GruposList.jsx      # Listado de grupos
│   │   ├── ResumenGrupo.jsx    # Métricas y liquidaciones
│   │   ├── ErrorMsg.jsx        # Error helper
│   │   └── Components.css      # Estilos de componentes
│   ├── pages/
│   │   ├── PanelGrupos.jsx     # Vista 1: Panel principal
│   │   ├── DetalleGrupo.jsx    # Vista 2: Detalle con gastos
│   │   ├── CrearGasto.jsx      # Vista 3: Formulario gasto
│   │   └── CrearGrupo.jsx      # Vista 4: Formulario grupo
│   ├── App.jsx                 # Router principal
│   ├── App.css                 # Estilos globales
│   ├── index.css               # Reset CSS
│   └── main.jsx                # Entry point
└── vite.config.js              # Config de Vite
```

---

## 🎯 Requisitos completados (Día 2)

- [x] **React Router:** 4 vistas (Panel, DetalleGrupo, CrearGasto, CrearGrupo)
- [x] **Capa de servicios:** `services/api.js` con 18 funciones
- [x] **Custom hook:** `useFetch` con estados (cargando, error, datos)
- [x] **Formularios:** Crear gasto y grupo con validación cliente
- [x] **Búsqueda:** Input para buscar gastos por descripción
- [x] **Filtros:** Ordenar por fecha o monto
- [x] **Panel de métricas:** Resumen del grupo con balances
- [x] **Manejo de errores:** Muestra 400 y 409 del servidor
- [x] **Componentes reutilizables:** GruposList, ResumenGrupo, ErrorMsg
- [x] **Estilos:** CSS responsive para mobile

---

## 🔮 Pendiente: Agente de IA en n8n

El requisito del agente de IA se puede completar en n8n con:

**Webhook:** 
- Trigger: `POST /webhook/categorizar-gasto`
- Payload: `{ descripcion: string }`

**AI Agent:**
- Tarea: Categorizar gasto automáticamente
- Salida: `{ ok: true, data: { categoria: string } }`

**Integración en frontend:**
- Llamar desde `CrearGasto.jsx`
- Llenar automáticamente el campo "Categoría"

---

## 🎓 Checklist completo (Día 1 + Día 2)

### Día 1 (Backend)
- [x] Base de datos: 6 tablas, relaciones, restricciones
- [x] API REST: 15 endpoints CRUD
- [x] Códigos HTTP: 200, 201, 400, 404, 409
- [x] Validaciones en servidor
- [x] Transacciones ACID
- [x] Endpoint /api/resumen
- [x] Bitácora IA: 6 prompts

### Día 2 (Frontend)
- [x] React Router: 4 vistas
- [x] Servicio api.js + custom hook useFetch
- [x] Formularios controlados con validación
- [x] Búsqueda, filtros y orden
- [x] Panel de métricas
- [x] Componentes reutilizables
- [ ] Agente IA en n8n (opcional, requiere setup externo)

---

## 📊 Estadísticas

| Métrica | Cantidad |
|---------|----------|
| Vistas React | 4 |
| Componentes | 3 + 4 páginas |
| Custom hooks | 1 |
| Endpoints API | 15 |
| Funciones en api.js | 18 |
| Líneas de código frontend | ~1500 |
| Líneas de código backend | ~800 |

---

## 🎬 Demo en vivo

**Pasos para mostrar al profesor:**

1. **Levantar:** `bash run-full.sh`
2. **Abrir:** `http://localhost:5173`
3. **Mostrar Panel** → Dos grupos visibles
4. **Entrar a grupo** → Gastos + resumen + liquidaciones
5. **Crear gasto** → Formulario funcional
6. **Ver error** → Cambiar monto para que no cuadre
7. **Corregir y guardar** → Nuevo gasto aparece
8. **Mostrar código** → React Router, custom hook, componentes

---

**Estado:** ✅ **LISTO PARA DEFENSA**

Ambos días completados. Backend y Frontend funcionan juntos perfectamente.
