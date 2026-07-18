import { useEffect } from "react";

/**
 * Cursor spotlight: tracks the pointer over every `.spotlight-card`
 * and feeds each card its own --mx / --my CSS vars (consumed by the
 * ::before radial in index.css). One rAF-throttled listener per page.
 */
export function useSpotlight(deps = []) {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return; // touch devices
    let raf = 0;

    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        document.querySelectorAll(".spotlight-card").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (
            e.clientX >= r.left - 80 &&
            e.clientX <= r.right + 80 &&
            e.clientY >= r.top - 80 &&
            e.clientY <= r.bottom + 80
          ) {
            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
            el.style.setProperty("--my", `${e.clientY - r.top}px`);
          }
        });
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * 3D tilt handlers for a card element. Spread the returned props onto
 * the wrapper: <div {...tiltProps(ref)}>. Pure transforms, GPU-only.
 */
export function makeTiltHandlers(ref, { maxX = 8, maxY = 10, glareRef } = {}) {
  const onMouseMove = (e) => {
    // Checked per-event so a live OS-setting change is respected.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${(-py * maxX).toFixed(
      2
    )}deg) rotateY(${(px * maxY).toFixed(2)}deg) translateZ(0)`;
    if (glareRef?.current) {
      glareRef.current.style.background = `radial-gradient(560px circle at ${
        (px + 0.5) * 100
      }% ${(py + 0.5) * 100}%, rgba(255,255,255,0.14), transparent 55%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const onMouseLeave = () => {
    const el = ref.current;
    // Clear instead of writing an identity transform so class-based
    // transforms (if any) win back control.
    if (el) el.style.transform = "";
    if (glareRef?.current) glareRef.current.style.opacity = "0";
  };

  return { onMouseMove, onMouseLeave };
}
