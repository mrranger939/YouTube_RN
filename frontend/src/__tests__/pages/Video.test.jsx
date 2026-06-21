import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("hls.js", () => ({
  default: {
    isSupported: vi.fn(() => false),
    Events: { MANIFEST_PARSED: "hlsManifestParsed" },
  },
}));
vi.mock("react-router-dom", () => ({
  useParams: () => ({ data_id: "vid123" }),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("../../components/VCards", () => ({
  default: () => <div data-testid="vcards" />,
}));
vi.mock("../../components/SubcrBtn", () => ({
  default: () => <button>Subscribe</button>,
}));
vi.mock("@heroui/react", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
  Button: ({ children }) => <button>{children}</button>,
  Textarea: ({ label }) => <textarea aria-label={label} />,
}));
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
  useNavigate: () => vi.fn(),
}));

import axios from "axios";
import Video from "../../pages/Video";

const VIDEO_DATA = {
  link: "http://cdn.example.com/stream.m3u8",
  data: {
    videoTitle: "My Test Video",
    channel_id: "ch1",
  },
};

const CHANNEL_DATA = {
  channelName: "My Channel",
  logo: "logo.jpg",
  subscribers: 50,
};

describe("Video page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows nothing (empty) while loading", () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<Video />);
    // Loading returns an empty fragment
    expect(container.innerHTML).toBe("");
  });

  it("shows the 404 page when fetch fails", async () => {
    axios.get.mockRejectedValue(new Error("Not found"));
    render(<Video />);
    await waitFor(() =>
      expect(screen.getByText(/404/i)).toBeInTheDocument()
    );
  });

  it("renders the video title after successful fetch", async () => {
    axios.get
      .mockResolvedValueOnce({ data: VIDEO_DATA })  // video fetch
      .mockResolvedValue({ data: CHANNEL_DATA });   // channel fetch

    render(<Video />);
    await waitFor(() =>
      expect(screen.getByText("My Test Video")).toBeInTheDocument()
    );
  });

  it("renders a video element", async () => {
    axios.get
      .mockResolvedValueOnce({ data: VIDEO_DATA })
      .mockResolvedValue({ data: CHANNEL_DATA });

    render(<Video />);
    await waitFor(() => {
      expect(document.querySelector("video")).not.toBeNull();
    });
  });

  it("fetches channel details after video data loads", async () => {
    axios.get
      .mockResolvedValueOnce({ data: VIDEO_DATA })
      .mockResolvedValue({ data: CHANNEL_DATA });

    render(<Video />);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/chn/vid/ch1")
    );
  });
});
