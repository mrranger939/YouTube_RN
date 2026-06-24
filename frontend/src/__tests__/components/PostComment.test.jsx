import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

vi.mock("axios");
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
  },
}));
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("../../config/api", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

vi.mock("@heroui/react", () => ({
  Textarea: ({ value, onValueChange, placeholder }) => (
    <textarea
      data-testid="comment-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),

  Button: ({ children, onPress, isLoading }) => (
    <button data-testid="comment-button" onClick={onPress} disabled={isLoading}>
      {children}
    </button>
  ),
}));

import axios from "axios";
import Cookies from "js-cookie";
import PostComment from "../../components/PostComment";

describe("PostComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Cookies.get.mockReturnValue("mock-token");

    axios.post.mockResolvedValue({
      data: { success: true },
    });
  });

  it("renders textarea and comment button", () => {
    render(<PostComment videoId="vid1" />);

    expect(screen.getByPlaceholderText("Add a comment...")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /comment/i }),
    ).toBeInTheDocument();
  });

  it("updates textarea value when typing", () => {
    render(<PostComment videoId="vid1" />);

    const textarea = screen.getByTestId("comment-input");

    fireEvent.change(textarea, {
      target: { value: "Hello world" },
    });

    expect(textarea.value).toBe("Hello world");
  });

  it("redirects to login when user is not authenticated", async () => {
    Cookies.get.mockReturnValue(undefined);

    render(<PostComment videoId="vid123" />);

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "Test comment" },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("does not post when comment is empty", async () => {
    render(<PostComment videoId="vid1" />);

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("does not post when comment contains only spaces", async () => {
    render(<PostComment videoId="vid1" />);

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "     " },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("posts a comment successfully", async () => {
    render(<PostComment videoId="vid123" />);

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "Nice video!" },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/postComment",
        {
          videoId: "vid123",
          parentCommentId: null,
          commentText: "Nice video!",
        },
        {
          headers: {
            Authorization: "Bearer mock-token",
          },
        },
      );
    });
  });

  it("calls onSuccess after successful post", async () => {
    const onSuccess = vi.fn();

    render(<PostComment videoId="vid123" onSuccess={onSuccess} />);

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "Great content!" },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });

  it("clears textarea after successful post", async () => {
    render(<PostComment videoId="vid123" />);

    const textarea = screen.getByTestId("comment-input");

    fireEvent.change(textarea, {
      target: { value: "Test comment" },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    axios.post.mockRejectedValue(new Error("API Error"));

    render(<PostComment videoId="vid123" />);

    fireEvent.change(screen.getByTestId("comment-input"), {
      target: { value: "Test comment" },
    });

    fireEvent.click(screen.getByTestId("comment-button"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
