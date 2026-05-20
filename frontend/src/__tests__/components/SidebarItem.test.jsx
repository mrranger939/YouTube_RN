import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarItem from "../../components/SidebarItem";

describe("SidebarItem", () => {
  it("renders the label text", () => {
    render(<SidebarItem href="/home" label="Home" icon={null} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders an anchor with the correct href", () => {
    render(<SidebarItem href="/studio" label="Studio" icon={null} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/studio");
  });

  it("renders the icon when provided", () => {
    const icon = <svg data-testid="test-icon" />;
    render(<SidebarItem href="/" label="Label" icon={icon} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies hover-style class to the anchor", () => {
    render(<SidebarItem href="/" label="X" icon={null} />);
    expect(screen.getByRole("link")).toHaveClass("hover:bg-gray-300");
  });
});
