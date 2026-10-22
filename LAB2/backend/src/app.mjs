import express from 'express';
import cors from 'cors';
import personasRoutes from './routes/personas.js';
import gruposRoutes from './routes/grupos.js';
import gastosRoutes from './routes/gastos.js';
import liquidacionesRoutes from './routes/liquidaciones.js';
import n8nAgentRoutes from './routes/n8n-agent.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/liquidaciones', liquidacionesRoutes);
app.use('/api/n8n', n8nAgentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
