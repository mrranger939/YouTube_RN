from kafka import KafkaProducer
from datetime import datetime , timezone
import json
from app.utils.env import ip_address

producer = KafkaProducer(
    bootstrap_servers=f'{ip_address}:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_error(filename, error_msg, source):
    producer.send('all-errors', {
        'source': source,
        'filename': filename,
        'error': error_msg,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })
    producer.flush()
