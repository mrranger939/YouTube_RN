import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useParams: () => ({ channelid: "ch123" }),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("../../components/Cards", () => ({
  default: () => <div data-testid="cards" />,
}));
vi.mock("../../components/StubCards", () => ({
  default: () => <div data-testid="stub-cards" />,
}));
vi.mock("../../components/SubcrBtn", () => ({
  default: () => <button data-testid="subscribe-btn">Subscribe</button>,
}));
vi.mock("@heroui/react", () => ({
  Button: ({ children, onPress }) => (
    <button onClick={onPress}>{children}</button>
  ),
  Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
  Tab: ({ children, title }) => (
    <div data-testid={`tab-${title}`}>{children}</div>
  ),
  Card: ({ children }) => <div>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  Modal: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
  ModalContent: ({ children }) => <div>{children(vi.fn())}</div>,
  ModalHeader: ({ children }) => <div>{children}</div>,
  ModalBody: ({ children }) => <div>{children}</div>,
  ModalFooter: ({ children }) => <div>{children}</div>,
  useDisclosure: () => ({ isOpen: false, onOpen: vi.fn(), onOpenChange: vi.fn() }),
}));
vi.mock("../assets/df.jpg", () => ({ default: "df.jpg" }));

import axios from "axios";
import Channel, { ChannelProfile, AllVideos } from "../../pages/Channel";

const CHANNEL_RESPONSE = {
  channelData: {
    channelName: "My Channel",
    chn_banner: "banner.jpg",
    description: "A great channel",
    logo: "logo.jpg",
    shorts: [],
    subscribers: 100,
    videos: ["v1", "v2"],
  },
  video_data: [{ video_id: "v1", videoTitle: "Test" }],
};

describe("Channel page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches channel data on mount", async () => {
    axios.get.mockResolvedValue({ data: CHANNEL_RESPONSE });
    render(<Channel />);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3000/channel/ch123"
      )
    );
  });

  it("renders the channel banner image after fetch", async () => {
    axios.get.mockResolvedValue({ data: CHANNEL_RESPONSE });
    render(<Channel />);
    await waitFor(() => {
      const banner = document.querySelector("img[alt='banner']");
      expect(banner).not.toBeNull();
    });
  });
});

describe("ChannelProfile component", () => {
  it("renders the channel name", () => {
    render(
      <ChannelProfile
        channelName="Test Channel"
        logo="logo.jpg"
        description="desc"
        subscribers={42}
        numOfVideos={5}
      />
    );
    expect(screen.getByText("Test Channel")).toBeInTheDocument();
  });

  it("renders subscriber count", () => {
    render(
      <ChannelProfile
        channelName="Chan"
        logo=""
        description="d"
        subscribers={99}
        numOfVideos={3}
      />
    );
    expect(screen.getByText(/99 Subscribers/)).toBeInTheDocument();
  });

  it("renders fallback channel name when none provided", () => {
    render(
      <ChannelProfile
        channelName=""
        logo=""
        description=""
        subscribers={0}
        numOfVideos={0}
      />
    );
    expect(screen.getByText("Funny Videos")).toBeInTheDocument();
  });

  it("renders the Subscribe button", () => {
    render(
      <ChannelProfile
        channelName="Chan"
        logo=""
        description="d"
        subscribers={0}
        numOfVideos={0}
      />
    );
    expect(screen.getByTestId("subscribe-btn")).toBeInTheDocument();
  });
});

describe("AllVideos component", () => {
  it("renders the Tabs component", () => {
    render(<AllVideos videos={[]} />);
    expect(screen.getByTestId("tabs")).toBeInTheDocument();
  });
});
