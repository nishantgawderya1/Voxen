import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { isAuthenticated } from "../utils/auth.js";
import { Snackbar } from "@mui/material";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import { Check } from "../components/Icons.jsx";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const perks = [
  "Real-time translation in 50+ languages",
  "Automatic transcripts & AI summaries",
  "End-to-end encrypted meetings",
];

const Authentication = () => {
  const { handleRegister, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Already signed in? Skip the form entirely.
  useEffect(() => {
    if (isAuthenticated()) navigate("/home", { replace: true });
  }, [navigate]);

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (!isSignup) {
        await handleLogin(username, password);
        setMessage("Logged in successfully");
        setOpen(true);
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result.message);
        setOpen(true);
        setMode("signin");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <Aurora />

      {/* Left — brand panel (desktop) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line/10 bg-surface/40 p-12 backdrop-blur-xl lg:flex">
        <Brand />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text">
            Every conversation,
            <br />
            <span className="text-gradient">without borders.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-muted">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-mint/15 text-mint">
                  <Check size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line/10 bg-surface/60 p-4">
          <div className="flex -space-x-2">
            {["A", "K", "S"].map((c, i) => (
              <span
                key={c}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-gradient-to-br from-primary/70 to-accent/50 text-xs font-semibold text-primary-fg"
                style={{ zIndex: 3 - i }}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted">
            Joined by <span className="font-semibold text-text">12,000+</span>{" "}
            teams worldwide
          </p>
        </div>
      </aside>

      {/* Right — form */}
      <main className="relative flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-muted hover:text-text">
              ← Back home
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-grow items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-7 text-center">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-muted">
                {isSignup
                  ? "Start calling across languages in minutes."
                  : "Sign in to continue to Voxen."}
              </p>
            </div>

            <div className="card p-6 sm:p-7">
              {/* OAuth */}
              <div className="grid gap-2.5">
                <button type="button" className="btn-ghost w-full py-2.5 text-sm">
                  <GoogleIcon /> Continue with Google
                </button>
                <button type="button" className="btn-ghost w-full py-2.5 text-sm">
                  <GitHubIcon /> Continue with GitHub
                </button>
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-grow bg-line/10" />
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  or
                </span>
                <div className="h-px flex-grow bg-line/10" />
              </div>

              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                {isSignup && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-muted">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field h-11"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-muted">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="yourusername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field h-11"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-muted">
                      Password
                    </label>
                    {!isSignup && (
                      <a href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field h-11 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-text"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-1 h-11 w-full disabled:opacity-70">
                  {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="font-semibold text-primary hover:underline"
                onClick={() => setMode(isSignup ? "signin" : "signup")}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Authentication;
