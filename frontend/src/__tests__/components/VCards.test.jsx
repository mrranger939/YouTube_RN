import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("@heroui/react", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
  Spinner: () => <div data-testid="spinner" />,
}));

import axios from "axios";
import VCards from "../../components/VCards";

const SAMPLE_VIDEOS = [
  {
    video_id: "v1",
    videoTitle: "Test Video",
    channel_id: "c1",
    views: 2000,
    timestamp: new Date(Date.now() - 60 * 1000).toISOString(),
  },
];

describe("VCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    axios.get.mockResolvedValue({ data: { data: [] } });
    render(<VCards />);
  });

  it("calls the video list API on mount", async () => {
    axios.get.mockResolvedValue({ data: { data: [] } });
    render(<VCards />);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/list/videos/cards"
      )
    );
  });

  it("renders video titles after successful fetch", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { data: SAMPLE_VIDEOS } }) // video list
      .mockResolvedValue({ data: { channelName: "Chan", logo: "logo.jpg" } }); // channel

    render(<VCards />);
    await waitFor(() =>
      expect(screen.getByText("Test Video")).toBeInTheDocument()
    );
  });

  it("handles fetch error gracefully without throwing", async () => {
    axios.get.mockRejectedValue(new Error("Network error"));
    expect(() => render(<VCards />)).not.toThrow();
  });
});
