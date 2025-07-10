@echo off
setlocal





REM ================================
REM Check if Docker is running
REM ================================
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)






REM ================================
REM Create Custom Docker Network
REM ================================
docker network inspect youtubern >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] Creating Docker network: youtubern
    docker network create youtubern
)






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




REM Wait for Zookeeper to initialize
timeout /t 15 





REM ================================
REM Start Kafka
REM ================================
echo [INFO] Starting Kafka...
docker run -d --rm --name kafka ^
  --network youtubern -p 9092:9092 ^
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 ^
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.31.119:9092 ^
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
  confluentinc/cp-kafka




REM Wait for Kafka to initialize
timeout /t 15 






REM ================================
REM Create Kafka Topic (Python)
REM ================================
echo [INFO] Creating Kafka topic...
python ./kafka/create_topic.py




REM ================================
REM Start Kafka Consumers (in new window)
REM ================================
echo [INFO] Starting Kafka Error consumer...
start cmd.exe /k python ./kafka/consumer_err.py

echo -----------------------------------------------
timeout /t 5

echo [INFO] Starting Kafka Video consumer...
start cmd.exe /k python ./kafka/consumer_vid.py





REM ================================
REM Start Flask App
REM ================================
echo [INFO] Starting Flask app...
python ./app.py

endlocal

@echo off
setlocal





REM ================================
REM Check if Docker is running
REM ================================
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)






REM ================================
REM Create Custom Docker Network
REM ================================
docker network inspect youtubern >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] Creating Docker network: youtubern
    docker network create youtubern
)






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




REM Wait for Zookeeper to initialize
timeout /t 15 





REM ================================
REM Start Kafka
REM ================================
echo [INFO] Starting Kafka...
docker run -d --rm --name kafka ^
  --network youtubern -p 9092:9092 ^
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 ^
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://172.29.240.1:9092 ^
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
  confluentinc/cp-kafka




REM Wait for Kafka to initialize
timeout /t 15 






REM ================================
REM Create Kafka Topic (Python)
REM ================================
echo [INFO] Creating Kafka topic...
python ./create_topic.py




REM ================================
REM Start Kafka Consumer (in new window)
REM ================================
echo [INFO] Starting Kafka consumer...
start cmd.exe /k python ./consumer.py






REM ================================
REM Start Flask App
REM ================================
echo [INFO] Starting Flask app...
python ./app.py

endlocal
