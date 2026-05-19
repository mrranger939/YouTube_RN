import { describe, it, expect, vi, beforeEach } from "vitest";

// config/api.js throws at load time if VITE_API_BASE_URL is missing,
// so we test it via dynamic import after stubbing the env.

describe("config/api", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exports API_BASE_URL equal to VITE_API_BASE_URL env var", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://test-api.example.com");
    const { API_BASE_URL } = await import("../../config/api");
    expect(API_BASE_URL).toBe("http://test-api.example.com");
    vi.unstubAllEnvs();
  });

  it("throws an error when VITE_API_BASE_URL is not set", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    await expect(import("../../config/api")).rejects.toThrow(
      "Missing VITE_API_BASE_URL"
    );
    vi.unstubAllEnvs();
  });
});
