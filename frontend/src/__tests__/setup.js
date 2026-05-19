import "@testing-library/jest-dom";

// ── Canvas API stubs ─────────────────────────────────────────────────────────
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: "",
  fillRect: vi.fn(),
  drawImage: vi.fn(),
}));

HTMLCanvasElement.prototype.toBlob = vi.fn((callback, type, quality) => {
  callback(new Blob(["fake"], { type: type || "image/jpeg" }));
});

// ── URL stubs ────────────────────────────────────────────────────────────────
global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = vi.fn();
