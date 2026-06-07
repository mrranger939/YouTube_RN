import os

import shutil
from datetime import datetime

from app.kafka.Error_producer import send_error
from app.utils.kafka import create_kafka_consumer, KafkaError
from app.utils.s3 import S3,s3_BUCKET_VIDEO_ABR,s3_BUCKET_UNTRANSCODED
from app.utils.hls import generate_hls,gpu_config


# Initialize Kafka consumer
consumer = create_kafka_consumer('video-uploads','video-consumers')
s3_client_obj = S3()

def process_videos():
    """Main function to process videos from Kafka."""
    
    try:
        for message in consumer:
            try:

                print(f"Kafka message received: {message.value}")
                video_file = message.value.get('filename')

                if not video_file:
                    send_error("___","Kafka message does not contain 'filename'. Skipping message.",__file__)
                    print("Error: Kafka message does not contain 'filename'. Skipping message.")
                    continue


                onlyname=video_file.removesuffix('.'+video_file.split('.')[-1])

                print(f"Processing {video_file}")

                # Download the video file from s3
                local_video_path = s3_client_obj.download_from_s3(s3_BUCKET_UNTRANSCODED, video_file)

                if not local_video_path:
                    send_error(video_file,f"Failed to download {video_file}. Skipping.",__file__)
                    print(f"Failed to download {video_file}. Skipping.")
                    continue
                    
                    
                    
                start_t=datetime.now()
                print(f"\n\n Start Time: {start_t} \n\n")


                # Generate HLS files
                hls_dir,err = generate_hls(local_video_path)


                end_t=datetime.now()
                print(f"\n\n End Time: {end_t} \n\n")
                print(f"\n\n Total Time: {end_t - start_t} \n\n")

                if err:
                    print(err)

                    send_error(video_file,err,__file__)

                    input("Press Enter to Continue ... ")

                    shutil.rmtree(hls_dir)

                    # os.remove(hls_dir)
                    os.remove(local_video_path)

                    print(f"\n\nSuccessfully deleted video : {local_video_path} and folder : {hls_dir} from local storage \n\n\n")
                    continue            
                    
                if not hls_dir:
                    send_error(video_file,f"Failed to generate HLS for {video_file}. Skipping.",__file__)
                    print(f"Failed to generate HLS for {video_file}. Skipping.")
                    os.remove(local_video_path)
                    print(f"\n\nDeleted local copy of video : {local_video_path}")

                    continue

                # Upload HLS files to S3 — track any failures
                failed_uploads = []
                for root, _, files in os.walk(hls_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        relative_path = os.path.relpath(file_path, hls_dir)
                        s3_key = f"{onlyname}/{relative_path}"
                        ok = s3_client_obj.upload_to_s3(file_path, s3_BUCKET_VIDEO_ABR, s3_key)
                        if not ok:
                            failed_uploads.append(s3_key)

                if failed_uploads:
                    err_msg = f"Upload failed for {len(failed_uploads)} file(s): {failed_uploads}"
                    print(f"Aborting cleanup — source object preserved.\n{err_msg}")
                    send_error(video_file, err_msg, __file__)
                    # Do NOT delete local or remote source; skip to next message
                    continue

                print(f"Processed and uploaded HLS files for {video_file}.")
                print("\n\n\n\n",hls_dir)
                shutil.rmtree(hls_dir)

                # os.remove(hls_dir)
                os.remove(local_video_path)

                print(f"\n\nSuccessfully deleted local copy of video : {local_video_path} and folder : {hls_dir} from local storage")


                try:
                    response = s3_client_obj.delete_from_s3(
                        s3_BUCKET_UNTRANSCODED,
                        video_file
                    )

                    if response:
                        print(f"Object {video_file} deleted successfully.\n\n")
                        print(response)
                    else:
                        raise Exception("Delete failed")

                except Exception as e:
                    send_error(
                        video_file,
                        f"Error occurred while deleting the object: {e}",
                        __file__
                    )
                    print(f"Error occurred while deleting the object: {e}")
        
            except Exception as e:
                print(f"Unhandled error processing message {message.value}: {e}")
                send_error(
                    message.value.get('filename', '___'),
                    f"Unhandled error: {e}",
                    __file__
                )
            

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
    
    relative_file_path="./app/tmp"
    if not os.path.isdir(relative_file_path):
        # If it's not a directory, create it
        os.makedirs(relative_file_path)
        print("Folder /tmp created.")
    else:
        print("Folder /tmp already exists.")
   
   
    print("🚦Video Consumer is starting...\n")
    
    # print("ℹ️ GPU config: ",{"CPU" if gpu_config==None else gpu_config})
    print(f"ℹ️ GPU config: {{{'CPU' if gpu_config is None else gpu_config}}}")
   
    process_videos()
   
    print("🛑Video Consumer is Ending...")
