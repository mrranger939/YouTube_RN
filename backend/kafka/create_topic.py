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

# Kafka server configuration
bootstrap_servers = f'{ip_address}:9092'

# Create an admin client
admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)

# Create a new topic for Videos
Vtopic = NewTopic(name="video-uploads", num_partitions=1, replication_factor=1)

# Create the topic
admin_client.create_topics(new_topics=[Vtopic], validate_only=False)

print("video-upload Topic created successfully")


# Create a new topic for Errors
Etopic = NewTopic(name="all-errors", num_partitions=1, replication_factor=1)

# Create the topic
admin_client.create_topics(new_topics=[Etopic], validate_only=False)

print("all-errors Topic created successfully")


# docker exec -it 2745b00a3f9e kafka-console-consumer --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092

# docker exec -it 2745b00a3f9e kafka-console-consumer --topic all-errors --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092

# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it eb45b8c697c3fe1a5930c7069b21e960d8b4f1370d41ceb666a4327fb469b6c7 kafka-topics --delete --topic all-errors --bootstrap-server 0.0.0.0:9092