@REM @echo 



@REM ================================
@REM Start Zookeeper
@REM ================================
echo [INFO] Starting Zookeeper...
docker run -d --rm --name zookeeper ^
  --network youtubern -p 2181:2181 zookeeper




@REM Wait for Zookeeper to initialize
timeout /t 15 





@REM ================================
@REM Start Kafka
@REM ================================
echo [INFO] Starting Kafka...
docker run -d --rm --name kafka ^
  --network youtubern -p 9092:9092 ^
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 ^
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.31.119:9092 ^
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
  confluentinc/cp-kafka



timeout /t 15

@@REM @REM Run Python script to create a Kafka topic
python ./create_topic.py

@REM Run Python script to create a Kafka consumer (runs indefinitely)
start cmd.exe /k python ./consumer.py

@REM Start Flask server (runs indefinitely)
python ./app.py
