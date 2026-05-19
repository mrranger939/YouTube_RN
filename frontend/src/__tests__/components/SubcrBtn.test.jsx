import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));
vi.mock("@heroui/react", () => ({
  Button: ({ children, onPress, color, variant }) => (
    <button
      data-color={color}
      data-variant={variant}
      onClick={onPress}
    >
      {children}
    </button>
  ),
}));

import confetti from "canvas-confetti";
import SubcrBtn from "../../components/SubcrBtn";

describe("SubcrBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders 'Subscribe' initially", () => {
    render(<SubcrBtn />);
    expect(screen.getByRole("button")).toHaveTextContent("Subscribe");
  });

  it("toggles to 'Subscribed' after the first click", async () => {
    render(<SubcrBtn />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Subscribed");
  });

  it("toggles back to 'Subscribe' after the second click", async () => {
    render(<SubcrBtn />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Subscribe");
  });

  it("fires confetti on the first click (subscribe action)", async () => {
    render(<SubcrBtn />);
    await userEvent.click(screen.getByRole("button"));
    expect(confetti).toHaveBeenCalledOnce();
  });

  it("does not fire confetti when unsubscribing", async () => {
    render(<SubcrBtn />);
    // subscribe (fires confetti)
    await userEvent.click(screen.getByRole("button"));
    confetti.mockClear();
    // unsubscribe (should NOT fire confetti)
    await userEvent.click(screen.getByRole("button"));
    expect(confetti).not.toHaveBeenCalled();
  });

  it("has 'danger' color initially", () => {
    render(<SubcrBtn />);
    expect(screen.getByRole("button")).toHaveAttribute("data-color", "danger");
  });

  it("switches to 'default' color after subscribing", async () => {
    render(<SubcrBtn />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("data-color", "default");
  });
});
