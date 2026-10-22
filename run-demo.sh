#!/bin/bash

set -e

echo "=================================================="
echo "  LABORATORIO #2: Control de Gastos Compartidos"
echo "  Caso 3 - Dificultad: Muy alta"
echo "=================================================="
echo ""

PROJECT_DIR="/Users/osariii/Documents/lab2-shared-expenses"
cd "$PROJECT_DIR/backend"

echo "1. Inicializando base de datos..."
npm run init-db
echo ""

echo "2. Iniciando servidor en puerto 3000..."
echo "   (Espera 3 segundos para que se estabilice)"
npm run start &
SERVER_PID=$!
sleep 3

echo ""
echo "3. Ejecutando pruebas de API..."
echo ""

cd "$PROJECT_DIR"
bash test-api.sh

echo ""
echo "4. Matando el servidor..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=================================================="
echo "  DEMO COMPLETADA"
echo "=================================================="
