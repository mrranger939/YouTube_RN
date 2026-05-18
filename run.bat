@echo off
setlocal

REM ================================
REM Check Docker
REM ================================
docker info >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running.
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM ================================
REM Move to script directory
REM ================================
cd /d "%~dp0" || (
    echo [ERROR] Failed to access project directory.
    exit /b 1
)

REM ================================
REM Start Backend
REM ================================
echo [INFO] Starting Backend...

IF NOT EXIST "backend\start.bat" (
    echo [ERROR] backend\start.bat not found.
    exit /b 1
)

start "Backend" cmd.exe /k "cd /d "%~dp0backend\" && start.bat"

REM ================================
REM Start Frontend
REM ================================
echo [INFO] Starting Frontend...

cd /d "%~dp0frontend" || (
    echo [ERROR] Cannot enter frontend directory.
    exit /b 1
)

IF NOT EXIST "package.json" (
    echo [ERROR] package.json not found in frontend directory.
    exit /b 1
)

npm run dev

set "EXIT_CODE=%ERRORLEVEL%"

IF %EXIT_CODE% NEQ 0 (
    echo [ERROR] Frontend failed to start.
)

endlocal & exit /b %EXIT_CODE%