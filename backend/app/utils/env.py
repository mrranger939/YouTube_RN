import os
from dotenv import load_dotenv
load_dotenv()

# getting IP 
ip_address = os.getenv('IP_ADD')

if not ip_address:
    raise RuntimeError("Missing required environment variable: IP_ADD")

# getting KAFKA IP ADDRESS
kafka_broker = os.getenv('KAFKA_BROKER')

if not kafka_broker:
    raise RuntimeError("Missing required environment variable: KAFKA_BROKER")

# getting GPU Config 
gpu_config = os.getenv('GPU')

if not gpu_config:
    raise RuntimeError("Missing required environment variable or Invalid: GPU")
