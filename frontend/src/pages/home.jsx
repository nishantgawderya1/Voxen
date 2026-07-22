import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth.jsx";
import { clearToken } from "../utils/auth.js";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import { Video, ArrowRight } from "../components/Icons.jsx";
import { useSpotlight } from "../hooks/useInteractive.js";

function HomeComponent() {
  const router = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef();

  useSpotlight();

  const handleJoinVideoCall = () => {
    if (meetingCode.trim() === "") return;
    router(`/${meetingCode.trim()}`);
  };

  const handleCreateMeeting = () => {
    const code = Math.random().toString(36).substring(2, 9);
    const name = meetingName.trim();
    router(name ? `/${code}?name=${encodeURIComponent(name)}` : `/${code}`);
  };

  const handleLogout = () => {
    clearToken();
    router("/auth", { replace: true });
  };

  // Presentation-level: copy the app origin so it can be shared as an invite.
  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (e.g. non-secure context) — no false success */
    }
  };

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Aurora />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="container-base">
          <div className="mt-3 flex h-16 items-center justify-between rounded-2xl glass px-4">
            <Brand to="/home" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => router("/history")}
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-line/[0.06] hover:text-text sm:flex"
              >
                <span className="material-symbols-outlined text-[20px]">history</span>
                History
              </button>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                title="Logout"
                className="btn-ghost px-3 py-2 text-sm sm:px-4"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-grow items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <span className="chip mx-auto mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              Ready when you are
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight text-text sm:text-4xl">
              Start or join a meeting
            </h1>
            <p className="mt-3 text-muted">
              Create a new room instantly, or enter a code to join an existing call.
            </p>
          </div>

          <div className="glass spotlight-card relative overflow-hidden rounded-[24px] p-6 sm:p-8">
            {/* Decorative layers — clipped by the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]"
            >
              <div className="grid-bg mask-fade-b absolute inset-0 opacity-[0.05]" />
              <div className="ring-conic animate-spinSlower absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-80" />
            </div>

            <div className="relative">
              {/* Create */}
              <span className="chip mb-3">
                <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                New room
              </span>
              <input
                type="text"
                placeholder="Meeting name — what's it about? (optional)"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateMeeting()}
                maxLength={80}
                className="input-field mb-3 h-12"
              />
              <button
                onClick={handleCreateMeeting}
                className="btn-primary group w-full py-4 text-base"
              >
                <Video size={20} />
                Create new meeting
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-line/20 to-line/30" />
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  or join with a code
                </span>
                <div className="h-px flex-grow bg-gradient-to-l from-transparent via-line/20 to-line/30" />
              </div>

              {/* Join */}
              <span className="chip mb-3">
                <span className="material-symbols-outlined text-[14px] text-accent">login</span>
                Have a code?
              </span>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinVideoCall()}
                  className="input-field h-12 flex-1"
                />
                <button
                  onClick={handleJoinVideoCall}
                  className="btn-ghost h-12 px-8"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Shortcuts */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => router("/history")}
              className="card card-hover group flex items-center gap-3 p-4 text-left"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20 text-primary">
                <span className="material-symbols-outlined text-[20px]">history</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text">View history</span>
                <span className="block truncate text-xs text-muted">Rejoin your past rooms</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <button
              onClick={handleCopyInvite}
              className="card card-hover group flex items-center gap-3 p-4 text-left"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br transition-colors ${
                  copied
                    ? "from-mint/25 via-mint/10 to-primary/20 text-mint"
                    : "from-accent/25 via-accent/10 to-mint/20 text-accent"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? "check" : "link"}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text">
                  {copied ? "Link copied" : "Invite by link"}
                </span>
                <span className="block truncate text-xs text-muted">
                  {copied ? "Share it with anyone" : "Copy the app link"}
                </span>
              </span>
              <span className="material-symbols-outlined shrink-0 text-[18px] text-muted">
                content_copy
              </span>
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-muted">
            Meetings are end-to-end encrypted · Share the link to invite anyone
          </p>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomeComponent);
