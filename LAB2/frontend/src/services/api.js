import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Personas
export async function obtenerPersonas() {
  const res = await api.get('/personas');
  return res.data;
}

export async function crearPersona(nombre, email) {
  const res = await api.post('/personas', { nombre, email });
  return res.data;
}

// Grupos
export async function obtenerGrupos() {
  const res = await api.get('/grupos');
  return res.data;
}

export async function obtenerGrupo(grupo_id) {
  const res = await api.get(`/grupos/${grupo_id}`);
  return res.data;
}

export async function crearGrupo(nombre, miembros = []) {
  const res = await api.post('/grupos', { nombre, miembros });
  return res.data;
}

export async function agregarMiembro(grupo_id, persona_id) {
  const res = await api.post(`/grupos/${grupo_id}/miembros/${persona_id}`);
  return res.data;
}

export async function quitarMiembro(grupo_id, persona_id) {
  const res = await api.delete(`/grupos/${grupo_id}/miembros/${persona_id}`);
  return res.data;
}

// Gastos
export async function obtenerGastosGrupo(grupo_id) {
  const res = await api.get(`/gastos/grupo/${grupo_id}`);
  return res.data;
}

export async function crearGasto(grupo_id, descripcion, monto, pagado_por, fecha, tipo_reparto, categoria, participaciones) {
  const res = await api.post('/gastos', {
    grupo_id,
    descripcion,
    monto: parseFloat(monto),
    pagado_por: parseInt(pagado_por),
    fecha,
    tipo_reparto,
    categoria,
    participaciones: Object.fromEntries(
      Object.entries(participaciones).map(([k, v]) => [k, parseFloat(v)])
    ),
  });
  return res.data;
}

export async function eliminarGasto(gasto_id) {
  const res = await api.delete(`/gastos/${gasto_id}`);
  return res.data;
}

export async function obtenerBalance(grupo_id, persona_id) {
  const res = await api.get(`/gastos/balance/${grupo_id}/${persona_id}`);
  return res.data;
}

export async function obtenerResumen(grupo_id) {
  const res = await api.get(`/gastos/resumen/${grupo_id}`);
  return res.data;
}

// Liquidaciones
export async function obtenerLiquidacionesGrupo(grupo_id) {
  const res = await api.get(`/liquidaciones/grupo/${grupo_id}`);
  return res.data;
}

export async function crearLiquidacion(grupo_id, de_persona, a_persona, monto, fecha) {
  const res = await api.post('/liquidaciones', {
    grupo_id,
    de_persona: parseInt(de_persona),
    a_persona: parseInt(a_persona),
    monto: parseFloat(monto),
    fecha,
  });
  return res.data;
}

export async function obtenerLiquidacionesRecomendadas(grupo_id) {
  const res = await api.get(`/liquidaciones/recomendadas/${grupo_id}`);
  return res.data;
}

// n8n AI Agent
export async function categorizarGastoConIA(descripcion) {
  const res = await api.post('/n8n/categorizar', { descripcion });
  return res.data;
}

export async function generarResumenMensual(grupo_id) {
  const res = await api.post('/n8n/resumen-mensual', { grupo_id });
  return res.data;
}
