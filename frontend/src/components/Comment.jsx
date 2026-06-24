import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Textarea } from "@heroui/react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../Authentication/AuthContext";
import { ReplyItem} from "./ReplyItem";
import { formatUploadTime } from "../utils/formatter";

export default function Comment({ comment, videoId, refreshComments }) {
  const navigate = useNavigate();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/user/profile/${comment.userId}`,
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
    if (!token) {
      navigate("/login");
      return;
    }
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
            {formatUploadTime(comment.timestamp)}
          </span>
        </div>

        <p className="mt-1">{comment.commentText}</p>

        {/* Actions */}
        <div className="flex gap-4 mt-2 text-sm">
              <Button
                  isIconOnly
                  className="border-none"
                  variant="ghost"
                  aria-label="Like"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0501 7.04419C15.4673 5.79254 14.5357 4.5 13.2163 4.5C12.5921 4.5 12.0062 4.80147 11.6434 5.30944L8.47155 9.75H5.85748L5.10748 10.5V18L5.85748 18.75H16.8211L19.1247 14.1428C19.8088 12.7747 19.5406 11.1224 18.4591 10.0408C17.7926 9.37439 16.8888 9 15.9463 9H14.3981L15.0501 7.04419ZM9.60751 10.7404L12.864 6.1813C12.9453 6.06753 13.0765 6 13.2163 6C13.5118 6 13.7205 6.28951 13.627 6.56984L12.317 10.5H15.9463C16.491 10.5 17.0133 10.7164 17.3984 11.1015C18.0235 11.7265 18.1784 12.6814 17.7831 13.472L15.8941 17.25H9.60751V10.7404ZM8.10751 17.25H6.60748V11.25H8.10751V17.25Z"
                        fill="#080341"
                      ></path>{" "}
                    </g>
                  </svg>
                  {comment.likes || 0}
                </Button>

                <Button
                  isIconOnly
                     className="border-none"
                  variant="ghost"
                  aria-label="DisLike"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0501 16.9558C15.4673 18.2075 14.5357 19.5 13.2164 19.5C12.5921 19.5 12.0063 19.1985 11.6435 18.6906L8.47164 14.25L5.85761 14.25L5.10761 13.5L5.10761 6L5.85761 5.25L16.8211 5.25L19.1247 9.85722C19.8088 11.2253 19.5407 12.8776 18.4591 13.9592C17.7927 14.6256 16.8888 15 15.9463 15L14.3982 15L15.0501 16.9558ZM9.60761 13.2596L12.8641 17.8187C12.9453 17.9325 13.0765 18 13.2164 18C13.5119 18 13.7205 17.7105 13.6271 17.4302L12.317 13.5L15.9463 13.5C16.491 13.5 17.0133 13.2836 17.3984 12.8985C18.0235 12.2735 18.1784 11.3186 17.7831 10.528L15.8941 6.75L9.60761 6.75L9.60761 13.2596ZM8.10761 6.75L6.60761 6.75L6.60761 12.75L8.10761 12.75L8.10761 6.75Z"
                        fill="#080341"
                      ></path>{" "}
                    </g>
                  </svg>
                  {comment.dislikes || 0}
                </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => setShowReplyBox(!showReplyBox)}
          >
            Reply
          </Button>

        </div>



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