@echo off
title Digital BioHospital - Backend Server
echo.
echo ==========================================
echo    Digital BioHospital Backend API
echo    Server is starting...
echo ==========================================
echo.

cd /d "%~dp0backend"

:: Check Node.js
where node >nul 2>&1
if %errorlevel% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Please install it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Check .env
if not exist ".env" (
    echo [INFO] .env file not found. Creating from example...
    copy ".env.example" ".env" >nul
    echo [OK] .env created. 
    echo Please edit .env and add your GEMINI_API_KEY.
    notepad ".env"
    pause
    exit /b 0
)

:: Check dependencies
if not exist "node_modules" (
    echo [INFO] Installing dependencies (npm install)...
    call npm install
    if %errorlevel% NEQ 0 (
        echo [ERROR] Installation failed. Check your internet.
        pause
        exit /b 1
    )
)

:: Get Port
set PORT=5000
for /f "tokens=2 delims==" %%a in ('findstr "PORT=" .env 2^>nul') do set PORT=%%a

echo [OK] Node.js is ready.
echo [URL] http://localhost:%PORT%
echo.

:: Run server
where nodemon >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Starting with nodemon...
    nodemon server.js
) else (
    echo [OK] Starting with node...
    node server.js
)

pause
