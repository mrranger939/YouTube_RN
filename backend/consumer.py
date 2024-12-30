import os
import boto3
import subprocess
import json
from kafka import KafkaConsumer
from botocore.exceptions import NoCredentialsError
import shutil
from datetime import datetime

# s3 Configuration
s3_BUCKET_UNTRANSCODED = 'untranscoded'
s3_BUCKET_VIDEO_ABR = 'video-abr'

# Initialize the s3 client
s3_client = boto3.client(
    's3',
    endpoint_url='http://localhost:4566',  # LocalStack endpoint
    aws_access_key_id='test',  # Dummy credentials
    aws_secret_access_key='test'  # Dummy credentials
)

def s3_init():
    try:
        print("Initialising S3 Bucket...")
        # Step 1: Create the s3 Bucket
        s3_client.create_bucket(Bucket=s3_BUCKET_VIDEO_ABR)

        # Step 2: Define the CORS Configuration
        cors_configuration = {
            'CORSRules': [
                {
                    'AllowedOrigins': ['*'],
                    'AllowedMethods': ['GET'],  # Only allow GET for video access
                    'AllowedHeaders': ['*'],
                    'ExposeHeaders': ['Content-Type', 'Content-Length'],
                    'MaxAgeSeconds': 3000
                }
            ]
        }

        # Step 3: Apply the CORS configuration to the s3 Bucket
        s3_client.put_bucket_cors(
            Bucket=s3_BUCKET_VIDEO_ABR,
            CORSConfiguration=cors_configuration
        )

        print(f"CORS configuration applied to bucket {s3_BUCKET_VIDEO_ABR}.")
    except Exception as e:
        print(e)

# Initialize Kafka consumer
consumer = KafkaConsumer(
    'video-uploads',
    bootstrap_servers='192.168.1.3:9092',
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='video-consumers',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

def download_from_s3(bucket_name, object_name):
    """Download a file from s3 and handle errors."""
    local_path = f'./tmp/{object_name}'
    print(f"Attempting to download from s3 Bucket: {bucket_name}, Object: {object_name} to Local Path: {local_path}")

    try:
        s3_client.download_file(bucket_name, object_name, local_path)
        print(f"Downloaded {object_name} to {local_path}")
        return local_path
    except FileNotFoundError:
        print(f"File not found in s3: {object_name}. Please check if it exists in the bucket.")
    except NoCredentialsError:
        print("Credentials not available to access s3.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

    return None  # Return None if download failed

def upload_to_s3(file_path, bucket_name, object_name):
    """Upload a file to s3"""
    try:
        s3_client.upload_file(file_path, bucket_name, object_name)
        print(f"Uploaded {file_path} to {bucket_name}/{object_name}")
    except Exception as e:
        print(f"Error uploading file to s3: {str(e)}")

def generate_hls(input_file):
    """Generate HLS playlist and segments using FFmpeg."""
    output_dir = f"./tmp/{os.path.splitext(os.path.basename(input_file))[0]}_hls"
    os.makedirs(output_dir, exist_ok=True)

    print(output_dir)
    try:
         # Transcoding video to multiple resolutions for ABR
        resolutions = {
            "360p": {"scale": "640:360", "video_bitrate": "800k", "audio_bitrate": "128k"},
            "720p": {"scale": "1280:720", "video_bitrate": "2500k", "audio_bitrate": "128k"},
            "1080p": {"scale": "1920:1080", "video_bitrate": "4500k", "audio_bitrate": "192k"}
        }

        playlists = []

        for resolution, settings in resolutions.items():
            output_m3u8 = f"{output_dir}/{resolution}.m3u8"
            command = (
                f"ffmpeg -i {input_file} -vf scale={settings['scale']} -c:a aac -ar 48000 "
                f"-b:a {settings['audio_bitrate']} -c:v h264 -profile:v main -crf 20 "
                f"-sc_threshold 0 -g 48 -keyint_min 48 -hls_time 10 -hls_playlist_type vod "
                f"-b:v {settings['video_bitrate']} -maxrate {settings['video_bitrate']} -bufsize 2000k "
                f"-hls_segment_filename {output_dir}/{resolution}_%03d.ts {output_m3u8}"
            )
            print(f"Running command: {command}")  # Debugging
            process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            if process.returncode != 0:
                print(f"Error creating {resolution}: {process.stderr}")
                return f"FFmpeg error for {resolution}: {process.stderr}"

            playlists.append(f"#EXT-X-STREAM-INF:BANDWIDTH={settings['video_bitrate'].strip('k')}000,RESOLUTION={settings['scale']}\n{resolution}.m3u8")

        # Create a master playlist
        master_playlist_path = os.path.join(output_dir, "master.m3u8")
        with open(master_playlist_path, 'w') as master_playlist:
            master_playlist.write("#EXTM3U\n")
            master_playlist.write("\n".join(playlists))
            
        if os.path.exists(master_playlist_path):
            print(f"HLS playlist generated: {master_playlist_path}")
            return output_dir
        else:
            print("Error: HLS playlist not generated.")
    except Exception as e:
        print(f"Error during HLS generation: {str(e)}")

    return None

def process_videos():
    """Main function to process videos from Kafka."""
    
    for message in consumer:
        print(f"Kafka message received: {message.value}")
        video_file = message.value.get('filename')
        
        onlyname=video_file.removesuffix('.'+video_file.split('.')[-1])

        if not video_file:
            print("Error: Kafka message does not contain 'filename'. Skipping message.")
            continue

        print(f"Processing {video_file}")

        # Download the video file from s3
        local_video_path = download_from_s3(s3_BUCKET_UNTRANSCODED, video_file)

        if not local_video_path:
            print(f"Failed to download {video_file}. Skipping.")
            continue
        
        start_t=datetime.now()
        print(f"\n\n Start Time: {start_t} \n\n")
        # Generate HLS files
        hls_dir = generate_hls(local_video_path)
        end_t=datetime.now()
        print(f"\n\n End Time: {end_t} \n\n")
        print(f"\n\n Total Time: {end_t - start_t} \n\n")
        
        if not hls_dir:
            print(f"Failed to generate HLS for {video_file}. Skipping.")
            continue

        # Upload HLS files to s3
        for root, _, files in os.walk(hls_dir):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, hls_dir)
                upload_to_s3(file_path, s3_BUCKET_VIDEO_ABR, f"{onlyname}/{relative_path}")

        print(f"Processed and uploaded HLS files for {video_file}.")
        
        shutil.rmtree(hls_dir)

        # os.remove(hls_dir)
        os.remove(local_video_path)

        print(f"\n\nSuccessfully deleted video : {local_video_path} and folder : {hls_dir} from local storage")
        
        try:
            response = s3_client.delete_object(Bucket=s3_BUCKET_UNTRANSCODED, Key=video_file)
            print(f"Object {video_file} has been deleted successfully from bucket {s3_BUCKET_UNTRANSCODED}.\n\n")
            print(response)
        except Exception as e:
            print(f"Error occurred while deleting the object: {e}")

if __name__ == '__main__':
    if not os.path.isdir("./tmp"):
        # If it's not a directory, create it
        os.makedirs("./tmp")
        print("Folder /tmp created.")
    else:
        print("Folder /tmp already exists.")
    s3_init()
    print("Consumer is starting...")
    process_videos()
