## Decided Structure

```
services/
└─ web-api/
   ├─ src/
   │  ├─ app.js                # Setup Express app, middleware
   │  ├─ index.js              # App bootstrap (listens on port)
   │  ├─ config/
   │  │   └─ index.js          # Loads env, exports config constants
   │  ├─ routes/
   │  │   ├─ auth.js           # /login, /signup, /createChannel
   │  │   ├─ upload.js         # /upload
   │  │   ├─ videos.js         # /api/get-video-data, /v/:id, /list/videos, /list/videos/cards
   │  │   ├─ channels.js       # /channel/:id, /chn/card/:id, /chn/vid/:id, /checkifchannel/:id, /list/channels
   │  │   └─ index.js          # Combines all routes
   │  ├─ controllers/
   │  ��   ├─ authController.js
   │  │   ├─ uploadController.js
   │  │   ├─ videoController.js
   │  │   └─ channelController.js
   │  ├─ services/
   │  │   ├─ db.js             # Mongoose models and Mongo setup
   │  │   ├─ kafka.js
   │  │   ├─ s3.js
   │  │   └─ idgen.js
   │  ├─ middleware/
   │  │   └─ auth.js           # tokenRequired, optionalToken
   │  └─ utils/
   │      └─ helpers.js        # small helpers (sanitize, error handling)
   ├─ package.json
   ├─ Dockerfile
   ├─ .env
   └─ README.md

```