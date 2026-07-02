// Branded loading screen — used as the Suspense fallback and while auth is
// being resolved, so transitions fade smoothly instead of flashing blank.
export default function Loader({ label = "Loading…", fullscreen = true }) {
  return (
    <div
      className={`${
        fullscreen ? "fixed inset-0" : "w-full py-24"
      } z-50 flex animate-fadeUp flex-col items-center justify-center gap-6 bg-bg`}
    >
      <div className="relative grid h-16 w-16 place-items-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
        <img
          src="/mark.png"
          alt=""
          aria-hidden
          className="brand-logo h-6 w-auto opacity-90"
          draggable="false"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/brand-wordmark.png"
          alt="Voxen"
          className="brand-logo h-5 w-auto opacity-90"
          draggable="false"
        />
        <span className="text-sm text-muted">{label}</span>
      </div>
    </div>
  );
}
