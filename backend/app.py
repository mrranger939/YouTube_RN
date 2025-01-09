  # !!! NOTE !!!
# Install all the Libraries by running the command : pip install -r req.txt
from dotenv import load_dotenv
import os
load_dotenv()

from flask import Flask, request, jsonify, redirect, g
from flask_cors import CORS

# import gridfs
from bson import ObjectId
# import io


# getting IP 
ip_address = os.getenv('IP_ADD')
local_frontend_url = f"http://localhost:5173"
frontend_url = f"http://{ip_address}:5173"
print(frontend_url)

# MongoDB Libraires
from pymongo import MongoClient

# Kaka Libraries
from kafka import KafkaProducer
import json

# AWS Libraries
import boto3 # Boto3 is (AWS)'s Software Development Kit (SDK) for Python
from botocore.exceptions import NoCredentialsError #Exception raised when Signing in S3

# below are required for generating Unique ID
from werkzeug.utils import secure_filename
import string
import hashlib
import time
import random

from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta,timezone
from functools import wraps
app = Flask(__name__)
CORS(app,supports_credentials=True,origins=[frontend_url,local_frontend_url])
app.config['JWT_SECRET_KEY'] = "your_secret_key"
bcrypt = Bcrypt(app)

""" middle ware """

def optional_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if token:
            try:
                decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
                user_id = decoded.get('user_id')
                username = decoded.get('username')  
                v_id = decoded.get('vid')
                kwargs['user_id'] = user_id
                kwargs['username'] = username
                kwargs['vid'] = v_id
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                kwargs['user_id'] = None
                kwargs['username'] = 'Guest'
                kwargs['vid'] = 'https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?t=st=1735644828~exp=1735648428~hmac=8ba2c46028f37515cb8e51613746e5b23aaf913b99bbfd2cc807e474d883acc6&w=740'
        else:
            kwargs['user_id'] = None
            kwargs['username'] = 'Guest'

        return f(*args, **kwargs)

    return decorated

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        print(token)
        if not token or not token.startswith("Bearer "):
            return jsonify({"error": "Token is missing"}), 401
        token = token.split(" ")[1]
        print(token)
        try:
            decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            g.user_id = decoded['user_id']
            g.username = decoded['username']
            g.vid = decoded['vid']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


""" middle ware """

""" database connection """
mgdb_client = MongoClient("mongodb://localhost:27017/")
db = mgdb_client['YoutubeRN']
VIDEOS=db.get_collection("videos")
PROFILES = db.get_collection("users")
CHANNELS = db.get_collection("channels")
# db = client['image_uploads']
# fs = gridfs.GridFS(db)
# allids = db.get_collection('allids')
""" database connection """


# Kafka configuration
KAFKA_TOPIC = 'video-uploads'
KAFKA_BOOTSTRAP_SERVER = f'{ip_address}:9092'

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVER,
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)




# S3 configuration
S3_U_BUCKET = 'untranscoded'
S3_I_BUCKET = 'thumbnail'
S3_V_BUCKET = 'video-abr'
S3_X_BUCKET = 'profiles'
LOCALSTACK_URL = f'http://{ip_address}:4566'

# Initialize S3 client for LocalStack
s3_client = boto3.client(
    's3',
    endpoint_url=LOCALSTACK_URL,
    aws_access_key_id='test',    # Dummy credentials
    aws_secret_access_key='test', # Dummy credentials
    region_name='us-east-1'
)

# Function to Upload File to S3 Bucket
def upload_to_s3(file, bucket_name, file_name,img=None,exp=6000):
    """Upload a file to S3"""
    try:
        # Create the bucket if it doesn't exist (LocalStack requires explicit bucket creation)
        s3_client.create_bucket(Bucket=bucket_name)

        # Upload the file to LocalStack S3
        if img:
            # Cache the IMG file for 50 minutes
            s3_client.upload_fileobj(file, bucket_name, file_name,ExtraArgs={'CacheControl': f'max-age={exp}',})
        else:
            s3_client.upload_fileobj(file, bucket_name, file_name)
        print(f"File uploaded successfully to {bucket_name}/{file_name}")
        return True
    except NoCredentialsError:
        print("Credentials not available")
        return False






