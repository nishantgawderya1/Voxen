// Static ambient background — one faint tint + subtle grid, nothing moves.
export default function Aurora({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-[20%] left-1/2 h-[40vw] w-[60vw] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]" />
    </div>
  );
}
