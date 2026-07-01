import { Link } from "react-router-dom";
import HeroVisual from "../components/HeroVisual.jsx";
import { ArrowRight, Play } from "../components/Icons.jsx";

const logos = ["Loom", "Linear", "Mercury", "Ramp", "Vercel", "Notion"];
const stats = [
  { value: "50+", label: "Languages supported" },
  { value: "120ms", label: "Median translation lag" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Customer rating" },
];

const LandingPage = () => {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="container-base">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div className="flex flex-col items-start text-left">
            <span className="reveal chip mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
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

        {/* Trusted-by marquee */}
        <div className="reveal mt-24">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Trusted by fast-moving teams worldwide
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-14">
              {[...logos, ...logos].map((l, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap font-display text-2xl font-semibold text-muted/60 transition-colors hover:text-text"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="reveal mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line/10 bg-line/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface/60 p-6 text-center backdrop-blur-sm">
              <div className="font-display text-3xl font-semibold text-text sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
