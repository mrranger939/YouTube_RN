import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

vi.mock("axios");
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../config/api", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

vi.mock("../../utils/formatter", () => ({
  formatUploadTime: vi.fn(() => "2 hours ago"),
}));

vi.mock("../../components/ReplyItem", () => ({
  ReplyItem: ({ reply, onReply }) => (
    <div data-testid="reply-item">
      <span>{reply.commentText}</span>
      <button onClick={() => onReply("john")}>
        reply-to-user
      </button>
    </div>
  ),
}));

vi.mock("../../Authentication/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@heroui/react", () => ({
  Textarea: ({
    value,
    onValueChange,
    placeholder,
  }) => (
    <textarea
      data-testid="textarea"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),

  Button: ({
    children,
    onPress,
  }) => (
    <button onClick={onPress}>
      {children}
    </button>
  ),
}));

import axios from "axios";
import Cookies from "js-cookie";
import Comment from "../../components/Comment";

const COMMENT = {
  id: 1,
  userId: "u1",
  commentText: "Main comment",
  timestamp: "2025-01-01",
  likes: 10,
  dislikes: 2,
};

describe("Comment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Cookies.get.mockReturnValue("token");

    axios.get.mockImplementation((url) => {
      if (url.includes("/user/")) {
        return Promise.resolve({
          data: {
            data: {
              username: "testuser",
              profilePic: "profile.jpg",
            },
          },
        });
      }

      if (url.includes("/comments/replies/")) {
        return Promise.resolve({
          data: [
            {
              id: 11,
              commentText: "Reply 1",
            },
          ],
        });
      }
    });

    axios.post.mockResolvedValue({});
  });

  it("fetches and displays user details", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    await waitFor(() =>
      expect(
        screen.getByText("@testuser")
      ).toBeInTheDocument()
    );
  });

  it("renders comment text", () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    expect(
      screen.getByText("Main comment")
    ).toBeInTheDocument();
  });

  it("shows reply box when Reply is clicked", () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText("Reply")
    );

    expect(
      screen.getByPlaceholderText(
        "Write a reply..."
      )
    ).toBeInTheDocument();
  });

  it("hides reply box when Reply is clicked twice", () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    const button =
      screen.getByText("Reply");

    fireEvent.click(button);
    fireEvent.click(button);

    expect(
      screen.queryByPlaceholderText(
        "Write a reply..."
      )
    ).not.toBeInTheDocument();
  });

  it("does not submit empty reply", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText("Reply")
    );

    fireEvent.click(
      screen.getAllByText("Reply")[1]
    );

    await waitFor(() =>
      expect(
        axios.post
      ).not.toHaveBeenCalled()
    );
  });

  it("submits a reply", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText("Reply")
    );

    fireEvent.change(
      screen.getByTestId("textarea"),
      {
        target: {
          value: "My reply",
        },
      }
    );

    fireEvent.click(
      screen.getAllByText("Reply")[1]
    );

    await waitFor(() =>
      expect(
        axios.post
      ).toHaveBeenCalledWith(
        "http://localhost:3000/postComment",
        {
          videoId: "vid1",
          parentCommentId: 1,
          commentText: "My reply",
        },
        {
          headers: {
            Authorization:
              "Bearer token",
          },
        }
      )
    );
  });

  it("loads replies when View Replies is clicked", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText(
        "View Replies"
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText("Reply 1")
      ).toBeInTheDocument()
    );
  });

  it("hides replies when Hide Replies is clicked", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText(
        "View Replies"
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          "Hide Replies"
        )
      ).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByText(
        "Hide Replies"
      )
    );

    expect(
      screen.queryByText("Reply 1")
    ).not.toBeInTheDocument();
  });

  it("opens reply box from ReplyItem callback", async () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    fireEvent.click(
      screen.getByText(
        "View Replies"
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText("Reply 1")
      ).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByText(
        "reply-to-user"
      )
    );

    expect(
    screen.getByTestId("textarea")
    ).toHaveValue("@john ");
  });

  it("shows like and dislike counts", () => {
    render(
      <Comment
        comment={COMMENT}
        videoId="vid1"
      />
    );

    expect(
      screen.getByText("10")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2")
    ).toBeInTheDocument();
  });
});