@echo off
echo ========================================
echo   Starting Celestral Backend Server
echo ========================================
echo.

cd server

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server in development mode...
echo.
call npm run dev
