# N8N AI Agent Workflow - Lab2 Sistema de Gastos Compartidos

## Descripción General

Este documento describe la integración del **n8n AI Agent** en el sistema de control de gastos compartidos. El workflow automatiza dos procesos clave:

1. **Auto-categorización de gastos** - Clasifica automáticamente los gastos según su descripción
2. **Análisis mensual con IA** - Genera un resumen mensual detallado con análisis por categoría

## Características

### 1. Webhook de Categorización
**Endpoint:** `POST /api/n8n/categorizar`

Recibe la descripción de un gasto y automáticamente lo clasifica en una de las siguientes categorías:
- Alquiler (palabras clave: alquiler, renta, casa)
- Comida (palabras clave: comida, almuerzo, cena, café, restaurante)
- Transporte (palabras clave: transporte, taxi, uber, bus)
- Entretenimiento (palabras clave: cine, película, concierto, diversión)
- Servicios (palabras clave: luz, agua, internet, teléfono)
- Salud (palabras clave: doctor, medicina, farmacia, hospital)
- Educacion (palabras clave: curso, libro, clase)
- Compras (palabras clave: compra, tienda, mercado)
- Otro (categoría por defecto)

**Request:**
```json
{
  "descripcion": "Almuerzo en restaurante"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "categoria": "comida",
    "confianza": 0.85,
    "descripcion": "Almuerzo en restaurante"
  }
}
```

### 2. Webhook de Resumen Mensual
**Endpoint:** `POST /api/n8n/resumen-mensual`

Genera un análisis completo de los gastos del mes actual para un grupo específico.

**Request:**
```json
{
  "grupo_id": 1
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "resumen": "Resumen del mes - Piso Puntarenassss\n\nTotal gastado: $1,250.50\nCantidad de gastos: 8\n\nDesglose por categoría:\n• comida: $450 (36%)\n• transporte: $300 (24%)\n• servicios: $500 (40%)",
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

## Arquitectura

### Backend (Node.js + Express)

```
backend/src/
├── controllers/
│   └── n8n-agent.js          # Lógica del AI Agent
├── routes/
│   └── n8n-agent.js          # Endpoints webhook
└── app.mjs                     # Montaje de rutas
```

**Flujo de categorización:**
1. Usuario ingresa descripción → "Almuerzo en restaurante"
2. Click en botón "🤖 IA"
3. Frontend → POST `/api/n8n/categorizar`
4. Backend analiza palabras clave
5. Retorna `{categoria: "comida", confianza: 0.85}`
6. Frontend auto-completa campo de categoría

**Flujo de resumen mensual:**
1. Usuario navega a "Detalles del Grupo"
2. Sistema carga componente ResumenMensualIA
3. Click en "🤖 Generar Resumen"
4. Frontend → POST `/api/n8n/resumen-mensual`
5. Backend:
   - Consulta BD (gastos del mes actual)
   - Agrupa por categoría
   - Calcula totales y porcentajes
   - Genera texto en lenguaje natural
6. Frontend muestra análisis formateado

### Frontend (React 18 + Vite)

```
frontend/src/
├── pages/
│   ├── CrearGasto.jsx         # Botón IA para categorizar
│   └── DetalleGrupo.jsx       # Integración del componente
├── components/
│   └── ResumenMensualIA.jsx   # Componente de resumen
└── services/
    └── api.js                  # Cliente para webhooks
```

## Datos y Base de Datos

El sistema usa **SQLite** con las siguientes tablas:

- `gastos` - Registros de gastos (id, descripcion, monto, categoria, fecha, grupo_id)
- `personas` - Miembros del grupo
- `grupos` - Grupos de gastos compartidos

**Query para resumen mensual:**
```sql
SELECT g.*, p.nombre as pagado_por_nombre
FROM gastos g
LEFT JOIN personas p ON g.pagado_por = p.id
WHERE g.grupo_id = $1
  AND strftime('%Y-%m', g.fecha) = strftime('%Y-%m', date('now'))
ORDER BY g.fecha DESC
```

## Implementación Tecnica

### Clasificación de Palabras Clave

La lógica de categorización usa un enfoque simple pero efectivo:

```javascript
const CATEGORIAS = [
  'alquiler', 'comida', 'transporte', 'entretenimiento',
  'servicios', 'salud', 'educacion', 'compras', 'otro'
];

// Convierte descripción a minúsculas y busca palabras clave
const desc = descripcion.toLowerCase();
if (desc.includes('comida') || desc.includes('restaurante')) {
  categoria = 'comida';
}
// ... más condiciones
```

### Generación de Resumen Natural

El sistema genera texto descriptivo calculando:
- Total gastado en el mes
- Cantidad de gastos registrados
- Distribución por categoría (con porcentajes)
- Top 5 gastos principales

## Mejoras Futuras

1. **Integración con Claude API** - Reemplazar palabras clave con LLM más inteligente
   ```javascript
   const response = await anthropic.messages.create({
     model: "claude-3-5-sonnet-20241022",
     messages: [{
       role: "user",
       content: `Categoriza este gasto: "${descripcion}"`
     }]
   });
   ```

2. **Machine Learning** - Entrenar modelo con historial de gastos del usuario

3. **Análisis predictivo** - Proyecciones de gasto para próximos meses

4. **Alertas inteligentes** - Notificaciones si gasto excede presupuesto por categoría

## Logs y Monitoreo

Los logs de ejecución se registran automáticamente:
- Éxitos: Categorías detectadas, resúmenes generados
- Errores: Descripciones vacías, grupos no encontrados

## Seguridad

Sin credenciales expuestas
- Base de datos local (SQLite)
- Validacion de entrada (descripcion requerida, grupo_id valido)
- Respuestas con formato estandar {ok, data, error}

## Archivos Generados

- `n8n-workflow.json` - Estructura del workflow en formato JSON
- `N8N_WORKFLOW_GUIDE.md` - Este documento
- Implementación en `src/controllers/n8n-agent.js`

## Version

v1.0.0 - 2026-10-22
- Categorizacion de gastos
- Resumen mensual con analisis
- Integracion frontend
- Base de datos SQLite

---

Zona horaria: America/Costa_Rica  
Desarrollador: Claude Haiku 4.5  
Estado: Produccion
