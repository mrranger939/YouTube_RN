@echo off
setlocal EnableDelayedExpansion

title YouTube_RN Startup Manager

echo.
echo ============================================================
echo                YouTube_RN Startup Manager
echo ============================================================
echo.

REM ============================================================
REM CHECK DOCKER
REM ============================================================

echo ============================================================
echo [STEP 1/10] Checking Docker Status
echo ============================================================

docker info >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Docker is not running.
    echo [ERROR] Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Docker is running.
echo.

REM ============================================================
REM MOVE TO PROJECT ROOT
REM ============================================================

cd /d "%~dp0"

echo ============================================================
echo [STEP 2/10] Detecting Local IP Address
echo ============================================================

set "IP_ADDR="

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set "TMP=%%a"
    set "TMP=!TMP: =!"
    if not defined IP_ADDR (
        set "IP_ADDR=!TMP!"
    )
)

if not defined IP_ADDR (
    echo [ERROR] Failed to detect IPv4 Address.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Detected IP Address:
echo.
echo     %IP_ADDR%
echo.

REM ============================================================
REM START FLOCI
REM ============================================================

echo ============================================================
echo [STEP 3/10] Starting Floci
echo ============================================================

echo [INFO] Removing existing Floci container if present...

docker rm -f floci >nul 2>&1

echo [INFO] Launching Floci terminal...

start "Floci" cmd /k "echo Starting Floci... && docker run --name floci -p 4566:4566 floci/floci:1.5.27"

echo [SUCCESS] Floci terminal launched.
echo.

REM ============================================================
REM START KAFKA
REM ============================================================

echo ============================================================
echo [STEP 4/10] Starting Kafka
echo ============================================================

echo [INFO] Removing existing Kafka container if present...

docker rm -f kafka >nul 2>&1

echo [INFO] Launching Kafka terminal...
echo [INFO] Kafka advertised listener:
echo.
echo     PLAINTEXT://%IP_ADDR%:9092
echo.

start "Kafka" cmd /k "docker run --name kafka -p 9092:9092 -e KAFKA_PROCESS_ROLES=broker,controller -e KAFKA_NODE_ID=1 -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://%IP_ADDR%:9092 -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 -e KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0 confluentinc/cp-kafka"

echo [SUCCESS] Kafka terminal launched.
echo.

REM ============================================================
REM WAIT FOR CONTAINERS
REM ============================================================

echo ============================================================
echo [STEP 5/10] Waiting For Services
echo ============================================================

echo [INFO] Waiting 20 seconds for Kafka and Floci startup...
echo.

timeout /t 20 /nobreak

echo.
echo [SUCCESS] Wait completed.
echo.

REM ============================================================
REM UPDATE BACKEND ENV
REM ============================================================

echo ============================================================
echo [STEP 6/10] Updating Backend Configuration
echo ============================================================

set "BACKEND_ENV=%~dp0backend\.env"

echo [INFO] Backend .env path:
echo     %BACKEND_ENV%
echo.

if not exist "%BACKEND_ENV%" (
    echo [ERROR] backend\.env not found.
    pause
    exit /b 1
)

powershell -NoProfile -Command "(Get-Content '%BACKEND_ENV%') -replace '^IP_ADD=.*', 'IP_ADD=%IP_ADDR%' | Set-Content '%BACKEND_ENV%'"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to update backend .env
    pause
    exit /b 1
)

echo [SUCCESS] Backend .env updated.
echo [SUCCESS] IP_ADD=%IP_ADDR%
echo.

REM ============================================================
REM CREATE TOPICS
REM ============================================================

echo ============================================================
echo [STEP 7/10] Creating Kafka Topics
echo ============================================================

cd /d "%~dp0backend\kafka"

echo [INFO] Current Directory:
echo     %CD%
echo.

echo [INFO] Running create_topic.py...
echo.

py create_topic.py

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Topic creation failed.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Kafka topics created successfully.
echo.

REM ============================================================
REM START CONSUMER
REM ============================================================

echo ============================================================
echo [STEP 8/10] Starting Kafka Consumer
echo ============================================================

start "Kafka Consumer" cmd /k "cd /d ""%~dp0backend\kafka"" && echo Starting Consumer... && py consumer_vid.py"

echo [SUCCESS] Consumer terminal launched.
echo.

REM ============================================================
REM UPDATE NODE BACKEND ENV
REM ============================================================

echo ============================================================
echo [STEP 9/10] Starting Node Backend
echo ============================================================

set "NODE_ENV=%~dp0nodeBackend\services\web-api\.env"

echo [INFO] Node Backend .env path:
echo     %NODE_ENV%
echo.

if not exist "%NODE_ENV%" (
    echo [ERROR] nodeBackend\services\web-api\.env not found.
    pause
    exit /b 1
)

powershell -NoProfile -Command "(Get-Content '%NODE_ENV%') -replace '^IP_ADD=.*', 'IP_ADD=%IP_ADDR%' | Set-Content '%NODE_ENV%'"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to update Node Backend .env
    pause
    exit /b 1
)

echo [SUCCESS] Node Backend .env updated.
echo [SUCCESS] IP_ADD=%IP_ADDR%
echo.

start "Node Backend" cmd /k "cd /d ""%~dp0nodeBackend\services\web-api"" && echo Starting Node Backend... && npm run dev"

echo [SUCCESS] Node Backend terminal launched.
echo.

echo [INFO] Waiting 5 seconds before frontend startup...
timeout /t 5 /nobreak >nul

echo.

REM ============================================================
REM UPDATE FRONTEND ENV
REM ============================================================

echo ============================================================
echo [STEP 10/10] Updating Frontend Configuration
echo ============================================================

set "FRONTEND_ENV=%~dp0frontend\.env"

echo [INFO] Frontend .env path:
echo     %FRONTEND_ENV%
echo.

if not exist "%FRONTEND_ENV%" (
    echo [ERROR] frontend\.env not found.
    pause
    exit /b 1
)

powershell -NoProfile -Command "(Get-Content '%FRONTEND_ENV%') -replace '^VITE_IP_ADD=.*', 'VITE_IP_ADD=%IP_ADDR%' | Set-Content '%FRONTEND_ENV%'"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to update frontend .env
    pause
    exit /b 1
)

echo [SUCCESS] Frontend .env updated.
echo [SUCCESS] VITE_IP_ADD=%IP_ADDR%
echo.

REM ============================================================
REM START FRONTEND
REM ============================================================

echo ============================================================
echo Starting Frontend
echo ============================================================

cd /d "%~dp0frontend"

echo.
echo ============================================================
echo Startup Summary
echo ============================================================
echo.
echo IP Address      : %IP_ADDR%
echo.
echo Terminal 1      : Floci
echo Terminal 2      : Kafka
echo Terminal 3      : Kafka Consumer
echo Terminal 4      : Node Backend
echo Terminal 5      : Frontend (Current Window)
echo.
echo Backend ENV     : Updated
echo Node ENV        : Updated
echo Frontend ENV    : Updated
echo.
echo ============================================================
echo All startup tasks completed successfully.
echo ============================================================
echo.

call npm run dev

set EXIT_CODE=%ERRORLEVEL%

echo.
echo Frontend exited with code %EXIT_CODE%
echo.

endlocal & exit /b %EXIT_CODE%