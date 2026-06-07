import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from app.utils.env import ip_address




# s3 Configuration
s3_BUCKET_UNTRANSCODED = 'untranscoded'
s3_BUCKET_VIDEO_ABR = 'video-abr'


class S3:
    # Initialize the s3 client
    s3_class_client = boto3.client(
        's3',
        endpoint_url=f'http://{ip_address}:4566',  # LocalStack endpoint
        aws_access_key_id='test',  # Dummy credentials
        aws_secret_access_key='test'  # Dummy credentials
    )

    def __init__(self):
        self.s3_init()



    def s3_init(self):
        try:
            print("Initialising S3 Bucket...")
            # Step 1: Create the s3 Bucket
            self.s3_class_client.create_bucket(Bucket=s3_BUCKET_VIDEO_ABR)
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
            self.s3_class_client.put_bucket_cors(
                Bucket=s3_BUCKET_VIDEO_ABR,
                CORSConfiguration=cors_configuration
            )

            print(f"CORS configuration applied to bucket {s3_BUCKET_VIDEO_ABR}.")
        except Exception as e:
            print(e)

    def download_from_s3(self,bucket_name, object_name):
        """Download a file from s3 and handle errors."""
        local_path = f'./app/tmp/{object_name}'
        print(f"Attempting to download from s3 Bucket: {bucket_name}, Object: {object_name} to Local Path: {local_path}")

        try:
            self.s3_class_client.download_file(bucket_name, object_name, local_path)
            print(f"Downloaded {object_name} to {local_path}")
            return local_path
        
        except NoCredentialsError:
            print("Credentials not available to access s3.")

        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code in ["404", "NoSuchKey"]:
                print(f"File not found in s3: {object_name}. Please check if it exists in the bucket.")
            else:
                print(f"S3 ClientError: {e}")

        except Exception as e:
            print(f"An unexpected error occurred: {str(e)}")

        return None  # Return None if download failed

    def upload_to_s3(self,file_path, bucket_name, object_name):
        """Upload a file to s3"""
        try:
            self.s3_class_client.upload_file(file_path, bucket_name, object_name)
            print(f"Uploaded {file_path} to {bucket_name}/{object_name}")
        except Exception as e:
            print(f"Error uploading file to s3: {str(e)}")

    def delete_from_s3(self, bucket_name, object_name):
        """Delete a file from S3 and handle errors."""
        try:
            response = self.s3_class_client.delete_object(
                Bucket=bucket_name,
                Key=object_name
            )
            print(f"Deleted {object_name} from {bucket_name} Bucket")
            return response

        except NoCredentialsError:
            print("Credentials not available for S3.")
            return None

        except ClientError as e:
            print(f"S3 ClientError while deleting {object_name}: {e}")
            return None

        except Exception as e:
            print(f"Unexpected error while deleting {object_name}: {e}")
            return None