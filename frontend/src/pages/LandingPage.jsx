import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroVisual from "../components/HeroVisual.jsx";
import { ArrowRight, Play } from "../components/Icons.jsx";

const logos = ["Loom", "Linear", "Mercury", "Ramp", "Vercel", "Notion"];
const stats = [
  { value: 50, decimals: 0, suffix: "+", label: "Languages supported" },
  { value: 120, decimals: 0, suffix: "ms", label: "Median translation lag" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime SLA" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Customer rating" },
];

/* Count-up on scroll: eases 0 → target over ~1s once the cell enters view. */
function useCountUp(target, decimals = 0, duration = 1000) {
  const ref = useRef(null);
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(target.toFixed(decimals));
          return;
        }
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay((target * eased).toFixed(decimals));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, duration]);

  return [ref, display];
}

const StatCell = ({ value, decimals, suffix, label }) => {
  const [ref, display] = useCountUp(value, decimals);
  return (
    <div ref={ref} className="spotlight-card bg-surface p-6 text-center">
      <div className="font-display text-3xl font-semibold sm:text-4xl">
        <span className="text-gradient">
          {display}
          {suffix}
        </span>
      </div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="container-base">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div className="flex flex-col items-start text-left">
            <span className="reveal chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              The AI layer for real-time conversation
            </span>

            <h1 className="reveal font-display text-[42px] font-semibold leading-[1.05] tracking-tight text-text sm:text-[58px]">
              Break every language
              <br />
              barrier{" "}
              <span className="text-gradient">in real time.</span>
            </h1>

            <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-muted" data-reveal-delay="80">
              Voxen translates, transcribes and understands your calls as they
              happen — so your team can just talk, in any language, and be
              understood instantly.
            </p>

            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row" data-reveal-delay="140">
              <Link to="/auth" className="btn-primary group text-base">
                Start for free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how" className="btn-ghost text-base">
                <Play size={16} />
                See it live
              </a>
            </div>

            <p className="reveal mt-5 text-xs text-muted" data-reveal-delay="200">
              No credit card required · Free forever plan · Set up in 60 seconds
            </p>
          </div>

          {/* Visual */}
          <div className="reveal" data-reveal-delay="120">
            <HeroVisual />
          </div>
        </div>

        {/* Trusted-by */}
        <div className="reveal mt-24">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Trusted by fast-moving teams worldwide
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max items-center animate-marqueeSlow">
              {[...logos, ...logos].map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className="mx-7 whitespace-nowrap font-display text-2xl font-medium text-muted/60 transition-colors hover:text-text"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="reveal mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line/[0.07] bg-line/[0.07] md:grid-cols-4">
          {stats.map((s) => (
            <StatCell key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
