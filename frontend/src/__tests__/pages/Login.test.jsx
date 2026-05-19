import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
vi.mock("js-cookie", () => ({ default: { set: vi.fn(), get: vi.fn() } }));
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  Navigate: () => null,
  useNavigate: () => vi.fn(),
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
}));

import axios from "axios";
import Login from "../../pages/Login";

describe("Login page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the Login heading", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders a link to the signup page", () => {
    render(<Login />);
    expect(screen.getByText(/create account/i).closest("a")).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("accepts user input for email", async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("submits the form and calls axios.post", async () => {
    axios.post.mockResolvedValue({ data: { message: "fail" } });
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/password/i), "pass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce());
  });
});
