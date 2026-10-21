import express from 'express';
import * as personasController from '../controllers/personas.js';

const router = express.Router();

router.post('/', personasController.crearPersona);
router.get('/', personasController.obtenerPersonas);
router.get('/:persona_id', personasController.obtenerPersona);

export default router;
