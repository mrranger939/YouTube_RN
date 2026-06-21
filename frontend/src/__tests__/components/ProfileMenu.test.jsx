import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@heroui/react", () => ({
  Popover: ({ children }) => <div>{children}</div>,
  PopoverTrigger: ({ children }) => <div>{children}</div>,
  PopoverContent: ({ children }) => <div data-testid="popover-content">{children}</div>,
}));

import ProfileMenu from "../../components/ProfileMenu";

describe("ProfileMenu", () => {
  it("renders the profile image with the given src", () => {
    render(<ProfileMenu profilePic="http://example.com/pic.jpg" logout={vi.fn()} />);
    expect(screen.getByAltText("Profile")).toHaveAttribute(
      "src",
      "http://example.com/pic.jpg"
    );
  });

  it("renders a link to /createChannel", () => {
    render(<ProfileMenu profilePic="pic.jpg" logout={vi.fn()} />);
    const link = screen.getByText("Your Channel").closest("a");
    expect(link).toHaveAttribute("href", "/createChannel");
  });

  it("calls logout when the LogOut item is clicked", async () => {
    const logout = vi.fn();
    render(<ProfileMenu profilePic="pic.jpg" logout={logout} />);
    await userEvent.click(screen.getByText("LogOut"));
    expect(logout).toHaveBeenCalledOnce();
  });

  it("renders the Settings menu item", () => {
    render(<ProfileMenu profilePic="pic.jpg" logout={vi.fn()} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
