import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: () => vi.fn(),
}));
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
vi.mock("@heroui/react", () => ({
  Input: ({ label, type, value, onChange, required, variant }) => (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  ),
}));

import axios from "axios";
import Signup from "../../pages/Signup";

describe("Signup page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the Create Account heading", () => {
    render(<Signup />);
    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders username, email, and password inputs", () => {
    render(<Signup />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders a link to the login page", () => {
    render(<Signup />);
    expect(screen.getByText(/login/i).closest("a")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("renders the profile picture file input", () => {
    render(<Signup />);
    // label is not programmatically associated; find by the visible label text
    expect(screen.getByText(/profile picture/i)).toBeInTheDocument();
  });

  it("accepts user input for username", async () => {
    render(<Signup />);
    const input = screen.getByLabelText(/username/i);
    await userEvent.type(input, "alice");
    expect(input).toHaveValue("alice");
  });

  it("calls axios.post on submit", async () => {
    axios.post.mockResolvedValue({ data: { message: "fail" } });
    render(<Signup />);

    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce());
  });

  it("redirects to /login after successful signup", async () => {
    axios.post.mockResolvedValue({ data: { message: "success" } });
    render(<Signup />);

    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/email/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/password/i), "pass");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() =>
      expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login")
    );
  });
});
