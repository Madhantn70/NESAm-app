#!/bin/bash
set -e

ROOT_DIR=$(pwd)

echo -e "\033[36mStarting NeSAM System Bootstrap...\033[0m"

# 1. Start Database
echo -e "\033[33mStarting PostgreSQL and pgAdmin via Docker Compose...\033[0m"
cd "$ROOT_DIR/nesam-api/nesam"
docker-compose up -d

echo -e "\033[33mWaiting 10 seconds for PostgreSQL to initialize...\033[0m"
sleep 10

# 2. Build Backend
echo -e "\033[33mBuilding Spring Boot Backend...\033[0m"
./gradlew clean build -x test

# 3. Build & Install Frontend
echo -e "\033[33mInstalling Frontend Dependencies...\033[0m"
cd "$ROOT_DIR/reactjs-starter/reactjs-starter"
npm install

# 4. Starting Services
echo -e "\033[33mStarting Services in background...\033[0m"
cd "$ROOT_DIR/nesam-api/nesam"
./gradlew bootRun &
BACKEND_PID=$!

cd "$ROOT_DIR/reactjs-starter/reactjs-starter"
npm run dev &
FRONTEND_PID=$!

echo -e "\033[32m======================================\033[0m"
echo -e "\033[32mSYSTEM BOOTSTRAP COMPLETE\033[0m"
echo "Backend API Docs: http://localhost:9090/swagger-ui/index.html"
echo "Frontend App:     http://localhost:5173"
echo "pgAdmin Console:  http://localhost:8080 (admin@example.com / secretpassword)"
echo -e "\033[32m======================================\033[0m"

wait
