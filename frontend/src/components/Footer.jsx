import Brand from "./Brand.jsx";

const groups = [
  {
    title: "Product",
    items: ["Features", "Translation", "Transcripts", "Security"],
  },
  { title: "Company", items: ["About", "Careers", "Blog", "Contact"] },
  { title: "Legal", items: ["Privacy", "Terms", "Status", "DPA"] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface/40 py-16">
      {/* Gradient hairline top edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      {/* Giant faded background wordmark */}
      <img
        src="/brand-wordmark.png"
        alt=""
        aria-hidden="true"
        className="brand-logo pointer-events-none absolute -bottom-4 left-1/2 w-[120%] max-w-none -translate-x-1/2 select-none opacity-[0.04] sm:w-[90%]"
        draggable="false"
      />

      <div className="container-base relative">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Brand />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Real-time AI translation, transcription and insight for every call.
              Speak your language — be understood in theirs.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint shadow-[0_0_10px] shadow-mint/60" />
              All systems operational · 99.9% uptime
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <div className="mb-4 text-xs font-medium uppercase tracking-wider text-text">
                {g.title}
              </div>
              <ul className="space-y-2.5 text-sm text-muted">
                {g.items.map((i) => (
                  <li key={i}>
                    <a
                      className="inline-block transition-[transform,color] duration-200 hover:translate-x-0.5 hover:text-primary"
                      href="#"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line/10 pt-6 text-xs text-muted sm:flex-row">
          <p>© {2026} Voxen AI. All rights reserved.</p>
          <p>Made for conversations without borders.</p>
        </div>
      </div>
    </footer>
  );
}
