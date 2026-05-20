import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock("../../Authentication/AuthContext", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));
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
import LoginComponent from "../../components/LoginComponent";

describe("LoginComponent", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Login heading", () => {
    render(<LoginComponent onClose={onClose} />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginComponent onClose={onClose} />);
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("updates email state when the user types", async () => {
    render(<LoginComponent onClose={onClose} />);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "user@example.com");
    expect(emailInput).toHaveValue("user@example.com");
  });

  it("updates password state when the user types", async () => {
    render(<LoginComponent onClose={onClose} />);
    const pwInput = screen.getByLabelText(/password/i);
    await userEvent.type(pwInput, "secret123");
    expect(pwInput).toHaveValue("secret123");
  });

  it("calls axios.post on form submission", async () => {
    axios.post.mockResolvedValue({ data: { message: "success", token: "tok" } });
    render(<LoginComponent onClose={onClose} />);

    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "a@b.com");
    await userEvent.type(screen.getByLabelText(/password/i), "pass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce());
  });

  it("calls onClose after a successful login", async () => {
    axios.post.mockResolvedValue({ data: { message: "success", token: "tok" } });
    render(<LoginComponent onClose={onClose} />);

    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "a@b.com");
    await userEvent.type(screen.getByLabelText(/password/i), "pass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});
