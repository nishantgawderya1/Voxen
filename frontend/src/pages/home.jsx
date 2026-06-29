import { useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth.jsx";

function HomeComponent() {
  const router = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleJoinVideoCall = () => {
    if (meetingCode.trim() === "") return;
    router(`/${meetingCode}`);
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
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-xl font-semibold">Voxen</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router("/history")}
              className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined">history</span>
              History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 h-10 rounded-lg border border-outline hover:bg-surface transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="w-full max-w-md flex flex-col gap-8 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Providing Quality Video Calls
            </h1>
            <p className="text-on-surface-variant">
              Create a new meeting or join an existing one with a code.
            </p>
          </div>

          {/* Join an existing meeting */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinVideoCall();
              }}
              className="flex-1 h-12 px-4 rounded-lg bg-surface border border-outline outline-none focus:border-primary"
            />
            <button
              onClick={handleJoinVideoCall}
              className="h-12 px-6 rounded-lg bg-primary text-on-primary font-semibold"
            >
              Join
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="flex-grow border-t border-border-subtle" />
            <span className="text-xs uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-border-subtle" />
          </div>

          {/* Create a new meeting */}
          <button
            onClick={handleCreateMeeting}
            className="h-12 px-6 rounded-lg border border-outline hover:bg-surface transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Create New Meeting
          </button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomeComponent);
