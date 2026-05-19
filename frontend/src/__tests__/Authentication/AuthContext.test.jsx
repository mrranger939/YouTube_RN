import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../Authentication/AuthContext";

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Helper component that exposes auth context values through the DOM
function AuthConsumer() {
  const { isAuthenticated, username, profilePic, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="isAuthenticated">{String(isAuthenticated)}</span>
      <span data-testid="username">{username ?? "null"}</span>
      <span data-testid="profilePic">{profilePic ?? "null"}</span>
      <button data-testid="loginBtn" onClick={() => login("fake-token")}>
        login
      </button>
      <button data-testid="logoutBtn" onClick={logout}>
        logout
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts unauthenticated when no cookie is present", () => {
    Cookies.get.mockReturnValue(undefined);

    renderWithProvider();

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("username").textContent).toBe("null");
  });

  it("reads an existing valid cookie on mount and sets authenticated state", () => {
    Cookies.get.mockReturnValue("valid-token");
    jwtDecode.mockReturnValue({ username: "alice", vid: "pic.jpg" });

    renderWithProvider();

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("username").textContent).toBe("alice");
    expect(screen.getByTestId("profilePic").textContent).toBe("pic.jpg");
  });

  it("stays unauthenticated when the stored token is invalid", () => {
    Cookies.get.mockReturnValue("bad-token");
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    renderWithProvider();

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
  });

  it("login() sets authenticated state from the supplied token", async () => {
    Cookies.get.mockReturnValue(undefined);
    jwtDecode.mockReturnValue({ username: "bob", vid: "bob.png" });

    renderWithProvider();

    await act(async () => {
      await userEvent.click(screen.getByTestId("loginBtn"));
    });

    expect(Cookies.set).toHaveBeenCalledWith("authToken", "fake-token", {
      expires: 1,
    });
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("username").textContent).toBe("bob");
  });

  it("logout() clears authenticated state and removes the cookie", async () => {
    Cookies.get.mockReturnValue("valid-token");
    jwtDecode.mockReturnValue({ username: "carol", vid: "carol.jpg" });

    renderWithProvider();

    await act(async () => {
      await userEvent.click(screen.getByTestId("logoutBtn"));
    });

    expect(Cookies.remove).toHaveBeenCalledWith("authToken");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("username").textContent).toBe("null");
  });
});
