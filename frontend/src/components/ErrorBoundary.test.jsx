import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./ErrorBoundary.jsx";

let container;
let root;

const Boom = () => {
  throw new Error("render exploded");
};
const Fine = () => <p>call is running</p>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  // React logs caught render errors; keep the suite output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    act(() => root.render(<ErrorBoundary><Fine /></ErrorBoundary>));
    expect(container.textContent).toContain("call is running");
  });

  // Without the boundary this unmounts the tree and leaves a blank page — no
  // message and no way back, which mid-call reads as the app vanishing.
  it("shows a recovery screen instead of a blank page when a child throws", () => {
    act(() => root.render(<ErrorBoundary><Boom /></ErrorBoundary>));

    expect(container.textContent).toContain("Something broke on this screen");
    expect(container.textContent.trim().length).toBeGreaterThan(0);
  });

  it("offers a way out", () => {
    act(() => root.render(<ErrorBoundary><Boom /></ErrorBoundary>));

    const labels = [...container.querySelectorAll("button")].map((b) =>
      b.textContent.toLowerCase()
    );
    expect(labels.some((l) => l.includes("reload"))).toBe(true);
    expect(labels.some((l) => l.includes("home"))).toBe(true);
  });

  it("logs the failure so it is diagnosable", () => {
    act(() => root.render(<ErrorBoundary><Boom /></ErrorBoundary>));
    expect(console.error).toHaveBeenCalled();
  });
});
