import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./Brand.jsx";
import { makeTiltHandlers } from "../hooks/useInteractive.js";

const phrases = [
  { from: "नमस्ते, क्या हम शुरू करें?", lang: "HI", to: "Hi, shall we get started?" },
  { from: "¿Puedes ver mi pantalla?", lang: "ES", to: "Can you see my screen?" },
  { from: "Bonjour à toute l'équipe !", lang: "FR", to: "Hello to the whole team!" },
  { from: "これで完璧です。", lang: "JA", to: "This looks perfect." },
];

const chips = ["EN", "हिन्दी", "ES", "日本語", "FR", "中文", "AR", "DE"];

const people = [
  { name: "Aria", hue: "from-primary to-accent", initials: "AR" },
  { name: "Kenji", hue: "from-accent to-mint", initials: "KS" },
  { name: "Sofia", hue: "from-mint to-primary", initials: "SF" },
  { name: "You", hue: "from-primary to-primary/80", initials: "YU", self: true },
];

const orbiters = [
  { label: "हिन्दी", r: "175px", delay: "-4s", duration: "26s" },
  { label: "日本語", r: "212px", delay: "-13s", duration: "32s" },
  { label: "ES", r: "238px", delay: "-19s", duration: "24s" },
  { label: "العربية", r: "260px", delay: "-8s", duration: "36s" },
];

export default function HeroVisual() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const tilt = makeTiltHandlers(tiltRef, { maxX: 7, maxY: 9, glareRef });

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
      {/* conic portal ring behind the call window */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[420px] w-[420px] sm:h-[520px] sm:w-[520px]">
          <div className="ring-conic absolute inset-0 animate-spinSlower rounded-full opacity-40" />
          <div className="ring-conic absolute inset-0 animate-spinSlower rounded-full opacity-30 blur-2xl" />
        </div>
      </div>

      {/* orbiting language chips */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        {orbiters.map((o) => (
          <div
            key={o.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span
              className="chip animate-orbit"
              style={{ "--orbit-r": o.r, animationDelay: o.delay, animationDuration: o.duration }}
            >
              {o.label}
            </span>
          </div>
        ))}
      </div>

      {/* status chips */}
      <div className="pointer-events-none absolute -left-6 top-6 z-20 hidden sm:block">
        <span className="chip animate-float">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Live · 4 languages
        </span>
      </div>
      <div className="pointer-events-none absolute -right-4 bottom-24 z-20 hidden sm:block">
        <span className="chip animate-float" style={{ animationDelay: "-3s" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 120ms latency
        </span>
      </div>

      <div
        ref={tiltRef}
        {...tilt}
        className="glass relative rounded-[24px] p-3 transition-transform duration-150 ease-out will-change-transform"
      >
        {/* cursor glare — driven by makeTiltHandlers via glareRef */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-10 rounded-[24px] opacity-0 transition-opacity duration-300"
        />

        {/* window chrome */}
        <div className="mb-3 flex items-center gap-2 px-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <BrandMark size={14} className="ml-2" />
          <span className="text-xs font-medium text-muted">· Product Sync</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-danger/12 px-2 py-0.5 text-[10px] font-medium text-danger">
            <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-danger" /> REC
          </span>
        </div>

        {/* participant grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {people.map((p) => (
            <div
              key={p.name}
              className={`relative aspect-[16/11] overflow-hidden rounded-2xl border border-line/10 bg-gradient-to-br ${p.hue} shadow-[inset_0_1px_0_rgb(var(--c-line)/0.12),inset_0_-28px_44px_-24px_rgb(var(--c-shadow)/0.55)]`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_20%,rgb(var(--c-surface)/0.15),rgb(var(--c-surface)/0.75))]" />
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${p.hue} text-sm font-medium text-primary-fg shadow-[inset_0_1px_0_rgb(var(--c-line)/0.25),0_10px_24px_-10px_rgb(var(--c-shadow)/0.6)] ring-1 ring-line/15`}
                >
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
            <span className="ml-auto flex items-end gap-0.5">
              {[0, 1, 2, 3].map((b) => (
                <span
                  key={b}
                  className="w-0.5 animate-breathe rounded-full bg-primary"
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

        {/* supported languages — infinite marquee */}
        <div className="mask-fade-x mt-3 overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[...chips, ...chips].map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="mr-2 whitespace-nowrap rounded-lg border border-line/[0.07] bg-surface2/80 px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
