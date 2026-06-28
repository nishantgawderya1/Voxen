const Pricing = () => {
  return (
    <>
      <main id="pricing">
        {/* Pricing Section */}
        <section className="max-w-base mx-auto px-[24px] section-padding text-center">
          <div className="space-y-[16px] mb-[64px]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-primary">
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-on-surface">
              Simple pricing.
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              It's easy to get started. Pick the plan that fits your needs. You can
              switch anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {/* Free */}
            <div className="card p-[32px] rounded-xl flex flex-col text-left">
              <div className="mb-[32px]">
                <h3 className="text-xl font-semibold mb-[8px]">Free</h3>
                <p className="text-on-surface-variant text-sm">
                  For testing the waters.
                </p>
              </div>
              <div className="mb-[32px]">
                <span className="text-4xl font-semibold">$0</span>
                <span className="text-on-surface-variant text-sm">/mo</span>
              </div>
              <ul className="space-y-[16px] mb-[48px] flex-grow text-sm">
                <li className="flex items-center gap-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  40 min limit per call
                </li>
                <li className="flex items-center gap-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Up to 5 participants
                </li>
              </ul>
              <button className="w-full py-[12px] rounded-lg border border-border hover:bg-white/5 transition-colors font-medium">
                Get Started
              </button>
            </div>
            {/* Pro */}
            <div className="card p-[32px] rounded-xl flex flex-col text-left border-primary/30 relative bg-white/[0.02]">
              <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 px-[12px] py-[4px] bg-primary text-background text-[10px] font-semibold rounded uppercase tracking-widest">
                Most Popular
              </div>
              <div className="mb-[32px]">
                <h3 className="text-xl font-semibold mb-[8px] text-primary">Pro</h3>
                <p className="text-on-surface-variant text-sm">
                  For everyday users.
                </p>
              </div>
              <div className="mb-[32px]">
                <span className="text-4xl font-semibold">$12</span>
                <span className="text-on-surface-variant text-sm">/mo</span>
              </div>
              <ul className="space-y-[16px] mb-[48px] flex-grow text-sm">
                <li className="flex items-center gap-[12px] text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    check
                  </span>
                  Unlimited call time
                </li>
                <li className="flex items-center gap-[12px] text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    check
                  </span>
                  Up to 25 participants
                </li>
                <li className="flex items-center gap-[12px] text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    check
                  </span>
                  Advanced Pose Coaching
                </li>
              </ul>
              <button className="w-full py-[12px] rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors font-semibold">
                Start for free
              </button>
            </div>
            {/* Team */}
            <div className="card p-[32px] rounded-xl flex flex-col text-left">
              <div className="mb-[32px]">
                <h3 className="text-xl font-semibold mb-[8px]">Team</h3>
                <p className="text-on-surface-variant text-sm">
                  For growing teams.
                </p>
              </div>
              <div className="mb-[32px]">
                <span className="text-4xl font-semibold">$29</span>
                <span className="text-on-surface-variant text-sm">/mo</span>
              </div>
              <ul className="space-y-[16px] mb-[48px] flex-grow text-sm">
                <li className="flex items-center gap-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Unlimited everything
                </li>
                <li className="flex items-center gap-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Team Analytics
                </li>
                <li className="flex items-center gap-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  SSO Security
                </li>
              </ul>
              <button className="w-full py-[12px] rounded-lg border border-border hover:bg-white/5 transition-colors font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-base mx-auto px-[24px] section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
            <div className="card p-[32px] rounded-xl space-y-[24px]">
              <p className="text-on-surface text-[15px]">
                "The real-time translation feels like magic. I can lead meetings
                with my international teams without losing any of the nuance in the
                conversation."
              </p>
              <div className="flex items-center gap-[12px]">
                <div
                  className="w-10 h-10 rounded-full bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAooAG9URPNxLscFY9qc8F3aNEI2RTx4yIdIrhe2xzMl2nrq30xgp8Un8Koy_q5cweHDXxGDrV_FhL4ssVCIjKvVS-zRJP_Ts2ZmH52n_4qbh_d7tdgDDuZqE0kcXg0EqR55HkGjqjwu2Xh7UmuiLwtNEfFEceWrIgDMLIaZxKS-JzkCJC8qiYDJk56FlXrMNV6aY42p-eVOxSNDeyPAg92Xjn_uV6fki1oTuGnxY-F7dFjv11kgdy1gNjo8VViL74HEH-hrR6MG5g')",
                  }}
                ></div>
                <div>
                  <div className="font-semibold text-sm">Kenji Sato</div>
                  <div className="text-on-surface-variant text-[12px]">
                    CTO, Nexus Dynamics
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-[32px] rounded-xl space-y-[24px]">
              <p className="text-on-surface text-[15px]">
                "The AI summaries save me hours. Instead of re-watching calls, I
                get a perfect list of action items. It's really changed how I
                work."
              </p>
              <div className="flex items-center gap-[12px]">
                <div
                  className="w-10 h-10 rounded-full bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWqdukG_gm0S5kV63nX8w8dKo81wIDr-P9bPZzSivW7svG28jYvWg7E2fvmY04Anpe09LiLWnYxG3mXv8SxtvLD1hQT1RrpUlEmcNQh7Nldy8X9mOCGRwOwYyLlDfLUhhrKe7Wt9iR3lqB4uyQQrQ-UjIVAQQr5oEsv10aYLQfRSbc289B2Ee1qucuKH-KRcrnn-vJGSwB13_akG-Folb2N3MKrG9KNjOQnTx1Hf7FYp7t0oI7uQxNYSDj8lUmnay10CcaP2E3Coc')",
                  }}
                ></div>
                <div>
                  <div className="font-semibold text-sm">Elara Vance</div>
                  <div className="text-on-surface-variant text-[12px]">
                    Product Lead, Atmos AI
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-[32px] rounded-xl space-y-[24px]">
              <p className="text-on-surface text-[15px]">
                "As a remote founder, this gives me the feedback I need to be more
                present. My team says I'm more approachable than I used to be."
              </p>
              <div className="flex items-center gap-[12px]">
                <div
                  className="w-10 h-10 rounded-full bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPvtreUlTHEg4IMpsQowBXKF9JkZyOHJK1q6pLff9Qpp2Of5iY-CvNcvy0XGgF_RcD-CiQAB_dogdtUuH1ClyIH07i9CzaaJ7vWx9oSTmRQlkluZ8FNJg3DfoLxt1aeAua1GZhAiMnvtcfBwtgj8NVdIqxRdrUwJodx1mau-zWt-lTj8qzIIUKVVbpBF6IkIYKAZ_11tdMqryd35ehYpUUGt-1WCeIbcR4FCfgWgZJXIcLEgwe9TqQ1YKNOgbE-f2-QmTXe0pMQDM')",
                  }}
                ></div>
                <div>
                  <div className="font-semibold text-sm">Julian Weber</div>
                  <div className="text-on-surface-variant text-[12px]">
                    Founder, CloudScale
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-base mx-auto px-[24px] section-padding">
          <div className="card rounded-2xl p-[64px] text-center space-y-[32px]">
            <h2 className="text-4xl md:text-5xl font-semibold">Start for free</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">
              Join thousands of professionals communicating better every day. We
              don't ask for a credit card.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-[16px] pt-[16px]">
              <button className="px-[32px] py-[16px] bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Start for free
              </button>
              <button className="px-[32px] py-[16px] border border-border rounded-lg font-medium hover:bg-white/5 transition-colors">
                Book a demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border section-padding bg-surface">
        <div className="max-w-base mx-auto px-[24px] grid grid-cols-2 md:grid-cols-4 gap-[48px]">
          <div className="col-span-2 md:col-span-1 space-y-[16px]">
            <div className="text-lg font-semibold">Voxen</div>
            <p className="text-on-surface-variant text-sm">
              Better video calls through AI posture tracking and neural
              translation.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-on-surface mb-[16px]">
              Product
            </div>
            <ul className="space-y-[8px] text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Biometric AI
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-on-surface mb-[16px]">
              Company
            </div>
            <ul className="space-y-[8px] text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-on-surface mb-[16px]">
              Legal
            </div>
            <ul className="space-y-[8px] text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-base mx-auto px-[24px] pt-[48px] mt-[48px] border-t border-border flex justify-between items-center text-[12px] text-on-surface-variant">
          <p>© 2024 Voxen AI. All rights reserved.</p>
          <div className="flex gap-[24px]">
            <span>Status: Operational</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Pricing;
