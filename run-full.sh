#!/bin/bash

echo "=================================================="
echo "  LABORATORIO #2 - DÍA 2: Frontend + Backend"
echo "  Control de Gastos Compartidos"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para manejar Ctrl+C
cleanup() {
  echo ""
  echo -e "${YELLOW}Deteniendo servidores...${NC}"
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  wait $BACKEND_PID 2>/dev/null || true
  wait $FRONTEND_PID 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${GREEN}1. Iniciando backend en puerto 3000...${NC}"
cd /Users/osariii/Documents/lab2-shared-expenses/backend
npm run start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Iniciar frontend
echo -e "${GREEN}2. Iniciando frontend en puerto 5173...${NC}"
cd /Users/osariii/Documents/lab2-shared-expenses/frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 4

echo ""
echo -e "${GREEN}=================================================="
echo "  APLICACIÓN LISTA"
echo "==================================================${NC}"
echo ""
echo -e "Backend:  ${GREEN}http://localhost:3000/api${NC}"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Mantener el script corriendo
wait
