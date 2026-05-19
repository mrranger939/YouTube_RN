import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<SearchBar />);
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("input has placeholder text 'Search'", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("wraps everything in a form element", () => {
    const { container } = render(<SearchBar />);
    expect(container.querySelector("form")).not.toBeNull();
  });

  it("input name is search_key", () => {
    render(<SearchBar />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "search_key");
  });
});
