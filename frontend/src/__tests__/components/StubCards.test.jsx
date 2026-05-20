import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@heroui/react", () => ({
  User: ({ name, description }) => (
    <div>
      <span data-testid="user-name">{name}</span>
      <span data-testid="user-desc">{description}</span>
    </div>
  ),
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardFooter: ({ children }) => <div>{children}</div>,
  Image: ({ alt, src }) => <img alt={alt} src={src} />,
}));

// Static image imports will resolve to their filename in jsdom
vi.mock("/images/nawaz_logo.jpg", () => ({ default: "nawaz_logo.jpg" }));
vi.mock("/thumbnails/1.webp", () => ({ default: "thumb1.webp" }));
vi.mock("/thumbnails/2.webp", () => ({ default: "thumb2.webp" }));
vi.mock("/thumbnails/3.webp", () => ({ default: "thumb3.webp" }));
vi.mock("/thumbnails/4.webp", () => ({ default: "thumb4.webp" }));

import StubCards from "../../components/StubCards";

describe("StubCards", () => {
  it("renders without crashing", () => {
    render(<StubCards />);
  });

  it("renders at least one card", () => {
    render(<StubCards />);
    expect(screen.getAllByTestId("card").length).toBeGreaterThan(0);
  });

  it("renders the Nawaz user name", () => {
    render(<StubCards />);
    expect(screen.getAllByTestId("user-name")[0]).toHaveTextContent("Nawaz");
  });

  it("shows the stub description with views and time", () => {
    render(<StubCards />);
    // The description is "30.3k views • 69 minutes ago"
    const descs = screen.getAllByTestId("user-desc");
    expect(descs[0].textContent).toMatch(/views/);
  });
});
