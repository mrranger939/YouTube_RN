import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Textarea } from "@heroui/react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../Authentication/AuthContext";
import { ReplyItem} from "./ReplyItem";

export default function Comment({ comment, videoId, refreshComments }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/user/${comment.userId}`,
        );

        setUser(data.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    if (comment.userId) {
      fetchUser();
    }
  }, [comment.userId]);

  const fetchReplies = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/comments/replies/${comment.id}`,
      );

      setReplies(data || []);
      setShowReplies(true);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;

    const token = Cookies.get("authToken");

    try {
      await axios.post(
        `${API_BASE_URL}/postComment`,
        {
          videoId,
          parentCommentId: comment.id,
          commentText: replyText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReplyText("");
      setShowReplyBox(false);

      await fetchReplies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <img
        src={
          user?.profilePic ||
          "https://ui-avatars.com/api/?name=User"
        }
        alt="profile"
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="flex gap-2 text-sm">
          <span className="font-semibold">
            @{user?.username || "Loading..."}
          </span>

          <span className="text-gray-500">
            {comment.createdAt}
          </span>
        </div>

        <p className="mt-1">{comment.commentText}</p>

        {/* Actions */}
        <div className="flex gap-4 mt-2 text-sm">
          <Button size="sm" variant="light">
            👍 {comment.likesCount || 0}
          </Button>

          <Button size="sm" variant="light">
            👎 {comment.dislikesCount || 0}
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => setShowReplyBox(!showReplyBox)}
          >
            Reply
          </Button>

        </div>

        {/* Reply Box */}
        {showReplyBox && (
          <div className="mt-3">
            <Textarea
              value={replyText}
              onValueChange={setReplyText}
              placeholder="Write a reply..."
            />

            <div className="flex justify-end mt-2">
              <Button color="primary" onPress={submitReply}>
                Reply
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        <button
        className="mt-3 text-blue-500"
        onClick={() => {
          if (showReplies) {
            setShowReplies(false);
          } else {
            fetchReplies();
          }
        }}
      >
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>

        {showReplies && (
          <div className="ml-14 mt-3 border-l border-gray-300 pl-6">
          {replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onReply={(username) => {
                setReplyText(`@${username} `);
                setShowReplyBox(true);
              }}
            />
          ))}
          </div>
        )}
      </div>
    </div>
  );
}