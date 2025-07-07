@echo off
@REM timeout /t 15

@REM REM Run Python script to create a Kafka topic
@REM python ./create_topic.py

REM Run Python script to create a Kafka consumer (runs indefinitely)
start cmd.exe /k python ./consumer.py

REM Start Flask server (runs indefinitely)
python ./app.py
