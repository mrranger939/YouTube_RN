import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatDuration,
  formatViews,
  formatUploadTime,
} from "../../utils/formatter";

// ── formatDuration ────────────────────────────────────────────────────────────
describe("formatDuration", () => {
  it("returns singular 'minute' for 60 seconds", () => {
    expect(formatDuration(60)).toBe("1 minute");
  });

  it("returns plural 'minutes' for 120 seconds", () => {
    expect(formatDuration(120)).toBe("2 minutes");
  });

  it("returns '0 minute' for less than 60 seconds", () => {
    expect(formatDuration(30)).toBe("0 minute");
  });

  it("returns singular 'hour' for exactly 3600 seconds", () => {
    expect(formatDuration(3600)).toBe("1 hour");
  });

  it("returns plural 'hours' for 7200 seconds", () => {
    expect(formatDuration(7200)).toBe("2 hours");
  });

  it("returns hours not minutes when hours > 0", () => {
    // 5400s = 90 min = 1.5 hours → floors to 1 hour
    expect(formatDuration(5400)).toBe("1 hour");
  });
});

// ── formatViews ───────────────────────────────────────────────────────────────
describe("formatViews", () => {
  it("returns the raw number as string for < 1000 views", () => {
    expect(formatViews(500)).toBe("500");
  });

  it("returns '0' for zero views", () => {
    expect(formatViews(0)).toBe("0");
  });

  it("returns decimal K format for 1000–9999 views", () => {
    expect(formatViews(1000)).toBe("1.0K");
    expect(formatViews(5500)).toBe("5.5K");
  });

  it("returns floored K format for 10000–999999 views", () => {
    expect(formatViews(10000)).toBe("10K");
    expect(formatViews(99999)).toBe("99K");
  });

  it("returns M format with one decimal for >= 1 000 000 views", () => {
    expect(formatViews(1000000)).toBe("1.0M");
    expect(formatViews(2500000)).toBe("2.5M");
  });
});

// ── formatUploadTime ──────────────────────────────────────────────────────────
describe("formatUploadTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns singular 'second ago' for exactly 1 second ago", () => {
    const ts = new Date("2024-01-01T11:59:59Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 second ago");
  });

  it("returns plural 'seconds ago' for < 60 seconds", () => {
    const ts = new Date("2024-01-01T11:59:30Z").toISOString();
    expect(formatUploadTime(ts)).toBe("30 seconds ago");
  });

  it("returns singular 'minute ago' for exactly 1 minute", () => {
    const ts = new Date("2024-01-01T11:59:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 minute ago");
  });

  it("returns plural 'minutes ago' for < 1 hour", () => {
    const ts = new Date("2024-01-01T11:30:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("30 minutes ago");
  });

  it("returns singular 'hour ago' for exactly 1 hour", () => {
    const ts = new Date("2024-01-01T11:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 hour ago");
  });

  it("returns plural 'hours ago' for < 1 day", () => {
    const ts = new Date("2024-01-01T06:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("6 hours ago");
  });

  it("returns singular 'day ago' for exactly 1 day", () => {
    const ts = new Date("2023-12-31T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 day ago");
  });

  it("returns plural 'days ago' for < 1 week", () => {
    const ts = new Date("2023-12-28T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("4 days ago");
  });

  it("returns singular 'week ago' for exactly 1 week", () => {
    const ts = new Date("2023-12-25T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 week ago");
  });

  it("returns plural 'weeks ago' for < 1 month", () => {
    const ts = new Date("2023-12-11T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("3 weeks ago");
  });

  it("returns plural 'months ago' for < 1 year", () => {
    const ts = new Date("2023-07-01T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toMatch(/months ago/);
  });

  it("returns singular 'year ago' for exactly 1 year", () => {
    const ts = new Date("2023-01-01T12:00:00Z").toISOString();
    expect(formatUploadTime(ts)).toBe("1 year ago");
  });
});
