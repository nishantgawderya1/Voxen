import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./Brand.jsx";

const phrases = [
  { from: "नमस्ते, क्या हम शुरू करें?", lang: "HI", to: "Hi, shall we get started?" },
  { from: "¿Puedes ver mi pantalla?", lang: "ES", to: "Can you see my screen?" },
  { from: "Bonjour à toute l'équipe !", lang: "FR", to: "Hello to the whole team!" },
  { from: "これで完璧です。", lang: "JA", to: "This looks perfect." },
];

const chips = ["EN", "हिन्दी", "ES", "日本語", "FR", "中文", "AR", "DE"];

const people = [
  { name: "Aria", hue: "from-primary/70 to-accent/50", initials: "AR" },
  { name: "Kenji", hue: "from-accent/70 to-mint/50", initials: "KS" },
  { name: "Sofia", hue: "from-mint/70 to-primary/50", initials: "SF" },
  { name: "You", hue: "from-primary/60 to-primary/30", initials: "YU", self: true },
];

export default function HeroVisual() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const ref = useRef(null);

  // Cycle phrases + typewriter effect on the translated line.
  useEffect(() => {
    const target = phrases[idx].to;
    setTyped("");
    let i = 0;
    const typer = setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) clearInterval(typer);
    }, 34);
    const next = setTimeout(() => setIdx((v) => (v + 1) % phrases.length), 3600);
    return () => {
      clearInterval(typer);
      clearTimeout(next);
    };
  }, [idx]);

  const current = phrases[idx];

  return (
    <div className="relative">
      {/* status chips */}
      <div className="pointer-events-none absolute -left-6 top-6 z-20 hidden sm:block">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Live · 4 languages
        </span>
      </div>
      <div className="pointer-events-none absolute -right-4 bottom-24 z-20 hidden sm:block">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 120ms latency
        </span>
      </div>

      <div
        ref={ref}
        className="relative rounded-xl border border-line/[0.07] bg-surface p-3"
      >
        {/* window chrome */}
        <div className="mb-3 flex items-center gap-2 px-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <BrandMark size={14} className="ml-2" />
          <span className="text-xs font-medium text-muted">· Product Sync</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-danger/12 px-2 py-0.5 text-[10px] font-medium text-danger">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" /> REC
          </span>
        </div>

        {/* participant grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {people.map((p) => (
            <div
              key={p.name}
              className={`relative aspect-[16/11] overflow-hidden rounded-2xl border border-line/10 bg-gradient-to-br ${p.hue}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_20%,rgb(var(--c-surface)/0.15),rgb(var(--c-surface)/0.75))]" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-surface/70 text-sm font-medium text-text backdrop-blur">
                  {p.initials}
                </div>
              </div>
              <span className="absolute bottom-2 left-2 rounded-md bg-bg/55 px-2 py-0.5 text-[10px] font-medium text-text backdrop-blur">
                {p.name}
              </span>
              {p.self && (
                <span className="absolute right-2 top-2 rounded-md bg-primary/85 px-1.5 py-0.5 text-[9px] font-medium text-primary-fg">
                  YOU
                </span>
              )}
            </div>
          ))}
        </div>

        {/* live translation caption */}
        <div className="mt-3 rounded-2xl border border-line/10 bg-bg/50 p-4 backdrop-blur">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
              {current.lang}
            </span>
            <span className="text-xs font-medium text-muted">Aria is speaking…</span>
            <span className="ml-auto flex gap-0.5">
              {[0, 1, 2, 3].map((b) => (
                <span
                  key={b}
                  className="w-0.5 rounded-full bg-primary"
                  style={{ height: 8 + (b % 3) * 4, animationDelay: `${b * 120}ms`, animationDuration: "0.9s" }}
                />
              ))}
            </span>
          </div>
          <p className="text-[15px] font-medium text-text">{current.from}</p>
          <div className="mt-1.5 flex items-start gap-2">
            <span className="mt-0.5 rounded bg-mint/15 px-1.5 py-0.5 text-[9px] font-medium text-mint">EN</span>
            <p className="min-h-[20px] text-[15px] text-muted">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-primary align-middle" />
            </p>
          </div>
        </div>

        {/* supported languages */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="whitespace-nowrap rounded-lg border border-line/[0.07] bg-surface2 px-2.5 py-1 text-[11px] font-medium text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
