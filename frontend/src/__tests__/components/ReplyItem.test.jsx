import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";

vi.mock("axios");

vi.mock("../../config/api", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

vi.mock("../../utils/formatter", () => ({
  formatUploadTime: vi.fn(() => "2 hours ago"),
}));

vi.mock("@heroui/react", () => ({
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
import { ReplyItem } from "../../components/ReplyItem";

const REPLY = {
  id: 1,
  userId: "user1",
  commentText: "This is a reply",
  timestamp: "2025-01-01",
  likesCount: 5,
  dislikesCount: 2,
};

describe("ReplyItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockResolvedValue({
      data: {
        data: {
          username: "john",
          profilePic: "profile.jpg",
        },
      },
    });
  });

  it("fetches user details on mount", async () => {
    render(<ReplyItem reply={REPLY} />);

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/user/profile/user1"
      )
    );
  });

  it("renders fetched username", async () => {
    render(<ReplyItem reply={REPLY} />);

    await waitFor(() =>
      expect(
        screen.getByText("@john")
      ).toBeInTheDocument()
    );
  });

  it("renders reply text", () => {
    render(<ReplyItem reply={REPLY} />);

    expect(
      screen.getByText("This is a reply")
    ).toBeInTheDocument();
  });

  it("renders formatted timestamp", () => {
    render(<ReplyItem reply={REPLY} />);

    expect(
      screen.getByText("2 hours ago")
    ).toBeInTheDocument();
  });

  it("renders like count", () => {
    render(<ReplyItem reply={REPLY} />);

    expect(
      screen.getByText("5")
    ).toBeInTheDocument();
  });

  it("renders dislike count", () => {
    render(<ReplyItem reply={REPLY} />);

    expect(
      screen.getByText("2")
    ).toBeInTheDocument();
  });

  it("renders zero counts when likes/dislikes are missing", () => {
    render(
      <ReplyItem
        reply={{
          ...REPLY,
          likesCount: undefined,
          dislikesCount: undefined,
        }}
      />
    );

    const zeros = screen.getAllByText("0");

    expect(zeros).toHaveLength(2);
  });

  it("calls onReply with username when Reply button is clicked", async () => {
    const onReply = vi.fn();

    render(
      <ReplyItem
        reply={REPLY}
        onReply={onReply}
      />
    );

    await waitFor(() =>
      expect(
        screen.getByText("@john")
      ).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByText("Reply")
    );

    expect(onReply).toHaveBeenCalledWith(
      "john"
    );
  });

  it("renders fallback avatar before user loads", () => {
    axios.get.mockImplementation(
      () => new Promise(() => {})
    );

    render(<ReplyItem reply={REPLY} />);

    const img = document.querySelector("img");

    expect(img).toHaveAttribute(
    "src",
    "https://ui-avatars.com/api/?name=User"
    );
  });

  it("handles user fetch errors gracefully", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axios.get.mockRejectedValue(
      new Error("API Error")
    );

    render(<ReplyItem reply={REPLY} />);

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalled()
    );

    consoleSpy.mockRestore();
  });
});