// Layered ambient atmosphere: drifting color fields, a fine grid,
// a perspective floor and a top light. GPU transforms only.
export default function Aurora({ floor = false, className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-70" />

      {floor && (
        <div className="grid-floor absolute inset-x-[-20%] top-[52%] h-[70vh] opacity-80" />
      )}

      <div className="absolute -top-[18%] left-[6%] h-[48vw] w-[48vw] animate-drift rounded-full bg-primary/20 blur-[130px]" />
      <div
        className="absolute top-[16%] right-[0%] h-[42vw] w-[42vw] animate-drift rounded-full bg-accent/14 blur-[140px]"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="absolute bottom-[-12%] left-[28%] h-[40vw] w-[40vw] animate-drift rounded-full bg-mint/10 blur-[140px]"
        style={{ animationDelay: "-16s" }}
      />

      {/* top light + vignette that seats content into the page */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_-15%,transparent,rgb(var(--c-bg)/0.4)_70%,rgb(var(--c-bg))_100%)]" />
    </div>
  );
}
