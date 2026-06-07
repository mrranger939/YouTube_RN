import os
import json
from app.utils.kafka import create_kafka_consumer,KafkaError


# Initialize Kafka consumer
consumer = create_kafka_consumer('all-errors','error-monitor')


LOG_FILE = "./logs/error_logs.jsonl" #JSONL (JSON Lines) is a file format where each line is a valid, independent JSON object, separated by newline characters


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