# Generating ID's
def base62_encode(num):
    """Convert a number to a base62 string (alphanumeric characters)."""
    characters = string.ascii_letters + string.digits  # 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    base62 = []
    
    while num > 0:
        num, rem = divmod(num, 62)
        base62.append(characters[rem])
    
    return ''.join(reversed(base62))
def generate_unique_id(file_name, min_len=3, max_len=8):
    # Normalize the file name: Keep only alphanumeric characters and convert to lowercase
    
    file_name = ''.join(c for c in file_name if c.isalnum()).lower()
    
    # Get the current timestamp (in seconds)
    current_time = int(time.time())
    
    # Generate a random number for additional uniqueness
    random_part = random.randint(1000, 9999)
    
    # Combine everything into a string to hash
    combined_string = f"{file_name}_{current_time}_{random_part}"
    
    # Convert the combined string into a number (using hash)
    hash_value = int(hashlib.sha256(combined_string.encode()).hexdigest(), 16)
    
    # Encode the number to a Base62 string
    unique_id = base62_encode(hash_value)
    
    # Ensure the final ID is between min_len and max_len
    if len(unique_id) < min_len:
        # If it's too short, pad it with random characters
        unique_id = ''.join(random.choices(string.ascii_letters + string.digits, k=min_len - len(unique_id))) + unique_id
    elif len(unique_id) > max_len:
        # If it's too long, trim it
        unique_id = unique_id[:max_len]
    
    return unique_id




@app.route('/upload', methods=['POST'])
@token_required
def upload_file():
    if 'image' not in request.files or 'video' not in request.files:
        return jsonify('failed'), 400
    user_id = g.user_id
    print(user_id)
    username = g.username
    vid = g.vid
    k = CHANNELS.find_one({"channel_id": user_id})
    print(k)
    if not k:
        return jsonify('failed'), 400
    print("in upload file", user_id, username, vid)
    image_file = request.files['image']
    video_file = request.files['video']


    if image_file.filename == '' or video_file.filename == '':
        return redirect(request.url)
    
    
    if image_file and video_file:
        try:
            v_id = generate_unique_id(secure_filename(video_file.filename))
            extension=video_file.filename.split('.')[-1]
            v_name=v_id+'.'+extension
            extension=image_file.filename.split('.')[-1]
            i_name=v_id+'.'+extension
            
            if upload_to_s3(video_file, S3_U_BUCKET, v_name) and upload_to_s3(image_file, S3_I_BUCKET, i_name, img=True):
                
                print({'Video and Thumbnail ': v_id})
                print(producer)
                
                result = CHANNELS.update_one(
                    {"channel_id": user_id}, 
                    {"$push": {"videos": v_id}} 
                )

                if result.modified_count > 0:
                    print("Video ID appended successfully.")
                else:
                    print("Failed to append. Channel not found or already updated.")
                if VIDEOS.insert_one({
                    'video_id': v_id,
                    'channel_id': user_id,          
                    'likes': 0,                     
                    'dislikes': 0,                
                    'views': 0,                     
                    'comments': [],                  
                    'timestamp': datetime.now(timezone.utc)  
                }):
                    print("Successfully uploaded data to MongoDB")
               
                if producer.send(KAFKA_TOPIC, value={'filename': v_name}):
                    producer.flush()  
                    print('Video and Image uploaded successfully and message sent to Kafka')
                else:
                    print("Kafka message not sent")
            else:
                print('Video and Image upload failed')
                return jsonify('failed'), 500
            
            # {
            # imagename = secure_filename(image.filename)
            # videoname = secure_filename(video.filename)
            # image_id = fs.put(image, filename=imagename, metadata={"contentType": image.content_type})
            # video_id = fs.put(video, filename=videoname, metadata={"contentType": video.content_type})
            # newids = {'imageId': image_id, 'videoId': video_id}
            # allids.insert_one(newids)
            # }

            return jsonify('success') 
        
        except Exception as e:
            print(str(e))
            
    return jsonify('failed'), 500


