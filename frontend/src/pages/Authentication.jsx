import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/v1/users";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const Authentication = () => {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, {
        username: email,
        password,
      });
      console.log("login:", res.data);
    } catch (err) {
      console.log("login error:", err.response?.data || err.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/register`, {
        name,
        username: email,
        password,
      });
      console.log("register:", res.data);
    } catch (err) {
      console.log("register error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 h-20 flex justify-center items-center">
        <div className="w-full max-w-7xl px-margin-desktop flex justify-center">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            Voxen
          </span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile pt-28 pb-16">
        {mode === "signin" ? (
          /* ===== Sign In ===== */
          <div className="w-full max-w-[400px] flex flex-col gap-lg">
            <div className="text-center space-y-sm mb-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface">
                Welcome back.
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Sign in to your Voxen account to start calling.
              </p>
            </div>
            <div className="auth-card p-xl flex flex-col gap-lg">
              <form className="flex flex-col gap-md" onSubmit={handleSignIn}>
                <div className="flex flex-col gap-xs">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant ml-unit"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="input-field rounded-[8px] h-11 px-md font-body-md text-body-md transition-all duration-200"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <div className="flex justify-between items-center">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant ml-unit"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      className="font-label-sm text-label-sm text-[#7c5cff] hover:underline"
                      href="#"
                    >
                      Forgot?
                    </a>
                  </div>
                  <input
                    className="input-field rounded-[8px] h-11 px-md font-body-md text-body-md transition-all duration-200"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className="bg-[#7c5cff] text-white h-11 rounded-[8px] font-body-md font-semibold mt-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
              <div className="relative flex items-center py-sm">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-md font-label-sm text-label-sm text-[#938ea1]">
                  OR
                </span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>
              <div className="flex flex-col gap-sm">
                <button className="auth-card flex items-center justify-center gap-sm h-11 hover:bg-white/5 transition-colors">
                  <GoogleIcon />
                  <span className="font-body-md text-on-surface">
                    Continue with Google
                  </span>
                </button>
                <button className="auth-card flex items-center justify-center gap-sm h-11 hover:bg-white/5 transition-colors">
                  <GitHubIcon />
                  <span className="font-body-md text-on-surface">
                    Continue with GitHub
                  </span>
                </button>
              </div>
            </div>
            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{" "}
              <button
                className="text-[#7c5cff] font-medium hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          /* ===== Sign Up ===== */
          <div className="w-full max-w-[440px] flex flex-col gap-lg">
            <div className="text-center space-y-md">
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">
                Get started with Voxen.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[360px] mx-auto">
                Create your account and start calling in minutes.
              </p>
            </div>
            <div className="bg-voxen-surface border border-border-subtle rounded-[12px] p-lg space-y-lg">
              <div className="grid grid-cols-1 gap-md">
                <button className="w-full h-11 flex items-center justify-center gap-md border border-border-subtle rounded-[12px] font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors duration-200">
                  <GoogleIcon />
                  Continue with Google
                </button>
                <button className="w-full h-11 flex items-center justify-center gap-md border border-border-subtle rounded-[12px] font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors duration-200">
                  <GitHubIcon />
                  Continue with GitHub
                </button>
              </div>
              <div className="relative flex items-center py-md">
                <div className="flex-grow border-t border-border-subtle"></div>
                <span className="flex-shrink mx-md font-label-sm text-label-sm text-[#938ea1] uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-border-subtle"></div>
              </div>
              <form className="space-y-lg" onSubmit={handleSignUp}>
                <div className="space-y-md">
                  <div className="space-y-sm">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant"
                      htmlFor="name"
                    >
                      Full name
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-border-subtle rounded-[12px] px-md h-11 text-body-md text-on-surface focus:ring-1 focus:ring-[#7c5cff] focus:border-[#7c5cff] transition-all outline-none"
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-sm">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant"
                      htmlFor="signup-email"
                    >
                      Work email
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border border-border-subtle rounded-[12px] px-md h-11 text-body-md text-on-surface focus:ring-1 focus:ring-[#7c5cff] focus:border-[#7c5cff] transition-all outline-none"
                      id="signup-email"
                      placeholder="john@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-sm">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-lowest border border-border-subtle rounded-[12px] px-md h-11 text-body-md text-on-surface focus:ring-1 focus:ring-[#7c5cff] focus:border-[#7c5cff] transition-all outline-none"
                        id="signup-password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-md top-1/2 -translate-y-1/2 text-[#938ea1] hover:text-on-surface"
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full h-12 bg-[#7c5cff] text-white font-label-sm text-label-sm rounded-[12px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center"
                  type="submit"
                >
                  Start for free
                </button>
              </form>
            </div>
            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <button
                className="text-[#7c5cff] font-semibold hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </p>
            <div className="flex justify-center gap-lg font-label-sm text-label-sm text-[#938ea1]">
              <a className="hover:text-on-surface transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-on-surface transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-xl border-t border-white/5 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-7xl mx-auto gap-lg">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 Voxen. All rights reserved.
          </span>
          <nav className="flex gap-lg">
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Security
            </a>
            <a
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Status
            </a>
          </nav>
        </div>
      </footer>

      {/* Background orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#7c5cff]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-tertiary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};

export default Authentication;
