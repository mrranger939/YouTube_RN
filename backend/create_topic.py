import six
import sys

# Workaround for Python 3.12
if sys.version_info >= (3, 12, 0):
    sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaAdminClient
from kafka.admin import NewTopic

# Kafka server configuration
bootstrap_servers = '192.168.1.3:9092'

# Create an admin client
admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)

# Create a new topic
topic = NewTopic(name="video-uploads", num_partitions=1, replication_factor=1)

# Create the topic
admin_client.create_topics(new_topics=[topic], validate_only=False)

print("Topic created successfully")
# docker exec -it 2745b00a3f9e kafka-console-consumer --topic video-uploads --bootstrap-server 0.0.0.0:9092
# docker exec -it 2745b00a3f9e kafka-topics --delete --topic video-uploads --bootstrap-server 0.0.0.0:9092