@app.post("/signup")
def signin():
    if 'profilePic' not in request.files:
        return jsonify('failed'), 400
    image_file = request.files['profilePic']
    if image_file.filename == '':
        return jsonify({"error": "No file selected for upload"}), 400

    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    # channel_name = request.form.get('channelName')
    """ if not all([username, email, password, channel_name]):
        return jsonify({"error": "All fields are required"}), 400 """
    existing_user = PROFILES.find_one({'username':username})
    """ existing_chan = CHANNELS.find_one({"channelName":channel_name}) """
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    """ if existing_chan:
        return jsonify({"error": "Channelname already exists"}), 400 """
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    if image_file:
        print("We have the image")
        try:
            # user = PROFILES.find_one()
            v_id = generate_unique_id(secure_filename(image_file.filename))
            extension=image_file.filename.split('.')[-1]
            i_name=v_id+'.'+extension
            if upload_to_s3(image_file, S3_X_BUCKET, i_name,img=True,exp=86400):
                print({'uploaded the channel image with video Id: ': v_id})
                profile_pic_link = f'{LOCALSTACK_URL}/{S3_X_BUCKET}/{i_name}'
                user_id = PROFILES.insert_one({
                    "username": username,
                    "email": email,
                    "password": hashed_password,
                    "profilePic": profile_pic_link,
                    "likedVideos": [],       
                    "watchHistory": [],      
                    "subscriptions": []       
                })

#                CHANNELS.insert_one({
#                   "channel_id": str(user_id.inserted_id), 
#                   "channelName": "",
#                   "logo" : profile_pic_link,
#                   "subscribers": 0,
#                   "chn_banner":'',
#                   "description":"",
#                   "videos": [],   
#                   "shorts":[],
#                   "created_date":datetime.now(timezone.utc)
#               })
                return jsonify({"message": "success"}), 201
        except Exception as e:
            print(e)
    else:
        return jsonify({"error": "Image doesnt exists"}), 400
    return jsonify('failed'), 500
   
@app.post("/login")
def login():
    data = request.get_json()
    print("data", data)
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Username and password are required"}), 400
    user = PROFILES.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid username or password"}), 401
    
    token = jwt.encode({
        "user_id": str(user["_id"]),
        "username": user["username"], 
        "vid": user['profilePic'],  
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }, app.config['JWT_SECRET_KEY'], algorithm="HS256")

#    response = jsonify({"message": "success"})
#    response.set_cookie("authToken", token, httponly=True, max_age=3600, secure=False, samesite="None")
#    return response, 200
    return jsonify({
        "message": "success",
        "token": token
    }), 200

@app.post("/createChannel")
@token_required
def createChannel():
    if 'channelBanner' not in request.files:
        return jsonify('failed'), 400
    image_file = request.files['channelBanner']
    if image_file.filename == '':
        return jsonify({"error": "No file selected for upload"}), 400

    channelName = request.form.get("channelName")
    description = request.form.get('description')
    userId = request.form.get('usedId')
    existing_user = CHANNELS.find_one({"channel_id": userId})
    if existing_user:
        return jsonify({'error': "You Already have a channel you cannot create one"}), 400

    existing_chan = CHANNELS.find_one({"channelName":channelName})

    #if already has a channel;

    if existing_chan:
        return jsonify({"error": "Channelname already exists"}), 400
    if image_file:
        try:
            v_id = generate_unique_id(secure_filename(image_file.filename))
            extension=image_file.filename.split('.')[-1]
            i_name=v_id+'.'+extension
            if upload_to_s3(image_file, S3_X_BUCKET, i_name,img=True,exp=86400):
                print({'uploaded the channelBanner image with video Id: ': v_id})
                channelBanner_link = f'{LOCALSTACK_URL}/{S3_X_BUCKET}/{i_name}'
                profile_pic_link = PROFILES.find_one({"_id":ObjectId(userId)}, {"profilePic": 1, "_id": 0})
                print(profile_pic_link)
                CHANNELS.insert_one({
                   "channel_id": str(userId), 
                   "channelName": channelName,
                   "logo" : profile_pic_link["profilePic"],
                   "subscribers": 0,
                   "chn_banner":channelBanner_link,
                   "description":description,
                   "videos": [],   
                   "shorts":[],
                   "created_date":datetime.now(timezone.utc)
               })
                return jsonify({"message": "success"}), 201
        except Exception as e:
            print(e)
    else:
        return jsonify({"error": "Image doesnt exists"}), 400
    return jsonify('failed'), 500
   


