# Quick Database Setup Script for MySQL

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SEFILA - Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Enter MySQL password (leave empty if no password)" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

Write-Host ""
Write-Host "Creating database sefila_db..." -ForegroundColor Yellow

# Create SQL file
$sqlCommands = @"
CREATE DATABASE IF NOT EXISTS sefila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sefila_db;
SELECT 'Database sefila_db created successfully!' AS status;
"@

Set-Content -Path "create_db.sql" -Value $sqlCommands

# Execute SQL
if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) {
    mysql -u $mysqlUser < create_db.sql
} else {
    mysql -u $mysqlUser -p$mysqlPasswordPlain < create_db.sql
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created successfully!" -ForegroundColor Green
    
    # Update .env file
    Write-Host ""
    Write-Host "Updating backend/.env..." -ForegroundColor Yellow
    
    $databaseUrl = "DATABASE_URL=""mysql://$mysqlUser`:$mysqlPasswordPlain@localhost:3306/sefila_db"""
    
    $envContent = @"
NODE_ENV=development
PORT=5000

$databaseUrl

JWT_SECRET=sefila-super-secret-jwt-key-2026
JWT_EXPIRES_IN=7d
"@
    
    Set-Content -Path "backend\.env" -Value $envContent
    Write-Host "✓ backend/.env updated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    Write-Host "Please create manually using MySQL Workbench or command line" -ForegroundColor Yellow
}

# Cleanup
Remove-Item "create_db.sql" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: .\setup-and-run.ps1" -ForegroundColor White
Write-Host ""
Read-Host "Press ENTER to exit"
