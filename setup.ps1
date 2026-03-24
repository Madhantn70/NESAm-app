$ErrorActionPreference = "Stop"

$currentDir = Get-Location

Write-Host "Starting NeSAM System Bootstrap..." -ForegroundColor Cyan

# 1. Start Database
Write-Host "Starting PostgreSQL and pgAdmin via Docker Compose..." -ForegroundColor Yellow
Set-Location "$currentDir\nesam-api\nesam"
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start database containers."
    exit 1
}

# Wait for healthy DB
Write-Host "Waiting 10 seconds for PostgreSQL to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 2. Build Backend
Write-Host "Building Spring Boot Backend..." -ForegroundColor Yellow
.\gradlew clean build -x test
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend build failed."
    exit 1
}

# 3. Build & Install Frontend
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$currentDir\reactjs-starter\reactjs-starter"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend npm install failed."
    exit 1
}

# 4. Starting Services
Write-Host "Starting Backend Service..." -ForegroundColor Yellow
Set-Location "$currentDir\nesam-api\nesam"
Start-Process powershell -ArgumentList "-NoExit -Command .\gradlew bootRun" -WindowStyle Normal

Write-Host "Starting Frontend Service..." -ForegroundColor Yellow
Set-Location "$currentDir\reactjs-starter\reactjs-starter"
Start-Process powershell -ArgumentList "-NoExit -Command npm run dev" -WindowStyle Normal

Write-Host "======================================" -ForegroundColor Green
Write-Host "SYSTEM BOOTSTRAP COMPLETE" -ForegroundColor Green
Write-Host "Backend API Docs: http://localhost:9090/swagger-ui/index.html"
Write-Host "Frontend App:    http://localhost:5173"
Write-Host "pgAdmin Console: http://localhost:8080 (admin@example.com / secretpassword)"
Write-Host "======================================" -ForegroundColor Green
Set-Location $currentDir
