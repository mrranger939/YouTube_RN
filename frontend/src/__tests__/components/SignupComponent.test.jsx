import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
vi.mock("../../config/api", () => ({ API_BASE_URL: "http://localhost:3000" }));
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
  Button: ({ children, type }) => <button type={type}>{children}</button>,
}));

import axios from "axios";
import SignupComponent from "../../components/SignupComponent";

describe("SignupComponent", () => {
  const setShowLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Create Account heading", () => {
    render(<SignupComponent setShowLogin={setShowLogin} />);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("renders username, email, and password inputs", () => {
    render(<SignupComponent setShowLogin={setShowLogin} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    render(<SignupComponent setShowLogin={setShowLogin} />);
    const usernameInput = screen.getByLabelText(/username/i);
    await userEvent.type(usernameInput, "alice");
    expect(usernameInput).toHaveValue("alice");
  });

  it("posts form data on submit", async () => {
    axios.post.mockResolvedValue({ data: { message: "fail" } });
    render(<SignupComponent setShowLogin={setShowLogin} />);

    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password");

    const form = screen.getByLabelText(/username/i).closest("form");
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce());
  });

  it("calls setShowLogin(true) on successful signup", async () => {
    axios.post.mockResolvedValue({ data: { message: "success" } });
    render(<SignupComponent setShowLogin={setShowLogin} />);

    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password");

    const form = screen.getByLabelText(/username/i).closest("form");
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    await waitFor(() => expect(setShowLogin).toHaveBeenCalledWith(true));
  });
});
