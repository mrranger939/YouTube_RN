import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("@heroui/react", () => ({
  User: ({ avatarProps }) => <img alt="channel-avatar" src={avatarProps?.src} />,
  Card: ({ children, onClick }) => <div data-testid="card" onClick={onClick}>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children, onClick }) => <div onClick={onClick}>{children}</div>,
  CardFooter: ({ children }) => <div>{children}</div>,
  Image: ({ alt, src }) => <img alt={alt} src={src} />,
  Skeleton: () => <div data-testid="skeleton" />,
}));

import axios from "axios";
import Cards from "../../components/Cards";

const SAMPLE_VIDEOS = [
  {
    video_id: "vid1",
    videoTitle: "My First Video",
    channel_id: "ch1",
    views: 1000,
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
  },
  {
    video_id: "vid2",
    videoTitle: "Another Video",
    channel_id: "ch1",
    views: 5000000,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2d ago
  },
];

describe("Cards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Cards.jsx uses an undeclared `ip` variable — stub it as a global
    vi.stubGlobal("ip", "localhost");
    axios.get.mockResolvedValue({ data: { channelName: "TestChannel", logo: "logo.jpg" } });
  });

  it("renders a card for each video in vid_list", () => {
    render(<Cards vid_list={SAMPLE_VIDEOS} />);
    expect(screen.getAllByTestId("card")).toHaveLength(2);
  });

  it("renders the video title for each card", () => {
    render(<Cards vid_list={SAMPLE_VIDEOS} />);
    expect(screen.getByText("My First Video")).toBeInTheDocument();
    expect(screen.getByText("Another Video")).toBeInTheDocument();
  });

  it("renders views in formatted form", () => {
    render(<Cards vid_list={SAMPLE_VIDEOS} />);
    expect(screen.getByText(/1\.0K views/)).toBeInTheDocument();
  });

  it("shows a skeleton while channel details are loading", () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<Cards vid_list={SAMPLE_VIDEOS} />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("fetches channel details for each unique channel_id", async () => {
    render(<Cards vid_list={SAMPLE_VIDEOS} />);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/chn/card/ch1"
      )
    );
  });

  it("renders empty container for an empty vid_list", () => {
    const { container } = render(<Cards vid_list={[]} />);
    expect(container.firstChild.children).toHaveLength(0);
  });
});
