from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable,KafkaError
import json
import time
from app.utils.env import ip_address

def create_kafka_consumer(topic :str,groupid :str):
    for _ in range(5):  # Retry up to 5 times
        try:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=f'{ip_address}:9092',
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id=groupid,
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            print(f"Kafka consumer for Topic : {{{topic}}} & in Group : {{{groupid}}} initialized.")
            return consumer
        except NoBrokersAvailable:
            print("Kafka broker not available. Retrying in 5 seconds...")
            time.sleep(5)
    raise Exception("Kafka broker is not available after multiple attempts.")
