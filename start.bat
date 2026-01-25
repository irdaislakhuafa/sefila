@echo off
echo ========================================
echo SEFILA - Quick Setup Script
echo ========================================
echo.

echo Step 1: Checking MySQL...
echo NOTE: Make sure MySQL is running!
echo.

echo Step 2: Setup Backend...
cd backend
echo Installing dependencies...
call npm install
echo.

echo Generating Prisma Client...
call npx prisma generate
echo.

echo Step 3: Database Migration
echo IMPORTANT: Make sure you have:
echo   1. MySQL running
echo   2. Created database 'sefila_db'
echo   3. Updated .env with correct credentials
echo.
pause

call npx prisma migrate dev --name init
echo.

echo Step 4: Starting Backend Server...
start "SEFILA Backend" cmd /k npm run dev
echo Backend starting at http://localhost:5000
echo.

cd ..

echo Step 5: Setup Frontend...
cd frontend
echo Installing dependencies...
call npm install
echo.

echo Step 6: Starting Frontend Server...
start "SEFILA Frontend" cmd /k npm run dev
echo Frontend starting at http://localhost:5173
echo.

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause
