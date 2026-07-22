import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import withAuth from "../utils/withAuth.jsx";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import { Video, ArrowRight } from "../components/Icons.jsx";
import { useSpotlight } from "../hooks/useInteractive.js";

function HistoryComponent() {
  const router = useNavigate();
  const { getHistoryOfUser } = useContext(AuthContext);

  useSpotlight();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history.slice().reverse() : history);
      } catch (e) {
        console.log(e);
        // Stale token was cleared by AuthContext — send the user to sign in.
        if (e.response?.status === 401) {
          router("/auth", { replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Aurora />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="container-base">
          <div className="mt-3 flex h-16 items-center justify-between rounded-2xl glass px-4">
            <Brand to="/home" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => router("/home")}
                title="Back to home"
                className="btn-ghost px-3 py-2 text-sm sm:px-4"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto w-full max-w-3xl flex-grow px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-medium tracking-tight text-text">
            Meeting history
          </h1>
          <p className="mt-2 text-muted">Your past rooms, ready to rejoin.</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[74px] rounded-card border border-line/10 bg-gradient-to-r from-surface via-surface2 to-surface bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </div>
        ) : !meetings || meetings.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 py-20 text-center">
            <span className="relative grid h-20 w-20 place-items-center">
              <span
                aria-hidden
                className="ring-conic animate-spinSlower absolute inset-0 rounded-full"
              />
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">history</span>
              </span>
            </span>
            <div>
              <p className="font-medium text-text">No meetings yet</p>
              <p className="mt-1 text-sm text-muted">
                Your calls will show up here once you start one.
              </p>
            </div>
            <button onClick={() => router("/home")} className="btn-primary mt-2">
              <Video size={18} /> Start a meeting
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {meetings.map((meeting, i) => (
              <div
                key={meeting._id}
                className="card card-hover spotlight-card flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="w-6 shrink-0 text-center font-mono text-xs text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20 text-primary">
                    <Video size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-text">
                      {meeting.name || meeting.meetingCode}
                    </div>
                    <div className="truncate text-sm text-muted">
                      {meeting.name ? `${meeting.meetingCode} · ` : ""}
                      {formatDate(meeting.date)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router(`/${meeting.meetingCode}`)}
                  className="btn-ghost group shrink-0 px-5 py-2.5 text-sm"
                >
                  Rejoin
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(HistoryComponent);
