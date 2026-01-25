# SEFILA Setup and Run Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SEFILA - Setup & Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create backend .env if not exists
$backendEnv = @"
NODE_ENV=development
PORT=5000

# Database - Update with your MySQL credentials
DATABASE_URL="mysql://root:@localhost:3306/sefila_db"

# JWT Configuration
JWT_SECRET=sefila-super-secret-jwt-key-2026
JWT_EXPIRES_IN=7d
"@

$envPath = "backend\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    Set-Content -Path $envPath -Value $backendEnv
    Write-Host "✓ Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

# Create frontend .env if not exists
$frontendEnv = "VITE_API_BASE_URL=http://localhost:5000/api"
$frontendEnvPath = "frontend\.env"
if (-not (Test-Path $frontendEnvPath)) {
    Write-Host "Creating frontend/.env file..." -ForegroundColor Yellow
    Set-Content -Path $frontendEnvPath -Value $frontendEnv
    Write-Host "✓ Created frontend/.env" -ForegroundColor Green
} else {
    Write-Host "✓ frontend/.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before continuing, make sure you have:" -ForegroundColor Yellow
Write-Host "1. MySQL installed and running" -ForegroundColor White
Write-Host "2. Created database:" -ForegroundColor White
Write-Host "   CREATE DATABASE sefila_db;" -ForegroundColor Gray
Write-Host ""
Write-Host "Press ENTER to continue with migrations..." -ForegroundColor Yellow
Read-Host

# Generate Prisma Client
Write-Host ""
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
Set-Location backend
npm run prisma generate 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
}

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Migrations completed" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'SEFILA Backend Server' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 2
Write-Host "✓ Backend started at http://localhost:5000" -ForegroundColor Green

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'SEFILA Frontend Server' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 2
Write-Host "✓ Frontend started at http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ SEFILA is Running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Yellow
Write-Host "  Email: admin@sefila.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host "  (Create admin account via MySQL - see DATABASE_SETUP.md)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
Read-Host
