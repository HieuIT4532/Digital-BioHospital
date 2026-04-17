@echo off
title Digital BioHospital - Frontend Server
echo.
echo ==========================================
echo    Digital BioHospital Frontend
echo    Server is starting...
echo ==========================================
echo.

cd /d "%~dp0frontend"

:: Check for Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Using Python HTTP Server
    echo [URL] http://localhost:8080
    echo.
    start "" http://localhost:8080
    python -m http.server 8080
    goto :end
)

:: Check for Python3
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Using Python3 HTTP Server
    echo [URL] http://localhost:8080
    echo.
    start "" http://localhost:8080
    python3 -m http.server 8080
    goto :end
)

:: Check for Node.js (npx)
where npx >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Using npx http-server
    echo [URL] http://localhost:8080
    echo.
    npx -y http-server . -p 8080 -o --cors
    goto :end
)

echo [ERROR] Python or Node.js not found!
echo Please open index.html manually or install Node.js/Python.
echo.
pause

:end
