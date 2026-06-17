import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@heroui/react";
import { API_BASE_URL } from "../config/api";

export function ReplyItem({ reply, onReply }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/user/${reply.userId}`
        );

        setUser(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [reply.userId]);

  return (
    <div className="flex gap-3">
      <img
        src={
          user?.profilePic ||
          "https://ui-avatars.com/api/?name=User"
        }
        alt=""
        className="w-8 h-8 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="flex gap-2 text-sm">
          <span className="font-semibold">
            @{user?.username}
          </span>

          <span className="text-gray-500">
            {reply.timestamp}
          </span>
        </div>

        <p className="mt-1">
          {reply.commentText}
        </p>

        <Button
          size="sm"
          variant="light"
          className="px-0 min-w-0 h-auto mt-1"
          onPress={() => onReply?.(user?.username)}
        >
          Reply
        </Button>
      </div>
    </div>
  );
}