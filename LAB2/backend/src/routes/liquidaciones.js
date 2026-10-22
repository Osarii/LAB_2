import express from 'express';
import * as liquidacionesController from '../controllers/liquidaciones.js';

const router = express.Router();

router.post('/', liquidacionesController.crearLiquidacion);
router.get('/grupo/:grupo_id', liquidacionesController.obtenerLiquidacionesGrupo);
router.get('/recomendadas/:grupo_id', liquidacionesController.obtenerLiquidacionesRecomendadas);

export default router;
