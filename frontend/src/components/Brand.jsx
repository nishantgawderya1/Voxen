import { Link } from "react-router-dom";

// Voxen brand lockup. The wordmark asset is white on transparent;
// in light mode we invert it to black via the `.brand-logo` CSS rule.
export default function Brand({ to = "/", className = "", height = 26 }) {
  return (
    <Link
      to={to}
      aria-label="Voxen — home"
      className={`inline-flex items-center ${className}`}
    >
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
export function BrandMark({ size = 32, className = "" }) {
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
