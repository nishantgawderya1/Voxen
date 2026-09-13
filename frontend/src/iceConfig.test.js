import { describe, it, expect, vi, beforeEach } from "vitest";

// iceConfig reads import.meta.env when the module is first evaluated, so each
// case stubs the env and re-imports.
const loadWith = async (env) => {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return import("./iceConfig.js");
};

describe("ICE configuration", () => {
  beforeEach(() => vi.unstubAllEnvs());

  it("always offers STUN servers", async () => {
    const { iceServers, hasTurn } = await loadWith({ VITE_TURN_URLS: "" });
    expect(hasTurn).toBe(false);
    expect(iceServers.length).toBeGreaterThan(0);
    expect(iceServers.every((s) => s.urls)).toBe(true);
    expect(JSON.stringify(iceServers)).toContain("stun:");
  });

  // Without TURN, calls fail behind symmetric NAT — so a configured relay has
  // to actually reach the peer connection, credentials included.
  it("appends a TURN entry when configured", async () => {
    const { iceServers, hasTurn } = await loadWith({
      VITE_TURN_URLS: "turn:turn.example.com:3478",
      VITE_TURN_USERNAME: "user",
      VITE_TURN_CREDENTIAL: "secret",
    });

    expect(hasTurn).toBe(true);
    const turn = iceServers.find((s) => JSON.stringify(s.urls).includes("turn:"));
    expect(turn).toBeDefined();
    expect(turn.username).toBe("user");
    expect(turn.credential).toBe("secret");
  });

  it("accepts several comma-separated TURN URLs", async () => {
    const { iceServers } = await loadWith({
      VITE_TURN_URLS: "turn:a.example.com:3478, turns:b.example.com:5349",
      VITE_TURN_USERNAME: "u",
      VITE_TURN_CREDENTIAL: "c",
    });

    const turn = iceServers.find((s) => Array.isArray(s.urls));
    expect(turn.urls).toEqual([
      "turn:a.example.com:3478",
      "turns:b.example.com:5349",
    ]);
  });

  it("ignores blank entries in the URL list", async () => {
    const { iceServers, hasTurn } = await loadWith({
      VITE_TURN_URLS: " , ,",
    });
    expect(hasTurn).toBe(false);
    expect(iceServers.every((s) => JSON.stringify(s.urls).includes("stun:"))).toBe(true);
  });
});
