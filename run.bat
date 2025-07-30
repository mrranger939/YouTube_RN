@echo off
setlocal

docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

REM ================================
REM Start Backend (in new window)
REM ================================

start cmd.exe /k "cd backend && start.bat"



REM ================================
REM Start Frontend (in new window)
REM ================================

cd ./frontend

npm run dev

endlocal