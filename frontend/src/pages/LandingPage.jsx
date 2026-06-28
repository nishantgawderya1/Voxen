const LandingPage = () => {
  return (
    <>
      {/* Navigation */}
      <nav
        id="top"
        className="w-full border-b border-outline bg-background sticky top-0 z-50"
      >
        <div className="max-w-[1120px] mx-auto px-6 flex justify-between items-center h-20">
          <a href="#top" className="text-xl font-semibold text-primary-text">
            Voxen
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-secondary-text hover:text-primary-text transition-colors text-sm font-medium"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-secondary-text hover:text-primary-text transition-colors text-sm font-medium"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="text-secondary-text hover:text-primary-text transition-colors text-sm font-medium"
              href="#"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-secondary-text hover:text-primary-text transition-colors text-sm font-medium">
              Sign in
            </button>
            <button className="bg-primary text-on-primary font-semibold px-5 py-2 rounded-lg text-sm transition-transform active:scale-95">
              Start for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="py-section">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <span className="fade-in-up text-[12px] font-semibold tracking-widest text-secondary-text uppercase">
              THE AI LAYER
            </span>
            <h1 className="fade-in-up delay-1 text-[40px] md:text-[56px] leading-[1.1] font-semibold text-primary-text max-w-2xl">
              Break every Language barrier in Real-time
            </h1>
            <p className="fade-in-up delay-1 text-lg text-secondary-text max-w-xl">
              Voxen translates, transcribes, and understands your calls. It's so
              your team can focus on talking.
            </p>
            <div className="fade-in-up delay-2 flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button className="w-full sm:w-auto bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-lg transition-colors hover:bg-[#b8abff]">
                Start for free
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-primary-text border border-outline px-8 py-3.5 rounded-lg hover:bg-surface transition-colors">
                <svg
                  fill="none"
                  height="20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                See it live
              </button>
            </div>
            <div className="fade-in-up delay-2 mt-20 w-full flex flex-col items-center">
              {/* Caption */}
              <p className="text-[12px] font-normal text-secondary-text uppercase tracking-widest">
                Real-time translation and engagement tracking in every room.
              </p>
            </div>
          </div>

          {/* Contextual proof area */}
          <div className="fade-in-up delay-2 pt-section border-t border-outline mt-32">
            <div className="flex flex-col items-center gap-8">
              <span className="text-[12px] font-semibold tracking-widest text-secondary-text uppercase">
                REAL RESULTS
              </span>
              <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale contrast-125">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Loom</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Linear</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Mercury</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl">Ramp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
