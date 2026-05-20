import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("../../Authentication/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../components/SearchBar", () => ({
  default: () => <input placeholder="Search" />,
}));

vi.mock("../../components/ProfileMenu", () => ({
  default: ({ logout }) => (
    <button data-testid="profile-menu" onClick={logout}>
      ProfileMenu
    </button>
  ),
}));

vi.mock("../../components/AuthModal", () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="auth-modal" /> : null),
}));

vi.mock("@heroui/react", () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onOpenChange: vi.fn(),
  }),
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`} />,
}));

vi.mock("@fortawesome/free-solid-svg-icons", () => ({
  faBell: { iconName: "bell" },
  faUserCircle: { iconName: "user-circle" },
  faVideo: { iconName: "video" },
  faBars: { iconName: "bars" },
}));

import { useAuth } from "../../Authentication/AuthContext";
import Navbar from "../../components/Navbar";

describe("Navbar", () => {
  it("renders the menu button", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, profilePic: null, logout: vi.fn() });
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByTitle("Menu")).toBeInTheDocument();
  });

  it("calls onMenuClick when the menu button is clicked", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, profilePic: null, logout: vi.fn() });
    const onMenuClick = vi.fn();
    render(<Navbar onMenuClick={onMenuClick} />);
    await userEvent.click(screen.getByTitle("Menu"));
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("shows Upload link when authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, profilePic: "pic.jpg", logout: vi.fn() });
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByTitle("Upload").tagName).toBe("A");
  });

  it("shows Upload button (not link) when not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, profilePic: null, logout: vi.fn() });
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByTitle("Upload").tagName).toBe("BUTTON");
  });

  it("shows ProfileMenu when authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, profilePic: "pic.jpg", logout: vi.fn() });
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
  });

  it("shows profile icon button when not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, profilePic: null, logout: vi.fn() });
    render(<Navbar onMenuClick={vi.fn()} />);
    expect(screen.getByTitle("Profile")).toBeInTheDocument();
  });
});
