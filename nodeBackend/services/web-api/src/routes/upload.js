import { Router } from "express";
import multer from "multer";
import { tokenRequired } from "../middleware/auth.js";
import { uploadVideo } from "../controllers/uploadController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  tokenRequired,
  upload.fields([
    { name: "resizedImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadVideo
);

export default router;
