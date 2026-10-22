import express from 'express';
import * as n8nController from '../controllers/n8n-agent.js';

const router = express.Router();

// Webhook para categorizar gasto
router.post('/categorizar', n8nController.categorizarGasto);

// Webhook para generar resumen mensual
router.post('/resumen-mensual', n8nController.generarResumenMensual);

export default router;
