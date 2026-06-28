import { useEffect } from "react";

const Features = () => {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <main id="features">
      {/* Features Section */}
      <section className="py-96px px-24px max-container">
        <div className="mb-32px text-center">
          <span className="text-label text-primary uppercase tracking-widest">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-h2 text-on-surface mt-8px">
            Everything your calls were missing
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24px">
          {/* Feature 1 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="languages"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">
                Translation in real-time
              </h3>
              <p className="text-on-surface-variant text-body">
                Talk in your language while others hear theirs instantly. It
                handles the heavy lifting so conversations stay natural.
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="file-text"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">
                Searchable transcripts
              </h3>
              <p className="text-on-surface-variant text-body">
                Every word's captured and ready for searching later. You'll never
                lose track of what was actually said.
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="sparkles"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">
                Automated summaries
              </h3>
              <p className="text-on-surface-variant text-body">
                Get key points and action items delivered right after you hang up.
                Notes happen automatically while you focus on the talk.
              </p>
            </div>
          </div>
          {/* Feature 4 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="bar-chart-3"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">Engagement data</h3>
              <p className="text-on-surface-variant text-body">
                See how participants are interacting with the content. Visual cues
                help highlight when the room's most focused.
              </p>
            </div>
          </div>
          {/* Feature 5 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="smile"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">Mood tracking</h3>
              <p className="text-on-surface-variant text-body">
                Keep a pulse on the room's energy through tone analysis. It
                identifies shifts in sentiment as they happen.
              </p>
            </div>
          </div>
          {/* Feature 6 */}
          <div className="card flex flex-col gap-16px">
            <div className="icon-box">
              <i data-lucide="lock"></i>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface mb-4px">
                End-to-end security
              </h3>
              <p className="text-on-surface-variant text-body">
                Privacy's built into the core of every meeting. Data stays
                encrypted from the moment you start speaking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-96px bg-[#0c0e14]">
        <div className="max-container px-24px">
          <div className="mb-32px text-center">
            <h2 className="text-h2 text-on-surface">
              Up and running in 60 seconds
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-32px">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-16px">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-semibold text-label">
                1
              </div>
              <div className="card w-full">
                <div className="icon-box mb-8px">
                  <i data-lucide="video"></i>
                </div>
                <h4 className="text-h3 text-on-surface mb-4px">Create a room</h4>
                <p className="text-on-surface-variant">
                  One click gets a meeting started. There aren't any plugins or
                  downloads to worry about.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-16px">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-semibold text-label">
                2
              </div>
              <div className="card w-full">
                <div className="icon-box mb-8px">
                  <i data-lucide="globe"></i>
                </div>
                <h4 className="text-h3 text-on-surface mb-4px">
                  Choose your languages
                </h4>
                <p className="text-on-surface-variant">
                  Pick from dozens of supported dialects. Setup takes just a moment
                  before you dive in.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-16px">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-semibold text-label">
                3
              </div>
              <div className="card w-full">
                <div className="icon-box mb-8px">
                  <i data-lucide="message-square"></i>
                </div>
                <h4 className="text-h3 text-on-surface mb-4px">Just talk</h4>
                <p className="text-on-surface-variant">
                  The AI handles the heavy lifting in the background. You'll see
                  translations flow as naturally as a standard call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-96px px-24px max-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32px items-center">
          <div className="flex flex-col gap-16px">
            <h2 className="text-h1 text-on-surface leading-tight">
              Your words, their language. Instantly.
            </h2>
            <p className="text-body text-on-surface-variant">
              Context matters as much as the words themselves. This system
              understands intent and cultural tone to keep communication clear
              across any border.
            </p>
            <div className="flex gap-16px mt-8px">
              <div className="flex items-center gap-8px bg-card-bg px-16px py-8px rounded-card border border-border-subtle">
                <div className="icon-box">
                  <i data-lucide="zap"></i>
                </div>
                <span className="text-label uppercase">Low Latency</span>
              </div>
              <div className="flex items-center gap-8px bg-card-bg px-16px py-8px rounded-card border border-border-subtle">
                <div className="icon-box">
                  <i data-lucide="check-circle"></i>
                </div>
                <span className="text-label uppercase">High Accuracy</span>
              </div>
            </div>
          </div>
          <div className="card border border-primary/20 min-h-[320px] flex flex-col gap-16px">
            <div className="flex items-center justify-between border-b border-border-subtle pb-16px">
              <div className="flex items-center gap-8px">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-mono text-label text-on-surface-variant uppercase tracking-widest">
                  Live Transcript
                </span>
              </div>
            </div>
            <div className="space-y-16px">
              <div className="flex flex-col gap-4px">
                <div className="flex items-center gap-8px">
                  <span className="text-label text-primary">Aman R.</span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    10:42 AM
                  </span>
                </div>
                <p className="text-body">
                  नमस्ते, क्या आप प्रोजेक्ट प्लान देख सकते हैं?
                </p>
                <div className="flex items-start gap-8px">
                  <span className="bg-primary/10 text-primary text-[10px] font-mono px-4px py-1px border border-primary/20 rounded">
                    EN
                  </span>
                  <p className="text-body text-on-surface-variant italic">
                    "Hello, can you see the project plan?"
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4px opacity-60">
                <div className="flex items-center gap-8px">
                  <span className="text-label text-on-surface">Sarah J.</span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    10:42 AM
                  </span>
                </div>
                <p className="text-body">Yes, it looks great. Let's proceed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Features;
