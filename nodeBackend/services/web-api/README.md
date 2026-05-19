
# YT Web API Service (Express)

A modern Express.js backend migrated from Flask for a YouTube-like platform.
Handles authentication, channel management, video uploads, and streaming metadata using:

* **Node.js + Express**
* **MongoDB (Mongoose)**
* **JWT Authentication**
* **AWS S3 (LocalStack)**
* **Kafka (video processing trigger)**

---

## 🏗 Architecture

```
services/web-api
│
├── src
│   ├── app.js
│   ├── index.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── .env
├── package.json
└── Dockerfile
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=8000
IP_ADD=10.53.207.1
MONGO_URL=mongodb://localhost:27017/YoutubeRN
JWT_SECRET=your_secret_key

LOCALSTACK_URL=http://10.53.207.1:4566

S3_U_BUCKET=untranscoded
S3_I_BUCKET=thumbnail
S3_V_BUCKET=video-abr
S3_X_BUCKET=profiles

KAFKA_BROKER=10.53.207.1:9092
KAFKA_TOPIC=video-uploads
```

---

## Run Locally

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:8000
```

---

##  Authentication Flow

1. `POST /signup`
2. `POST /login` → returns JWT
3. Use JWT in:

```
Authorization: Bearer <token>
```

For protected routes:

* `/upload`
* `/createChannel`
* `/protected`

---

## API Endpoints

---

###  Health Check

**GET /**

```
200 OK
Server is running
```

---

###  Protected Test

**GET /protected**
Headers:

```
Authorization: Bearer <token>
```

---

##  Auth APIs

### POST /signup

Form-Data:

```
username (text)
email (text)
password (text)
profilePic (file)
```

Response:

```json
{ "message": "success" }
```

---

### POST /login

JSON:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "message": "success",
  "token": "JWT_TOKEN"
}
```

---

##  Channel APIs

### POST /createChannel (Protected)

Form-Data:

```
channelBanner (file)
channelName (text)
description (text)
usedId (text)
```

Response:

```json
{ "message": "success" }
```

---

### GET /channel/:channelId

Returns channel + its videos

---

### GET /chn/card/:chn_id

Returns:

```
channelName, logo
```

---

### GET /chn/vid/:chn_id

Returns:

```
channelName, logo, subscribers
```

---

### GET /checkifchannel/:channelId

Response:

```
"success" | "fail"
```

---

### GET /list/channels

Response:

```json
{ "data": [ ...channels ] }
```

---

## Video APIs

---

### POST /upload (Protected)

Form-Data:

```
resizedImage (file)
video (file)
description (text)
genre (text)
videoTitle (text)
```

Flow:

* Uploads to S3
* Saves metadata to MongoDB
* Sends Kafka message

Response:

```
"success"
```

---

### GET /list/videos

Returns all videos

---

### GET /list/videos/cards

Returns:

```
channel_id, videoTitle, views, video_id, timestamp
```

---

### GET /v/:video_id

Returns:

```json
{
  "link": "http://LOCALSTACK/video-abr/<id>/master.m3u8",
  "data": { video metadata }
}
```

---

### POST /api/get-video-data

```json
{
  "data_id": "video_id"
}
```

Response:

```json
{
  "videoSrc": "id",
  "posterSrc": "id"
}
```

---

## Kafka Integration

On `/upload`:

```json
{ "filename": "<videoFileName>" }
```

Sent to topic:

```
video-uploads
```

---

## S3 Buckets (LocalStack)

| Bucket       | Purpose        |
| ------------ | -------------- |
| untranscoded | raw uploads    |
| thumbnail    | thumbnails     |
| video-abr    | HLS streams    |
| profiles     | profile images |

---







