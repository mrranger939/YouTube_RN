import { config } from "../config/index.js";
import { Comment, Video } from "../services/db.js";
import { randomUUID } from "crypto";

/* POST /postComment */
export const postComment = async (req, res) => {
  try {
    const { videoId, parentCommentId, commentText } = req.body;
    const { user_id } = req.user;
    const normalizedCommentText = typeof commentText === "string" ? commentText.trim() : "";
    if (!videoId || !normalizedCommentText) {
      return res.status(400).json({
        error: "videoId and commentText are required",
      });
    }
    const videoExists = await Video.findOne({
      video_id: videoId,
    });
    if (!videoExists) {
      return res.status(404).json({
        error: "Video not found",
      });
    }
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        id: parentCommentId,
        videoId
      });

      if (!parentComment) {
        return res.status(404).json({
          error: "Parent comment not found for this video",
        });
      }
    }
    const commentId = randomUUID();
    await Comment.create({
      id: commentId,
      userId: user_id,
      videoId: videoId,
      parentCommentId: parentCommentId,
      commentText: commentText,
    });
    return res
      .status(201)
      .json({ message: `created comment successfully with id: ${commentId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed" });
  }
};

/* GET /comment/:commentUUID */
export const getComment = async (req, res) => {
  try {
    const { commentUUID } = req.params;
    const commentData = await Comment.findOne({ id: commentUUID }, { _id: 0 }).lean();;
    if (!commentData) {
      return res.status(404).json({ error: "comment not found" });
    }
    return res.json(commentData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

/* GET /comments/video/:videoId */
export const getCommentsByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find(
      { videoId },
      { _id: 0 }
    ).lean();
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

/* GET /comments/replies/:commentId */
export const getRepliesByCommentId = async (req, res) => {
  try {
    const { commentId } = req.params;
    const replies = await Comment.find(
      { parentCommentId: commentId },
      { _id: 0 }
    ).lean();
    return res.status(200).json(replies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};
