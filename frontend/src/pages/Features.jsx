import {
  Languages,
  FileText,
  Sparkles,
  BarChart,
  Smile,
  Lock,
  Video,
  Globe,
  MessageSquare,
  Zap,
  Check,
} from "../components/Icons.jsx";

const features = [
  {
    icon: Languages,
    title: "Real-time translation",
    body: "Speak your language while everyone hears theirs, instantly. Voxen keeps the tone and intent so conversations stay natural.",
    span: "md:col-span-2",
    accent: "primary",
  },
  {
    icon: FileText,
    title: "Searchable transcripts",
    body: "Every word captured, timestamped and searchable after the call.",
    accent: "accent",
  },
  {
    icon: Sparkles,
    title: "Automated summaries",
    body: "Key points and action items delivered the moment you hang up.",
    accent: "mint",
  },
  {
    icon: BarChart,
    title: "Engagement insights",
    body: "See when the room is most focused with live participation signals.",
    accent: "primary",
  },
  {
    icon: Smile,
    title: "Sentiment tracking",
    body: "Read the room's energy through real-time tone analysis.",
    accent: "accent",
  },
  {
    icon: Lock,
    title: "End-to-end security",
    body: "Encrypted from the first word. Privacy is built into the core.",
    span: "md:col-span-2",
    accent: "mint",
  },
];

const accentMap = {
  primary: "text-primary bg-primary/12",
  accent: "text-accent bg-accent/12",
  mint: "text-mint bg-mint/12",
};

const steps = [
  { icon: Video, title: "Create a room", body: "One click starts a meeting. No plugins, no downloads." },
  { icon: Globe, title: "Pick languages", body: "Choose from 50+ dialects. Setup takes a moment." },
  { icon: MessageSquare, title: "Just talk", body: "Translations flow as naturally as a normal call." },
];

const Features = () => {
  return (
    <main id="features" className="relative py-24 sm:py-32">
      <div className="container-base">
        {/* Section head */}
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Platform capabilities</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-[40px]">
            Everything your calls were missing
          </h2>
          <p className="mt-4 text-muted">
            A complete AI layer that sits on top of your meetings — translating,
            transcribing and surfacing insight in real time.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((f, i) => {
            const IconEl = f.icon;
            return (
              <div
                key={f.title}
                className={`reveal card card-hover group flex flex-col gap-4 p-6 ${f.span || ""}`}
                data-reveal-delay={(i % 3) * 70}
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${accentMap[f.accent]}`}>
                  <IconEl size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div id="how" className="mt-28 scroll-mt-28">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-[40px]">
              Up and running in 60 seconds
            </h2>
          </div>
          <div className="relative mt-14 grid gap-4 md:grid-cols-3">
            {/* connecting line */}
            <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-transparent via-line/20 to-transparent md:block" />
            {steps.map((s, i) => {
              const IconEl = s.icon;
              return (
                <div key={s.title} className="reveal relative" data-reveal-delay={i * 100}>
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-line/10 bg-surface text-primary">
                    <IconEl size={26} />
                    <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-medium text-primary-fg">
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-text">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Showcase — live transcript */}
        <div className="mt-28 grid items-center gap-10 lg:grid-cols-2">
          <div className="reveal">
            <span className="eyebrow">Live demo</span>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-text sm:text-[40px]">
              Your words, their language. Instantly.
            </h2>
            <p className="mt-4 text-muted">
              Context matters as much as the words. Voxen understands intent and
              cultural tone to keep communication clear across any border.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="chip">
                <Zap size={14} className="text-primary" /> Low latency
              </span>
              <span className="chip">
                <Check size={14} className="text-mint" /> 98% accuracy
              </span>
            </div>
          </div>

          <div className="reveal card p-5" data-reveal-delay="100">
            <div className="mb-4 flex items-center gap-2 border-b border-line/10 pb-4">
              <span className="h-2 w-2 rounded-full bg-danger" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Live transcript
              </span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">Aman R.</span>
                  <span className="font-mono text-[10px] text-muted">10:42</span>
                </div>
                <p className="text-[15px] text-text">
                  नमस्ते, क्या आप प्रोजेक्ट प्लान देख सकते हैं?
                </p>
                <div className="mt-1.5 flex items-start gap-2">
                  <span className="rounded bg-primary/12 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                    EN
                  </span>
                  <p className="text-[15px] italic text-muted">
                    “Hello, can you see the project plan?”
                  </p>
                </div>
              </div>
              <div className="opacity-70">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-text">Sarah J.</span>
                  <span className="font-mono text-[10px] text-muted">10:42</span>
                </div>
                <p className="text-[15px] text-text">
                  Yes, it looks great. Let's proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Features;
