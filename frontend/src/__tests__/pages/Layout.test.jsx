import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Heavy child components are mocked so Layout tests stay isolated
vi.mock("../../components/Navbar", () => ({
  default: ({ onMenuClick }) => (
    <button data-testid="menu-btn" onClick={onMenuClick}>
      Navbar
    </button>
  ),
}));

vi.mock("../../components/Sidebar", () => ({
  default: ({ sidebarOpen }) => (
    <div data-testid="sidebar" data-open={String(sidebarOpen)} />
  ),
}));

import Layout from "../../pages/Layout";

describe("Layout", () => {
  it("renders children", () => {
    render(<Layout><p data-testid="child">Hello</p></Layout>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders Navbar", () => {
    render(<Layout><span /></Layout>);
    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });

  it("sidebar is closed by default", () => {
    render(<Layout><span /></Layout>);
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-open", "false");
  });

  it("toggles sidebar open when menu button is clicked", async () => {
    render(<Layout><span /></Layout>);
    await userEvent.click(screen.getByTestId("menu-btn"));
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-open", "true");
  });

  it("toggles sidebar closed on second click", async () => {
    render(<Layout><span /></Layout>);
    await userEvent.click(screen.getByTestId("menu-btn"));
    await userEvent.click(screen.getByTestId("menu-btn"));
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-open", "false");
  });
});