@app.route('/')
def index():
    return 'Server is running'



@app.route('/api/get-video-data', methods=['POST'])
def get_video_data():
    data = request.json
    v_id = data.get('data_id')
    print(v_id)
    try:
        # data_id = ObjectId(data_id)
        # document = allids.find_one({'_id': data_id})   
        document = VIDEOS.find_one({'video_id': v_id}) 
        print(document)  
        if document:
            # videoSrc = document.get('videoId', '')
            # posterSrc = document.get('imageId', '')
            # return jsonify({
            #     'videoSrc': str(videoSrc),
            #     'posterSrc': str(posterSrc)
            # })
            print(document["video_id"])
            return jsonify({
                'videoSrc': str(document["video_id"]),
                'posterSrc': str(document["video_id"])
            })
        else:
            return jsonify({'error': 'Document not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@app.get('/v/<video_id>')
def stream_video(video_id):
    try:
        vid_det = VIDEOS.find_one({"video_id":video_id},{"_id":0})
        
        if vid_det:
        
            # Construct the S3 link for the index.m3u8 file
            s3_link = f"{LOCALSTACK_URL}/{S3_V_BUCKET}/{video_id}/master.m3u8"
            print(s3_link)
            return jsonify(link=s3_link,data=vid_det)
            # return render_template('index.html', link=s3_link)

        else:
            return jsonify({'error': 'Video not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.get('/chn/card/<chn_id>')
def chn_card_det(chn_id):
    try:
        print("\n\n",chn_id)
        chn_det=CHANNELS.find_one({"channel_id":chn_id},{"_id":0,"channelName":1,'logo':1})
        print(chn_det)
        if chn_det:
            return chn_det
        else:
            return jsonify({'error': 'Channel not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
    
@app.get('/chn/vid/<chn_id>')
def chn_vid_det(chn_id):
    try:
        print("\n\n",chn_id)
        chn_det=CHANNELS.find_one({"channel_id":chn_id},{"_id":0,"channelName":1,'logo':1,'subscribers':1})
        print(chn_det)
        if chn_det:
            time.sleep(2)
            return chn_det
        else:
            return jsonify({'error': 'Channel not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500




@app.get('/channel/<channelId>')
def channelData(channelId):
    try:
        print(f"ChannelId is {channelId}")
        channelData = CHANNELS.find_one({"channel_id":channelId},{"_id":0})
        videos_list = channelData['videos']
        video_data = list(VIDEOS.find({"video_id": {"$in": videos_list}},{'_id':0,'dislikes':0,'comments':0}))
        send_data = jsonify({"channelData": channelData, "video_data": video_data})
        return send_data
    except Exception as e:
        print(e)





@app.get("/list/videos/cards")
def vc_list():
    vl = VIDEOS.find({},{'_id':0,'channel_id':1,"views":1,'video_id':1,'timestamp':1})
    a=vl.to_list()
    print(a)
    return jsonify(data=a)


@app.get("/list/videos")
def vd_list():
    vl = VIDEOS.find({},{'_id':0,})
    a=vl.to_list()
    print(a)
    return jsonify(data=a)


@app.get("/list/channels")
def ch_list():
    ch = CHANNELS.find({},{'_id':0,})
    a=ch.to_list()
    print(a)
    return jsonify(data=a)

# @app.route('/video/<video_id>')
# def image_data(video_id):
#     try:
#         video_object = fs.get(ObjectId(video_id))
#         video_data = video_object.read()
#         content_type = video_object.metadata.get('contentType')
#         return send_file(io.BytesIO(video_data), mimetype=content_type)
#     except Exception as e:
#         return str(e)




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
