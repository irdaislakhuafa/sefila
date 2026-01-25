# SEFILA - Simple Start Script
Write-Host "SEFILA Setup Starting..." -ForegroundColor Cyan

# Create backend .env
$backendEnv = "NODE_ENV=development`nPORT=5000`n`nDATABASE_URL=`"mysql://root:@localhost:3306/sefila_db`"`n`nJWT_SECRET=sefila-super-secret-jwt-key-2026`nJWT_EXPIRES_IN=7d"
Set-Content -Path "backend\.env" -Value $backendEnv -Force
Write-Host "Created backend/.env" -ForegroundColor Green

# Create frontend .env  
Set-Content -Path "frontend\.env" -Value "VITE_API_BASE_URL=http://localhost:5000/api" -Force
Write-Host "Created frontend/.env" -ForegroundColor Green

Write-Host "`nStarting servers..." -ForegroundColor Yellow
Write-Host "Backend will run on http://localhost:5000" -ForegroundColor White
Write-Host "Frontend will run on http://localhost:5173" -ForegroundColor White
Write-Host "`nMake sure MySQL is running and database 'sefila_db' exists!" -ForegroundColor Yellow

# Start servers in new windows
Start-Process powershell -ArgumentList "-NoExit -Command cd '$PWD\backend'; npm run dev"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit -Command cd '$PWD\frontend'; npm run dev"

Write-Host "`nServers starting in separate windows..." -ForegroundColor Green
