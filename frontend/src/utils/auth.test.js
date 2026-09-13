import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { getToken, setToken, clearToken, isAuthenticated } from "./auth.js";

describe("token handling", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("round-trips a token", () => {
    setToken("abc.def.ghi");
    expect(getToken()).toBe("abc.def.ghi");
    expect(isAuthenticated()).toBe(true);
  });

  it("reports signed-out when there is no token", () => {
    expect(getToken()).toBe(null);
    expect(isAuthenticated()).toBe(false);
  });

  it("treats an empty token as signed out", () => {
    setToken("");
    expect(isAuthenticated()).toBe(false);
  });

  it("clears the token", () => {
    setToken("abc");
    clearToken();
    expect(getToken()).toBe(null);
    expect(isAuthenticated()).toBe(false);
  });

  // Private browsing and blocked site data make localStorage throw rather than
  // return null. The app must report "signed out", not crash on boot.
  it("survives localStorage throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() => setToken("abc")).not.toThrow();
    expect(() => clearToken()).not.toThrow();
    expect(getToken()).toBe(null);
    expect(isAuthenticated()).toBe(false);
  });
});
