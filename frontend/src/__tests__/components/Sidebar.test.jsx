import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock heroui scroll shadow
vi.mock("@heroui/react", () => ({
  ScrollShadow: ({ children }) => <div data-testid="scroll-shadow">{children}</div>,
}));

// Mock SidebarItem so we can check what gets rendered
vi.mock("../../components/SidebarItem", () => ({
  default: ({ label }) => <a data-testid="sidebar-item">{label}</a>,
}));

// Mock sidebarData
vi.mock("../../Data/sidebarData", () => ({
  mainLinks:    [{ label: "Home", href: "/" }],
  youLinks:     [{ label: "History", href: "#" }],
  exploreLinks: [{ label: "Gaming", href: "#" }],
  accountLinks: [{ label: "Settings", href: "#" }],
}));

import Sidebar from "../../components/Sidebar";

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(<Sidebar sidebarOpen={false} />);
  });

  it("adds 'open' class when sidebarOpen is true", () => {
    const { container } = render(<Sidebar sidebarOpen={true} />);
    expect(container.firstChild).toHaveClass("open");
  });

  it("does not add 'open' class when sidebarOpen is false", () => {
    const { container } = render(<Sidebar sidebarOpen={false} />);
    expect(container.firstChild).not.toHaveClass("open");
  });

  it("renders all section headings", () => {
    render(<Sidebar sidebarOpen={false} />);
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });

  it("renders sidebar items for each link group", () => {
    render(<Sidebar sidebarOpen={false} />);
    const items = screen.getAllByTestId("sidebar-item");
    // 1 main + 1 you + 1 explore + 1 account = 4
    expect(items).toHaveLength(4);
  });
});
