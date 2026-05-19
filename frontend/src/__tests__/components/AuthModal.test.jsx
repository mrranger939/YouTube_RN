import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@heroui/react", () => ({
  Modal: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
  ModalContent: ({ children }) => <div>{children(vi.fn())}</div>,
  Link: ({ children, onClick }) => (
    <a data-testid="toggle-link" onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock("../../components/LoginComponent", () => ({
  default: () => <div data-testid="login-component">Login</div>,
}));

vi.mock("../../components/SignupComponent", () => ({
  default: () => <div data-testid="signup-component">Signup</div>,
}));

import AuthModal from "../../components/AuthModal";

describe("AuthModal", () => {
  it("renders nothing when isOpen is false", () => {
    render(<AuthModal isOpen={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("shows LoginComponent by default when open", () => {
    render(<AuthModal isOpen={true} onOpenChange={vi.fn()} />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  it("shows 'Create account' toggle link when showing login", () => {
    render(<AuthModal isOpen={true} onOpenChange={vi.fn()} />);
    expect(screen.getByTestId("toggle-link").textContent).toBe("Create account");
  });

  it("switches to SignupComponent when toggle link is clicked", async () => {
    render(<AuthModal isOpen={true} onOpenChange={vi.fn()} />);
    await userEvent.click(screen.getByTestId("toggle-link"));
    expect(screen.getByTestId("signup-component")).toBeInTheDocument();
  });

  it("shows 'Login' toggle link when showing signup", async () => {
    render(<AuthModal isOpen={true} onOpenChange={vi.fn()} />);
    await userEvent.click(screen.getByTestId("toggle-link"));
    expect(screen.getByTestId("toggle-link").textContent).toBe("Login");
  });
});
