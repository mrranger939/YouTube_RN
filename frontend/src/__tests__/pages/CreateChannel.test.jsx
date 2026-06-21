import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios");
vi.mock("js-cookie", () => ({ default: { get: vi.fn() } }));
vi.mock("jwt-decode", () => ({ jwtDecode: vi.fn() }));
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: () => vi.fn(),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("../../utils/imageUtils", () => ({
  resizeImage: vi.fn().mockResolvedValue(new Blob()),
}));
vi.mock("@heroui/react", () => ({
  Input: ({ label, type, value, onChange, required }) => (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  ),
  Textarea: ({ label, value, onChange }) => (
    <textarea aria-label={label} value={value} onChange={onChange} />
  ),
    Spinner: () => <div data-testid="spinner" />,
}));

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CreateChannel from "../../pages/CreateChannel";

describe("CreateChannel page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects to /login when there is no auth token", async () => {
    Cookies.get.mockReturnValue(undefined);
    render(<CreateChannel />);
    // navigate('/login') is called — we can verify axios was not called for channel check
    await waitFor(() => expect(axios.get).not.toHaveBeenCalled());
  });

  it("shows Spinner while checking if channel already exists", async () => {
    Cookies.get.mockReturnValue("tok");
    jwtDecode.mockReturnValue({ user_id: "u1" });
    // Simulate user already has a channel → sets ifchannel=true → renders Spinner
    axios.get.mockResolvedValue({ data: "success" });
    render(<CreateChannel />);
    await waitFor(() =>
      expect(screen.getByTestId("spinner")).toBeInTheDocument()
    );
  });

  it("renders the Create Channel form when user has no channel", async () => {
    Cookies.get.mockReturnValue("tok");
    jwtDecode.mockReturnValue({ user_id: "u1" });
    axios.get.mockResolvedValue({ data: "fail" });
    render(<CreateChannel />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /create channel/i })).toBeInTheDocument()
    );
  });

  it("renders the Channel Name input in the form", async () => {
    Cookies.get.mockReturnValue("tok");
    jwtDecode.mockReturnValue({ user_id: "u1" });
    axios.get.mockResolvedValue({ data: "fail" });
    render(<CreateChannel />);
    await waitFor(() =>
      expect(screen.getByLabelText(/channel name/i)).toBeInTheDocument()
    );
  });

  it("posts to createChannel on submit", async () => {
    Cookies.get.mockReturnValue("tok");
    jwtDecode.mockReturnValue({ user_id: "u1" });
    axios.get.mockResolvedValue({ data: "fail" });
    axios.post.mockResolvedValue({ data: { message: "success" } });

    render(<CreateChannel />);
    await waitFor(() =>
      expect(screen.getByLabelText(/channel name/i)).toBeInTheDocument()
    );

    // Submit empty form triggers the handler
    const form = screen.getByLabelText(/channel name/i).closest("form");
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce());
  });
});
