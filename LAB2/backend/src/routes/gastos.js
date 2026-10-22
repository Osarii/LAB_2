import express from 'express';
import * as gastosController from '../controllers/gastos.js';

const router = express.Router();

router.post('/', gastosController.crearGasto);
router.get('/grupo/:grupo_id', gastosController.obtenerGastosGrupo);
router.delete('/:gasto_id', gastosController.eliminarGasto);
router.get('/balance/:grupo_id/:persona_id', gastosController.obtenerBalance);
router.get('/resumen/:grupo_id', gastosController.obtenerResumen);

export default router;
