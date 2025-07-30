import six
import sys
from dotenv import load_dotenv
import os
load_dotenv()
ip_address = os.getenv('IP_ADD')
# Workaround for Python 3.12
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import KafkaError

# Kafka server configuration
bootstrap_servers = f'{ip_address}:9092'

# Create an admin client
admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)


# Function to create topics
def create_topic_if_not_exists(topics):
    existing_topics = admin_client.list_topics()
    print(f"existing topics : {existing_topics} ")
    for i in topics:
        if i not in existing_topics:
            try :
                # Create a new topic for Videos
                topic = NewTopic(name=i, num_partitions=1, replication_factor=1)

                # Create the topic
                admin_client.create_topics(new_topics=[topic], validate_only=False)

                print(f"Topic : {i} created successfully")
            except KafkaError as e:
                print(f"Error creating topic '{i}': {e}")
            
        else:
            print(f"Topic : {i} already exists")



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



create_topic_if_not_exists(["video-uploads","all-errors"])


# docker exec -it 2745b00a3f9e kafka-console-consumer --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092

# docker exec -it 2745b00a3f9e kafka-console-consumer --topic all-errors --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092

# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092