@echo off
REM Create Custom Network
docker network create youtubern

REM Start Localstack
docker run -it -d --rm --name localstack ^
  -p 4566:4566 -p 4571:4571 ^
  -e LOCALSTACK_HOSTNAME=0.0.0.0 --network youtubern ^
  localstack/localstack

@REM docker start localstack || docker run -d --name localstack --network youtubern localstack/localstack

REM Wait for 5 seconds
timeout /t 5

REM Start Zookeeper
docker run -d --rm --name zookeeper --network youtubern -p 2181:2181 zookeeper

REM Wait for 15 seconds
timeout /t 15

REM Start Kafka container in detached mode
docker run -d --rm --network youtubern -p 9092:9092 --name kafka ^
-e KAFKA_ZOOKEEPER_CONNECT=192.168.100.69:2181 ^
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.100.69:9092 ^
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
confluentinc/cp-kafka

REM Wait for services to initialize (optional)
timeout /t 15

REM Run Python script to create a Kafka topic
python ./create_topic.py

@REM REM Run Python script to create a Kafka consumer (runs indefinitely)
start cmd.exe /k python ./consumer.py

@REM REM Start Flask server (runs indefinitely)
python ./app.py
