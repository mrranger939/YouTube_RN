import { Video } from "../services/db.js";
import { config } from "../config/index.js";

/* POST /api/get-video-data */
export const getVideoData = async (req, res) => {
  try {
    const { data_id } = req.body;

    const document = await Video.findOne({ video_id: data_id });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.json({
      videoSrc: document.video_id,
      posterSrc: document.video_id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /v/:video_id */
export const streamVideo = async (req, res) => {
  try {
    const { video_id } = req.params;

    const vid_det = await Video.findOne(
      { video_id },
      { _id: 0 }
    );

    if (!vid_det) {
      return res.status(404).json({ error: "Video not found" });
    }

    const s3_link = `${config.LOCALSTACK_URL}/${config.S3_V_BUCKET}/${video_id}/master.m3u8`;

    return res.json({ link: s3_link, data: vid_det });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /list/videos */
export const listVideos = async (req, res) => {
  try {
    const videos = await Video.find({}, { _id: 0 });
    return res.json({ data: videos });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /list/videos/cards */
export const listVideoCards = async (req, res) => {
  try {
    const videos = await Video.find(
      {},
      { _id: 0, channel_id: 1, videoTitle: 1, views: 1, video_id: 1, timestamp: 1 }
    );
    return res.json({ data: videos });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
