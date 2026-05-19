import { Router } from "express";
import multer from "multer";
import { tokenRequired } from "../middleware/auth.js";
import {
  channelData,
  chnCard,
  chnVid,
  checkIfChannel,
  listChannels,
  createChannel
} from "../controllers/channelController.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/createChannel",
  tokenRequired,
  upload.single("channelBanner"),
  createChannel
);
router.get("/channel/:channelId", channelData);
router.get("/chn/card/:chn_id", chnCard);
router.get("/chn/vid/:chn_id", chnVid);
router.get("/checkifchannel/:channelId", checkIfChannel);
router.get("/list/channels", listChannels);

export default router;
