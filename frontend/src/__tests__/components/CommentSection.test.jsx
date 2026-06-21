import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");

vi.mock("../config/api", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

vi.mock("../../components/Comment", () => ({
  default: ({ comment }) => (
    <div data-testid="comment">
      {comment.content}
    </div>
  ),
}));

vi.mock("../../components/PostComment", () => ({
  default: ({ videoId }) => (
    <div data-testid="post-comment">
      PostComment - {videoId}
    </div>
  ),
}));

import axios from "axios";
import CommentSection from "../../components/CommentSection";

const SAMPLE_COMMENTS = [
  {
    id: 1,
    content: "Top level comment 1",
    parentCommentId: null,
  },
  {
    id: 2,
    content: "Reply comment",
    parentCommentId: 1,
  },
  {
    id: 3,
    content: "Top level comment 2",
    parentCommentId: null,
  },
];

describe("CommentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockResolvedValue({
      data: SAMPLE_COMMENTS,
    });
  });

  it("renders PostComment component", () => {
    render(<CommentSection videoId="vid123" />);

    expect(screen.getByTestId("post-comment")).toBeInTheDocument();
  });

  it("fetches comments when videoId is provided", async () => {
    render(<CommentSection videoId="vid123" />);

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/comments/video/vid123"
      )
    );
  });

  it("renders only top-level comments", async () => {
    render(<CommentSection videoId="vid123" />);

    await waitFor(() => {
      expect(screen.getAllByTestId("comment")).toHaveLength(2);
    });

    expect(
      screen.getByText("Top level comment 1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Top level comment 2")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Reply comment")
    ).not.toBeInTheDocument();
  });

  it("displays the correct comment count", async () => {
    render(<CommentSection videoId="vid123" />);

    await waitFor(() => {
      expect(screen.getByText("2 Comments")).toBeInTheDocument();
    });
  });

  it("passes videoId to PostComment", () => {
    render(<CommentSection videoId="vid123" />);

    expect(
      screen.getByText("PostComment - vid123")
    ).toBeInTheDocument();
  });

  it("renders no comments when API returns empty array", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<CommentSection videoId="vid123" />);

    await waitFor(() => {
      expect(screen.getByText("0 Comments")).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId("comment")
    ).not.toBeInTheDocument();
  });

  it("does not fetch comments when videoId is not provided", () => {
    render(<CommentSection />);

    expect(axios.get).not.toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axios.get.mockRejectedValue(new Error("API Error"));

    render(<CommentSection videoId="vid123" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.getByText("0 Comments")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});