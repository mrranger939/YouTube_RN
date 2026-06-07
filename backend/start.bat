@echo off
setlocal


REM ================================
REM Check if CWD is Backend Directory
REM ================================

cd /d "%~dp0" || (
  echo [ERROR] Failed to switch to backend directory.
  exit /b 1
)


REM ================================
REM Check if Docker is running
REM ================================
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo [INFO] Docker is Already Running !!!..





REM ================================
REM Create Custom Docker Network
REM ================================
docker network inspect youtubern >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] Creating Docker network: youtubern
    docker network create youtubern
)

echo [INFO] Docker network: youtubern is Already Created !!!..




REM ================================
REM Start LocalStack
REM ================================
echo [INFO] Starting LocalStack...
docker run -d --rm --name localstack ^
  -p 4566:4566 -p 4571:4571 ^
  -e LOCALSTACK_HOSTNAME=0.0.0.0 ^
  --network youtubern ^
  localstack/localstack



REM Wait for LocalStack to initialize
timeout /t 5 



REM ================================
REM Start Zookeeper
REM ================================
echo [INFO] Starting Zookeeper...
docker run -d --rm --name zookeeper ^
  --network youtubern -p 2181:2181 zookeeper



echo Waiting for Zookeeper to initialize...
REM Wait for Zookeeper to initialize
timeout /t 15 



REM ================================
REM Start Kafka
REM ================================
echo [INFO] Starting Kafka...
docker run -d --rm --name kafka ^
  --network youtubern -p 9092:9092 ^
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 ^
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.4:9092 ^
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
  confluentinc/cp-kafka



echo Waiting for Kafka to initialize...
REM Wait for Kafka to initialize
timeout /t 15 



REM ================================
REM Enter kafka directory
REM ================================
@REM cd /d "%~dp0kafka" || (
@REM   echo [ERROR] Cannot enter kafka directory.
@REM   exit /b 1
@REM )





REM ================================
REM Create Kafka Topic (Python)
REM ================================
echo [INFO] Creating Kafka topic...

python -m app.kafka.create_topic

IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Kafka topic creation failed.
  exit /b 1
)




echo -----------------------------------------------
timeout /t 10


REM ================================
REM Start Kafka Consumers (in new window)
REM ================================
echo [INFO] Starting Kafka Error consumer...
@REM start cmd.exe /k python consumer_err.py
@REM start "Kafka Error Consumer" cmd.exe /k python consumer_err.py
start "Kafka Error Consumer" cmd.exe /k python -m app.kafka.consumer_err



echo -----------------------------------------------
timeout /t 10

echo [INFO] Starting Kafka Video consumer...
@REM start cmd.exe /k python consumer_vid.py
@REM start "Kafka Video Consumer" cmd.exe /k python consumer_vid.py
start "Kafka Video Consumer" cmd.exe /k python -m app.kafka.consumer_vid






REM ================================
REM Return to project root
REM ================================
cd /d "%~dp0" || (
  echo [ERROR] Failed to return to project root.
  exit /b 1
)



REM ================================
REM Start Flask App
REM ================================
echo [INFO] Starting Flask app...
python ./app.py


IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Flask app failed to start.
  exit /b 1
)


endlocal
