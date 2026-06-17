import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Comment from "./Comment";
import PostComment from "./PostComment";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/comments/video/${videoId}`
      );

      // Only keep top-level comments
      const topLevelComments = (data || []).filter(
        (comment) => comment.parentCommentId === null
      );

      setComments(topLevelComments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h2>

      <PostComment
        videoId={videoId}
        onSuccess={fetchComments}
      />

      <div className="mt-6 flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            videoId={videoId}
            refreshComments={fetchComments}
          />
        ))}
      </div>
    </div>
  );
}