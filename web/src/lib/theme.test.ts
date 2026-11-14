import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  isTheme,
  readStoredTheme,
  THEME_INIT_SCRIPT,
  THEME_KEY,
} from "./theme";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks();
});

describe("theme", () => {
  it("recognizes the three choices only", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("stores and applies an explicit choice", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
  });

  it("returns to the system setting by clearing both", () => {
    applyTheme("light");
    applyTheme("system");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    expect(readStoredTheme()).toBe("system");
  });

  it("still applies the theme when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => applyTheme("dark")).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("init script applies a stored choice and ignores junk", () => {
    localStorage.setItem(THEME_KEY, "dark");
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe("dark");

    delete document.documentElement.dataset.theme;
    localStorage.setItem(THEME_KEY, "sepia");
    new Function(THEME_INIT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
