import six
import sys
import time

from app.utils.env import ip_address, kafka_broker

# Workaround for Python 3.12
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import KafkaError


# Kafka server configuration
bootstrap_servers = kafka_broker


def create_kafka_admin_client(max_retries=5, retry_delay=5):
    """
    Create Kafka admin client with retry support.
    """

    for attempt in range(1, max_retries + 1):

        admin_client = None

        try:
            print(f"[INFO] Connecting to Kafka (Attempt {attempt}/{max_retries})...")

            admin_client = KafkaAdminClient(
                bootstrap_servers=bootstrap_servers
            )

            # Verify broker connection
            admin_client.list_topics()

            print("[INFO] Connected to Kafka successfully")

            return admin_client

        except KafkaError as e:

            print(f"[ERROR] Kafka connection failed: {e}")

            if admin_client is not None:
                try:
                    admin_client.close()
                except Exception:
                    pass

        except Exception as e:

            print(f"[ERROR] Unexpected connection error: {e}")

            if admin_client is not None:
                try:
                    admin_client.close()
                except Exception:
                    pass

        # Retry if attempts remain
        if attempt < max_retries:
            print(f"[INFO] Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)

    print("[ERROR] Failed to connect to Kafka after multiple attempts")

    return None



def create_topic_if_not_exists(topics):

    admin_client = create_kafka_admin_client()

    if admin_client is None:
        return False

    try:
        existing_topics = admin_client.list_topics()

        print(f"[INFO] Existing topics: {existing_topics}")

    except KafkaError as e:
        print(f"[ERROR] Failed to fetch topic list: {e}")
        try:
            admin_client.close()
        except Exception as close_err:
            print(f"[WARN] Error while closing admin client: {close_err}")
        return False

    except Exception as e:
        print(f"[ERROR] Unexpected error while listing topics: {e}")
        try:
            admin_client.close()
        except Exception as close_err:
            print(f"[WARN] Error while closing admin client: {close_err}")
        return False

    all_topics_created = True

    # Create topics if missing
    for topic_name in topics:

        if topic_name not in existing_topics:

            try:
                topic = NewTopic(
                    name=topic_name,
                    num_partitions=1,
                    replication_factor=1
                )

                admin_client.create_topics(
                    new_topics=[topic],
                    validate_only=False
                )

                print(f"[INFO] Topic '{topic_name}' created successfully")

            except KafkaError as e:
                print(f"[ERROR] Error creating topic '{topic_name}': {e}")
                all_topics_created = False

            except Exception as e:
                print(f"[ERROR] Unexpected error for topic '{topic_name}': {e}")
                all_topics_created = False

        else:
            print(f"[INFO] Topic '{topic_name}' already exists")

    try:
        admin_client.close()
    except Exception as close_err:
        print(f"[WARN] Error while closing admin client: {close_err}")

    return all_topics_created


if __name__ == "__main__":

    success = create_topic_if_not_exists([
        "video-uploads",
        "all-errors"
    ])

    if not success:
        sys.exit(1)

    sys.exit(0)

# Create a new topic for Videos
# Vtopic = NewTopic(name="video-uploads", num_partitions=1, replication_factor=1)

# # Create the topic
# admin_client.create_topics(new_topics=[Vtopic], validate_only=False)

# print("video-upload Topic created successfully")


# # Create a new topic for Errors
# Etopic = NewTopic(name="all-errors", num_partitions=1, replication_factor=1)

# # Create the topic
# admin_client.create_topics(new_topics=[Etopic], validate_only=False)

# print("all-errors Topic created successfully")



# create_topic_if_not_exists(["video-uploads","all-errors"])


# docker exec -it 2745b00a3f9e kafka-console-consumer --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092

# docker exec -it 2745b00a3f9e kafka-console-consumer --topic all-errors --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092

# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092