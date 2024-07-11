from flask import Flask, request, jsonify, redirect, render_template, url_for, send_file
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import gridfs
from bson import ObjectId
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

""" database connection """
client = MongoClient("mongodb://localhost:27017/")
db = client['image_uploads']
fs = gridfs.GridFS(db)
allids = db.get_collection('allids')
""" database connection """

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files or 'video' not in request.files:
        return jsonify('failed'), 400

    image = request.files['image']
    video = request.files['video']

    if image.filename == '' or video.filename == '':
        return redirect(request.url)
    try:
        imagename = secure_filename(image.filename)
        videoname = secure_filename(video.filename)
        image_id = fs.put(image, filename=imagename, metadata={"contentType": image.content_type})
        video_id = fs.put(video, filename=videoname, metadata={"contentType": video.content_type})
        newids = {'imageId': image_id, 'videoId': video_id}
        allids.insert_one(newids)
        return jsonify('success') 
    except Exception as e:
        print(str(e))
        return jsonify('failed'), 500
@app.route('/')
def index():
    return 'Server is running'
@app.route('/api/get-video-data', methods=['POST'])
def get_video_data():
    data = request.json
    data_id = data.get('data_id')
    print(data_id)
    try:
        data_id = ObjectId(data_id)
        document = allids.find_one({'_id': data_id})   
        if document:
            videoSrc = document.get('videoId', '')
            posterSrc = document.get('imageId', '')
            return jsonify({
                'videoSrc': str(videoSrc),
                'posterSrc': str(posterSrc)
            })
        else:
            return jsonify({'error': 'Document not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/video/<video_id>')
def image_data(video_id):
    try:
        video_object = fs.get(ObjectId(video_id))
        video_data = video_object.read()
        content_type = video_object.metadata.get('contentType')
        return send_file(io.BytesIO(video_data), mimetype=content_type)
    except Exception as e:
        return str(e)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
