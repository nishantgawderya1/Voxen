import { Link } from "react-router-dom";

// Voxen wordmark with an animated conic "signal" glyph.
export default function Brand({ to = "/", className = "" }) {
  return (
    <Link to={to} className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-line/10">
        <span className="absolute inset-0 animate-spinSlow bg-[conic-gradient(from_0deg,rgb(var(--c-primary)),rgb(var(--c-accent)),rgb(var(--c-mint)),rgb(var(--c-primary)))] opacity-90" />
        <span className="absolute inset-[1.5px] rounded-[10px] bg-surface" />
        <svg
          className="relative z-10 text-text"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 12c2.5 0 2.5-5 5-5s2.5 10 5 10 2.5-5 5-5" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-text font-display">
        Voxen
      </span>
    </Link>
  );
}
