import { describe, it, expect, vi, beforeEach } from "vitest";
import { resizeImage } from "../../utils/imageUtils";

describe("resizeImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a Blob when the image loads successfully", async () => {
    const fakeFile = new File(["content"], "test.jpg", { type: "image/jpeg" });

    // Override Image so onload fires synchronously
    const MockImage = class {
      constructor() {
        this.width = 800;
        this.height = 600;
      }
      set src(_) {
        // trigger onload on next microtask so the promise resolves
        Promise.resolve().then(() => this.onload());
      }
    };
    vi.stubGlobal("Image", MockImage);

    const result = await resizeImage(fakeFile, 720, 404);
    expect(result).toBeInstanceOf(Blob);
  });

  it("returns null when the image fails to load", async () => {
    const fakeFile = new File(["bad"], "bad.jpg", { type: "image/jpeg" });

    const MockImage = class {
      set src(_) {
        Promise.resolve().then(() => this.onerror());
      }
    };
    vi.stubGlobal("Image", MockImage);

    const result = await resizeImage(fakeFile, 720, 404);
    expect(result).toBeNull();
  });

  it("calls URL.createObjectURL and URL.revokeObjectURL", async () => {
    const fakeFile = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const MockImage = class {
      constructor() {
        this.width = 400;
        this.height = 300;
      }
      set src(_) {
        Promise.resolve().then(() => this.onload());
      }
    };
    vi.stubGlobal("Image", MockImage);

    await resizeImage(fakeFile, 100, 100);
    expect(URL.createObjectURL).toHaveBeenCalledWith(fakeFile);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});
