#!/bin/bash

echo "=== PRUEBA DE API - Laboratorio #2 ==="
echo ""

# Esperar a que el servidor esté listo
sleep 2

BASE_URL="http://localhost:3000/api"

echo "1. Verificar health del servidor"
curl -s $BASE_URL/health
echo ""
echo ""

echo "2. Obtener personas (Ana, Bruno, Carla, David)"
curl -s $BASE_URL/personas
echo ""
echo ""

echo "3. Obtener grupos (Piso San José, Viaje a Limón)"
curl -s $BASE_URL/grupos
echo ""
echo ""

echo "4. Obtener grupo 1 con miembros"
curl -s $BASE_URL/grupos/1
echo ""
echo ""

echo "5. Obtener gastos del grupo 1 (Alquiler)"
curl -s $BASE_URL/gastos/grupo/1
echo ""
echo ""

echo "6. Obtener balance de Ana (persona 1) en grupo 1"
curl -s $BASE_URL/gastos/balance/1/1
echo ""
echo ""

echo "7. RESUMEN del grupo 1 (balances + liquidaciones recomendadas)"
curl -s $BASE_URL/gastos/resumen/1
echo ""
echo ""

echo "8. Obtener liquidaciones del grupo 1"
curl -s $BASE_URL/liquidaciones/grupo/1
echo ""
echo ""

echo "9. Sugerir liquidaciones mínimas para grupo 1"
curl -s $BASE_URL/liquidaciones/recomendadas/1
echo ""
echo ""

echo "=== FIN DE PRUEBAS ==="
