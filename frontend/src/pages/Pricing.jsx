import { Link } from "react-router-dom";
import { Check, ArrowRight } from "../components/Icons.jsx";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    tagline: "For testing the waters.",
    features: ["40 min per call", "Up to 5 participants", "5 languages", "7-day transcript history"],
    cta: "Get started",
    to: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    tagline: "For everyday professionals.",
    features: ["Unlimited call time", "Up to 25 participants", "50+ languages", "AI summaries & insights", "Full transcript search"],
    cta: "Start free trial",
    to: "/auth",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo",
    tagline: "For growing teams.",
    features: ["Everything in Pro", "Unlimited participants", "Team analytics", "SSO & SCIM", "Priority support"],
    cta: "Contact sales",
    to: "/auth",
    highlight: false,
  },
];

const testimonials = [
  {
    quote: "The real-time translation feels like magic. I lead meetings with international teams without losing any nuance.",
    name: "Kenji Sato",
    role: "CTO, Nexus Dynamics",
  },
  {
    quote: "AI summaries save me hours. Instead of re-watching calls, I get a perfect list of action items every time.",
    name: "Elara Vance",
    role: "Product Lead, Atmos AI",
  },
  {
    quote: "As a remote founder, the engagement signals help me be more present. My team says I'm more approachable now.",
    name: "Julian Weber",
    role: "Founder, CloudScale",
  },
];

const Pricing = () => {
  return (
    <main id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-base">
        {/* Pricing head */}
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-[40px]">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-muted">
            Start free, upgrade when you need more. Switch or cancel anytime — no
            credit card to begin.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              data-reveal-delay={i * 90}
              className={`reveal relative flex flex-col rounded-card p-7 ${
                t.highlight
                  ? "gradient-border shadow-soft"
                  : "card card-hover spotlight-card"
              }`}
            >
              {t.highlight && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-card"
                >
                  <div className="absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
                </div>
              )}
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary-fg shadow-[0_8px_20px_-8px_rgb(var(--c-primary)/0.7)]">
                  Most popular
                </span>
              )}
              <div className="relative mb-6">
                <h3 className={`text-lg font-medium ${t.highlight ? "text-primary" : "text-text"}`}>
                  {t.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{t.tagline}</p>
              </div>
              <div className="relative mb-6 flex items-end gap-1">
                <span className="font-display text-5xl font-medium text-text">{t.price}</span>
                <span className="mb-1.5 text-sm text-muted">{t.period}</span>
              </div>
              <ul className="relative mb-8 flex-grow space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted">
                    <span className={`grid h-5 w-5 place-items-center rounded-full ${t.highlight ? "bg-primary/15 text-primary" : "bg-line/8 text-mint"}`}>
                      <Check size={13} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={t.to}
                className={t.highlight ? "btn-primary w-full" : "btn-ghost w-full"}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-28">
          <div className="reveal mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">Loved by teams</span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-[40px]">
              What teams say about Voxen
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                data-reveal-delay={i * 80}
                className="reveal card card-hover spotlight-card flex flex-col gap-6 p-7"
              >
                <blockquote className="text-[15px] leading-relaxed text-text">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="shrink-0 rounded-full bg-gradient-to-br from-primary to-accent p-[1.5px]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-surface2 text-sm font-medium text-text">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-28">
          <div className="glass relative overflow-hidden rounded-[24px] p-10 text-center sm:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="grid-bg mask-fade-b absolute inset-0" />
              <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-[44px]">
                Start talking <span className="text-gradient">without borders</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                Join thousands of professionals communicating better every day. No
                credit card required.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/auth" className="btn-primary group text-base">
                  Start for free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#features" className="btn-ghost text-base">
                  Explore features
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
