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
    <footer className="relative border-t border-line/10 bg-surface/40 py-16">
      <div className="container-base">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Brand />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Real-time AI translation, transcription and insight for every call.
              Speak your language — be understood in theirs.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-mint" />
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
                    <a className="transition-colors hover:text-primary" href="#">
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
