import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// vi.mock paths resolve from the TEST FILE location: src/__tests__/
// App.jsx lives at src/App.jsx, pages live at src/pages/
vi.mock("../pages/Layout", () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));
vi.mock("../pages/Home", () => ({
  default: () => <div>Home</div>,
}));
vi.mock("../pages/Studio", () => ({
  default: () => <div>Studio</div>,
}));
vi.mock("../pages/Video", () => ({
  default: () => <div>Video</div>,
}));
vi.mock("../pages/Login", () => ({
  default: () => <div>Login</div>,
}));
vi.mock("../pages/Signup", () => ({
  default: () => <div>Signup</div>,
}));
vi.mock("../pages/Channel", () => ({
  default: () => <div>Channel</div>,
}));
vi.mock("../pages/CreateChannel", () => ({
  default: () => <div>CreateChannel</div>,
}));

import App from "../App";

// App defines its own BrowserRouter so we render it directly.
// jsdom defaults location to '/' which activates the Home route.
describe("App routing", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("renders the Home page at '/'", () => {
    render(<App />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("wraps the Home page in the Layout", () => {
    render(<App />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
});

// App defines its own BrowserRouter so we render it directly.
// jsdom defaults location to '/' which activates the Home route.
describe("App routing", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("renders the Home page at '/'", () => {
    render(<App />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("wraps the Home page in the Layout", () => {
    render(<App />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
});
