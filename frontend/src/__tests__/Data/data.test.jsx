import { describe, it, expect } from "vitest";
import { genres } from "../../Data/VideoGenre";
import { videoType } from "../../Data/VideoType";
import {
  mainLinks,
  youLinks,
  exploreLinks,
  accountLinks,
} from "../../Data/SidebarData";

// ── VideoGenre ────────────────────────────────────────────────────────────────
describe("VideoGenre data", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(genres)).toBe(true);
    expect(genres.length).toBeGreaterThan(0);
  });

  it("every genre has a string label and a string key", () => {
    genres.forEach((g) => {
      expect(typeof g.label).toBe("string");
      expect(typeof g.key).toBe("string");
    });
  });

  it("keys are lowercase with no spaces", () => {
    genres.forEach((g) => {
      expect(g.key).toMatch(/^[a-z_]+$/);
    });
  });

  it("contains the 'gaming' genre", () => {
    expect(genres.some((g) => g.key === "gaming")).toBe(true);
  });
});

// ── VideoType ─────────────────────────────────────────────────────────────────
describe("VideoType data", () => {
  it("has exactly 2 entries", () => {
    expect(videoType).toHaveLength(2);
  });

  it("contains 'video' and 'short' keys", () => {
    const keys = videoType.map((t) => t.key);
    expect(keys).toContain("video");
    expect(keys).toContain("short");
  });

  it("every type has a string label and a string key", () => {
    videoType.forEach((t) => {
      expect(typeof t.label).toBe("string");
      expect(typeof t.key).toBe("string");
    });
  });
});

// ── SidebarData ───────────────────────────────────────────────────────────────
describe("SidebarData", () => {
  const allLinkGroups = { mainLinks, youLinks, exploreLinks, accountLinks };

  it("exports mainLinks, youLinks, exploreLinks, and accountLinks arrays", () => {
    Object.values(allLinkGroups).forEach((group) => {
      expect(Array.isArray(group)).toBe(true);
    });
  });

  it("every link has a label and an href", () => {
    Object.values(allLinkGroups).forEach((group) => {
      group.forEach((item) => {
        expect(typeof item.label).toBe("string");
        expect(typeof item.href).toBe("string");
      });
    });
  });

  it("mainLinks contains a Home entry pointing to '/'", () => {
    const home = mainLinks.find((l) => l.label === "Home");
    expect(home).toBeDefined();
    expect(home.href).toBe("/");
  });

  it("youLinks contains a Your Channel entry", () => {
    expect(youLinks.some((l) => l.label === "Your Channel")).toBe(true);
  });
});
