import { useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth.jsx";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import { Video, ArrowRight } from "../components/Icons.jsx";

function HomeComponent() {
  const router = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleJoinVideoCall = () => {
    if (meetingCode.trim() === "") return;
    router(`/${meetingCode.trim()}`);
  };

  const handleCreateMeeting = () => {
    const code = Math.random().toString(36).substring(2, 9);
    router(`/${code}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router("/auth");
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Aurora />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="container-base">
          <div className="mt-3 flex h-16 items-center justify-between rounded-2xl glass px-4 shadow-soft">
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
                className="btn-ghost px-4 py-2 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
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
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
              Ready when you are
            </span>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Start or join a meeting
            </h1>
            <p className="mt-3 text-muted">
              Create a new room instantly, or enter a code to join an existing call.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            {/* Create */}
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
              <div className="h-px flex-grow bg-line/10" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted">
                or join with a code
              </span>
              <div className="h-px flex-grow bg-line/10" />
            </div>

            {/* Join */}
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

          <p className="mt-5 text-center text-xs text-muted">
            Meetings are end-to-end encrypted · Share the link to invite anyone
          </p>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomeComponent);
