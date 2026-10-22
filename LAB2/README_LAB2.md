# Lab 2 - Sistema de Control de Gastos Compartidos

## Descripcion del Proyecto

Sistema web completo para gestionar gastos compartidos entre grupos de amigos o compañeros de piso. Permite crear grupos, registrar gastos, categorizarlos automaticamente con IA y visualizar resumenes mensuales.

## Tecnologia Utilizada

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Dev Tool**: Nodemon

### Frontend  
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Estructura del Proyecto

```
lab2-shared-expenses/
├── backend/
│   ├── src/
│   │   ├── app.mjs
│   │   ├── server.mjs
│   │   ├── db.js
│   │   ├── controllers/
│   │   │   ├── gastos.js
│   │   │   ├── grupos.js
│   │   │   └── n8n-agent.js          [AI Agent]
│   │   └── routes/
│   │       ├── gastos.js
│   │       ├── grupos.js
│   │       └── n8n-agent.js          [AI Endpoints]
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PanelGrupos.jsx       [Main dashboard]
│   │   │   ├── DetalleGrupo.jsx      [Group details]
│   │   │   ├── CrearGasto.jsx        [Create expense + IA button]
│   │   │   └── CrearGrupo.jsx        [Create group]
│   │   ├── components/
│   │   │   ├── ResumenMensualIA.jsx  [Monthly summary visual]
│   │   │   ├── ResumenGrupo.jsx
│   │   │   ├── GruposList.jsx
│   │   │   ├── ErrorMsg.jsx
│   │   │   └── Components.css
│   │   ├── services/
│   │   │   └── api.js                [API client]
│   │   ├── index.css                 [Global styles]
│   │   └── main.tsx
│   └── package.json
│
└── docs/
    ├── n8n-workflow.json
    ├── N8N_WORKFLOW_GUIDE.md
    ├── VISUAL_IMPROVEMENTS.md
    └── README_COMPLETO.md
```

## Funcionalidades Principales

### 1. Gestion de Grupos

**Crear Grupo**
- Nombre del grupo
- Seleccionar miembros disponibles
- Almacenar lista de participantes

**Ver Detalles del Grupo**
- Lista de miembros con email
- Resumen de gastos
- Historial de transacciones

### 2. Registro de Gastos

**Crear Gasto**
- Descripcion del gasto
- Monto total
- Seleccionar quien paga
- Fecha de registro
- Categorizar (manual o automatico)
- Definir tipo de reparto

**Tipos de Reparto**
- Partes iguales: Se divide equitativamente
- Porcentaje: Cada persona contribuye con porcentaje especifico
- Montos exactos: Definir monto individual por persona

### 3. AI Agent Integration - N8N

**Feature 1: Auto-Categorizar Gastos**

Flujo:
```
Usuario ingresa: "Almuerzo en restaurante"
         ↓
     Click "Generar"
         ↓
POST /api/n8n/categorizar
         ↓
Backend analiza palabras clave
         ↓
Detecta categoria: "comida"
         ↓
Frontend auto-completa campo categoria
```

Categorias Soportadas:
- Alquiler (palabras clave: alquiler, renta, casa)
- Comida (palabras clave: comida, almuerzo, cena, cafe, restaurante)
- Transporte (palabras clave: transporte, taxi, uber, bus)
- Entretenimiento (palabras clave: cine, pelicula, concierto, diversión)
- Servicios (palabras clave: luz, agua, internet, telefono)
- Salud (palabras clave: doctor, medicina, farmacia, hospital)
- Educacion (palabras clave: curso, libro, clase)
- Compras (palabras clave: compra, tienda, mercado)
- Otro (por defecto)

**Feature 2: Resumen Mensual con IA**

Flujo:
```
Usuario navega a detalles del grupo
         ↓
Componente ResumenMensualIA carga
         ↓
     Click "Generar Resumen"
         ↓
POST /api/n8n/resumen-mensual
         ↓
Backend consulta BD (mes actual)
         ↓
Agrupa por categoria
         ↓
Calcula totales y porcentajes
         ↓
Genera texto en lenguaje natural
         ↓
Frontend muestra con grafico de barras colorido
```

Salida:
```
Total gastado: $1,250.50
Cantidad de gastos: 8

Desglose por categoria:
• comida: $450 (36%)
• transporte: $300 (24%)
• servicios: $500 (40%)
```

## Endpoints API

### N8N AI Agent

**POST /api/n8n/categorizar**
```json
Request:
{
  "descripcion": "Almuerzo en restaurante"
}

Response:
{
  "ok": true,
  "data": {
    "categoria": "comida",
    "confianza": 0.85,
    "descripcion": "Almuerzo en restaurante"
  }
}
```

