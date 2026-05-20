import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("../../components/Cards", () => ({
  default: ({ vid_list }) => (
    <div data-testid="cards">
      {vid_list.map((v) => (
        <span key={v.video_id}>{v.videoTitle}</span>
      ))}
    </div>
  ),
}));
vi.mock("../../components/StubCards", () => ({
  default: () => <div data-testid="stub-cards" />,
}));

import axios from "axios";
import Home from "../../pages/Home";

describe("Home", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows StubCards while loading", () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<Home />);
    expect(screen.getByTestId("stub-cards")).toBeInTheDocument();
  });

  it("shows StubCards when the video list is empty", async () => {
    axios.get.mockResolvedValue({ data: { data: [] } });
    render(<Home />);
    await waitFor(() =>
      expect(screen.getByTestId("stub-cards")).toBeInTheDocument()
    );
  });

  it("renders Cards with the fetched videos", async () => {
    const videos = [{ video_id: "v1", videoTitle: "A Video" }];
    axios.get.mockResolvedValue({ data: { data: videos } });
    render(<Home />);
    await waitFor(() => expect(screen.getByTestId("cards")).toBeInTheDocument());
    expect(screen.getByText("A Video")).toBeInTheDocument();
  });

  it("shows an error message when fetch fails", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));
    render(<Home />);
    await waitFor(() =>
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    );
  });

  it("still shows StubCards behind the error message on failure", async () => {
    axios.get.mockRejectedValue(new Error("fail"));
    render(<Home />);
    await waitFor(() =>
      expect(screen.getByTestId("stub-cards")).toBeInTheDocument()
    );
  });
});
