import { Router } from "express";
import {
  getVideoData,
  streamVideo,
  listVideos,
  listVideoCards,
} from "../controllers/videoController.js";

const router = Router();

router.post("/api/get-video-data", getVideoData);
router.get("/v/:video_id", streamVideo);
router.get("/list/videos", listVideos);
router.get("/list/videos/cards", listVideoCards);

export default router;