**POST /api/n8n/resumen-mensual**
```json
Request:
{
  "grupo_id": 1
}

Response:
{
  "ok": true,
  "data": {
    "resumen": "Resumen del mes - Piso Puntarenassss\n\nTotal gastado: $1,250.50...",
    "totalMes": 1250.50,
    "cantidadGastos": 8,
    "detallesPorCategoria": {
      "comida": 450,
      "transporte": 300,
      "servicios": 500
    }
  }
}
```

## Mejoras Visuales Implementadas

### Paleta de Colores Moderna

- **Primario**: #667eea (Morado-Azul)
- **Primario Oscuro**: #764ba2
- **Exito**: #11998e → #38ef7d (Verde)
- **Peligro**: #eb3349 → #f45c43 (Rojo)

### Componentes Destacados

1. **ResumenMensualIA**
   - Tarjeta de total con gradiente
   - Grafico de barras con colores por categoria
   - Información estructurada con porcentajes
   - Animaciones suaves

2. **Headers con Gradiente**
   - PanelGrupos: Titulo blanco sobre gradiente morado
   - DetalleGrupo: Nombre del grupo con contador de miembros
   - Botones integrados coherentemente

3. **Formularios Mejorados**
   - Inputs con focus claramente visible
   - Seccion de participaciones con fondo gradiente
   - Botones a ancho completo
   - Mejor espaciado y jerarquia

4. **Cards de Gastos**
   - Borde izquierdo azul
   - Sombra sutil para profundidad
   - Efectos hover suave
   - Participaciones listadas claramente

## Base de Datos

### Esquema

```sql
clientes:
- id
- nombre
- email

grupos:
- id
- nombre
- creado_en

grupo_miembros:
- grupo_id
- persona_id

gastos:
- id
- grupo_id
- descripcion
- monto
- pagado_por
- fecha
- tipo_reparto
- categoria
- creado_en

participaciones:
- gasto_id
- persona_id
- monto_asignado
```

## Como Ejecutar

### Instalacion

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Desarrollo

```bash
# Backend (puerto 3000)
cd backend
npm run dev

# Frontend (puerto 5174, o el que asigne)
cd frontend
npm run dev
```

### Acceso

- Frontend: http://localhost:5174
- Backend API: http://localhost:3000/api
- N8N Endpoints: http://localhost:3000/api/n8n/categorizar
              http://localhost:3000/api/n8n/resumen-mensual

## Flujo de Uso Tipico

1. **Crear Grupo**
   - Click "+ Crear grupo"
   - Ingresar nombre
   - Seleccionar miembros
   - Confirmar

2. **Registrar Gasto**
   - Click "+ Nuevo gasto"
   - Ingresar descripcion
   - Click "Generar" para auto-categorizar (opcional)
   - Ingresar monto
   - Seleccionar quien paga
   - Definir participaciones
   - Click "Crear Gasto"

3. **Ver Resumen Mensual**
   - Ir a detalles del grupo
   - Seccion "Resumen Mensual con IA"
   - Click "Generar Resumen"
   - Analizar grafico y desglose

## Testing

### Datos de Prueba

Personas Precargadas:
- Oscar
- Maria
- Juan
- Sofia

Grupos de Ejemplo:
- Piso Puntarenassss (2 miembros)
- Piso San Jose (4 miembros)
- Viaje a Limon (3 miembros)

### Categorias de Prueba

- "Almuerzo en restaurante" → comida
- "Taxi a casa" → transporte
- "Película en cine" → entretenimiento
- "Receta para el médico" → salud

## Arquitectura

```
┌─────────────────┐
│   FRONTEND      │ (React 18 + Vite)
│   localhost:    │
│    5174         │
└────────┬────────┘
         │ HTTP/Axios
         │
┌────────▼────────┐
│   BACKEND       │ (Express.js)
│   localhost:    │
│    3000         │
└────────┬────────┘
         │ SQL
         │
┌────────▼────────┐
│   SQLITE DB     │ (better-sqlite3)
│   data.db       │
└─────────────────┘
```

## Archivos Clave

| Archivo | Proposito |
|---------|-----------|
| n8n-agent.js | Logica de IA (categorizar + resumen) |
| ResumenMensualIA.jsx | Componente visual del resumen |
| CrearGasto.jsx | Formulario con boton IA |
| index.css | Estilos globales |
| Components.css | Estilos de componentes |

## Documentacion

- `N8N_WORKFLOW_GUIDE.md`: Guia completa de integracion
- `VISUAL_IMPROVEMENTS.md`: Detalle de cambios visuales
- `README_COMPLETO.md`: Documentacion completa

## Status

✅ Backend funcional
✅ Frontend responsivo  
✅ N8N AI Agent operativo
✅ Design moderno
✅ Documentacion completa
✅ Emojis removidos

## Notas

- No requiere n8n instalado (endpoints personalizados)
- Funciona completamente offline
- Base de datos se crea automaticamente
- SQL compatible con SQLite, MySQL, PostgreSQL

---

**Desarrollado por**: Usuario + Claude Haiku 4.5
**Fecha**: Octubre 2026
**Estado**: Completado y Operativo
