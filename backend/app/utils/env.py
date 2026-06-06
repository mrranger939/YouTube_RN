import os
from dotenv import load_dotenv
load_dotenv()

# getting IP 
ip_address = os.getenv('IP_ADD')

if not ip_address:
    raise RuntimeError("Missing required environment variable: IP_ADD")

# getting GPU Config 
gpu_config = os.getenv('GPU')

if not gpu_config:
    raise RuntimeError("Missing required environment variable or Invalid: GPU")
