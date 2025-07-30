import os
import json
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable,KafkaError
from dotenv import load_dotenv
import time

load_dotenv()
# getting IP 
ip_address = os.getenv('IP_ADD')


def create_kafka_consumer():
    for _ in range(5):  # Retry up to 5 times
        try:
            consumer = KafkaConsumer(
                'all-errors',
                bootstrap_servers=f'{ip_address}:9092',
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id='error-monitor',
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            print("Kafka consumer initialized.")
            return consumer
        except NoBrokersAvailable:
            print("Kafka broker not available. Retrying in 5 seconds...")
            time.sleep(5)
    raise Exception("Kafka broker is not available after multiple attempts.")




# Initialize Kafka consumer
consumer = create_kafka_consumer()


LOG_FILE = "./logs/error_logs.jsonl"


def process_errors():
    try:
        for message in consumer:
            error = message.value

            # Extract fields safely
            source = error.get('source', 'unknown')
            filename = error.get('filename', 'unknown')
            error_msg = error.get('error', 'unspecified error')
            timestamp = error.get('timestamp', 'unknown')

            # Truncate error message for console display
            display_error_msg = (error_msg[:97] + '...') if len(error_msg) > 100 else error_msg

            # Console output (shortened)
            formatted = (
                f"🚨 [ERROR RECEIVED]\n"
                f"🕒 Timestamp: {timestamp}"
                f"🧩 Source: {source}\n"
                f"🎞️  Filename: {filename}\n"
                f"❌ Error: {display_error_msg}\n"
            )

            # Full log to file
            log_entry = {
                "🕒_Timestamp": timestamp,
                "🧩_Source": source,
                "🎞️_Filename": filename,
                "❌_Error": error_msg  # full error retained
            }

            try:
                os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)  # ✅ Create ./logs if it doesn't exist
                with open(LOG_FILE, "a", encoding="utf-8") as f:
                    json.dump(log_entry, f, ensure_ascii=False)
                    f.write("\n")
            except Exception as e:
                print(f"⚠️ Failed to write to log file: {e}")

            print("\n\n", formatted, "\n\n")
    
    except KeyboardInterrupt:
        print("🛑 Error consumer interrupted by user (Ctrl+C). Shutting down gracefully.")
    
    except KafkaError as e:
        print(f"Kafka error: {e}")
    
    except Exception as e:
        print(f"Unhandled error during Kafka consumption: {e}")
    
    finally:
        print("hello")
        consumer.close()


if __name__ == '__main__':
    print("🚦 Error consumer is starting...")
    process_errors()
    # time.sleep(5)
    print("🚦 Error consumer has Ended 5 seconds Ago...")