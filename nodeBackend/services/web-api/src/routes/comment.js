import { Router } from "express";
import { tokenRequired } from "../middleware/auth.js";
import { postComment, getComment, getCommentsByVideoId, getRepliesByCommentId } from "../controllers/commentController.js";

const router = Router();

router.post("/postComment", tokenRequired, postComment);
router.get("/comment/:commentUUID", getComment);
router.get("/comments/video/:videoId", getCommentsByVideoId);
router.get("/comments/replies/:commentId", getRepliesByCommentId);

export default router;
