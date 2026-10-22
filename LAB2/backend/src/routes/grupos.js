import express from 'express';
import * as gruposController from '../controllers/grupos.js';

const router = express.Router();

router.post('/', gruposController.crearGrupo);
router.get('/', gruposController.obtenerGrupos);
router.get('/:grupo_id', gruposController.obtenerGrupo);
router.post('/:grupo_id/miembros/:persona_id', gruposController.agregarMiembro);
router.delete('/:grupo_id/miembros/:persona_id', gruposController.quitarMiembro);

export default router;
