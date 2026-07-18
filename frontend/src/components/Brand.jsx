import { Link } from "react-router-dom";

// Voxen brand lockup. The wordmark asset is white on transparent;
// in light mode we invert it to black via the `.brand-logo` CSS rule.
// Lockup = compact mark-in-conic-ring glyph + wordmark.
export default function Brand({ to = "/", className = "", height = 26 }) {
  return (
    <Link
      to={to}
      aria-label="Voxen — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative grid h-[30px] w-[30px] shrink-0 place-items-center"
      >
        <span className="ring-conic absolute inset-0 animate-spinSlow rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src="/mark.png"
          alt=""
          style={{ height: 15 }}
          className="brand-logo relative w-auto select-none"
          draggable="false"
        />
      </span>
      <img
        src="/brand-wordmark.png"
        alt="Voxen"
        height={height}
        style={{ height }}
        className="brand-logo w-auto select-none"
        draggable="false"
      />
    </Link>
  );
}

// Compact V mark (icon only) — transparent white, inverts in light mode.
// At >=24px it sits inside a slow-spinning conic accent ring; below that
// the ring has no room, so the plain mark renders exactly as before.
export function BrandMark({ size = 32, className = "" }) {
  if (size < 24) {
    return (
      <img
        src="/mark.png"
        alt="Voxen"
        width={size}
        height={size}
        style={{ height: size, width: "auto" }}
        className={`brand-logo select-none ${className}`}
        draggable="false"
      />
    );
  }
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden="true"
        className="ring-conic absolute inset-0 animate-spinSlow rounded-full opacity-80"
      />
      <img
        src="/mark.png"
        alt="Voxen"
        width={size}
        height={size}
        style={{ height: Math.round(size * 0.52), width: "auto" }}
        className="brand-logo relative select-none"
        draggable="false"
      />
    </span>
  );
}
