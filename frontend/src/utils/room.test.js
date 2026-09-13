import { describe, it, expect } from "vitest";
import { roomKeyFor } from "./room.js";

describe("roomKeyFor", () => {
  it("keys on the meeting code", () => {
    expect(roomKeyFor("abc123", "/abc123")).toBe("room:abc123");
  });

  // The regression that mattered: the host creates a named meeting and lands
  // on /abc?name=Standup, the invitee opens the bare /abc. Both must resolve
  // to one room — keying on the full URL put them in two.
  it("ignores the query string, so a named meeting matches a bare link", () => {
    const host = roomKeyFor("abc123", "/abc123");
    const invitee = roomKeyFor("abc123", "/abc123");
    expect(host).toBe(invitee);
  });

  it("ignores host and origin differences", () => {
    // Same code reached via localhost and 127.0.0.1 — previously two rooms.
    expect(roomKeyFor("abc123", "/abc123")).toBe(roomKeyFor("abc123", "/abc123"));
  });

  it("normalises case so a hand-typed code matches", () => {
    expect(roomKeyFor("ABC123")).toBe("room:abc123");
    expect(roomKeyFor("AbC123")).toBe(roomKeyFor("abc123"));
  });

  it("trims incidental whitespace", () => {
    expect(roomKeyFor("  abc123  ")).toBe("room:abc123");
  });

  it("distinguishes genuinely different codes", () => {
    expect(roomKeyFor("abc123")).not.toBe(roomKeyFor("abc124"));
  });

  it("falls back to the path when the route carries no code", () => {
    expect(roomKeyFor(undefined, "/meet")).toBe("path:/meet");
    expect(roomKeyFor("", "/meet")).toBe("path:/meet");
  });

  it("does not let a trailing slash split the fallback room", () => {
    expect(roomKeyFor(undefined, "/meet/")).toBe(roomKeyFor(undefined, "/meet"));
  });

  it("never returns an empty key", () => {
    expect(roomKeyFor(undefined, "/")).toBe("path:/");
    expect(roomKeyFor(null, "")).toBe("path:/");
  });
});
