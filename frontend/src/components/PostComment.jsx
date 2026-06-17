import { useState } from "react";
import { Textarea, Button } from "@heroui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config/api";

export default function PostComment({ videoId, onSuccess }) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      await axios.post(
        `${API_BASE_URL}/postComment`,
        {
          videoId,
          parentCommentId: null,
          commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCommentText("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Textarea
        placeholder="Add a comment..."
        value={commentText}
        onValueChange={setCommentText}
        minRows={3}
      />

      <div className="flex justify-end mt-3">
        <Button color="primary" isLoading={loading} onPress={handlePostComment}>
          Comment
        </Button>
      </div>
    </div>
  );
}
