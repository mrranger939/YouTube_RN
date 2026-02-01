# Structure decided
### node version: 22.16.0

```backend/
─ services/
│  ├─ web-api/                     # Express REST API (replaces Flask)
│  │  ├─ src/
│  │  │  ├─ index.js               # server bootstrap
│  │  │  ├─ app.js                 # express app and middleware
│  │  │  ├─ routes/
│  │  │  ├─ controllers/
│  │  │  ├─ services/              # db, s3, kafka producers
│  │  │  ├─ middleware/            # auth, error handlers
│  │  │  └─ utils/                 # idgen, helpers
│  │  ├─ package.json
│  │  └─ Dockerfile
│  ├─ video-worker/                # Kafka consumer + ffmpeg
│  │  ├─ src/
│  │  │  ├─ worker.js              # entrypoint (consumer loop)
│  │  │  ├─ services/              # s3, ffmpeg, kafka consumer factory
│  │  │  └─ utils/
│  │  ├─ package.json
│  │  └─ Dockerfile
├─ libs/
│  └─ common/                      # shared helpers (idgen, auth decorators, logging)
│     ├─ src/
│     └─ package.json
├─ infra/
│  └─ docker-compose.yml
├─ .env                            # local dev env (not committed secrets)
└─ README_BACKEND.md

```