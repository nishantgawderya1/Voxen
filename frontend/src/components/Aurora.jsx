// Animated ambient background — drifting color blobs + subtle grid.
// Pure CSS transforms (GPU), fixed behind content, ignores pointer events.
export default function Aurora({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute -top-[15%] left-[8%] h-[46vw] w-[46vw] animate-drift rounded-full bg-primary/25 blur-[120px]" />
      <div
        className="absolute top-[20%] right-[2%] h-[40vw] w-[40vw] animate-drift rounded-full bg-accent/20 blur-[130px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] h-[38vw] w-[38vw] animate-drift rounded-full bg-mint/15 blur-[130px]"
        style={{ animationDelay: "-15s" }}
      />
      {/* top glow + vignette to seat content */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent,rgb(var(--c-bg)/0.35)_70%,rgb(var(--c-bg))_100%)]" />
    </div>
  );
}
