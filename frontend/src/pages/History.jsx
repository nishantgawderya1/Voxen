import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import withAuth from "../utils/withAuth.jsx";

function HistoryComponent() {
  const router = useNavigate();
  const { getHistoryOfUser } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-xl font-semibold">Meeting History</span>
          <button
            onClick={() => router("/home")}
            className="flex items-center gap-2 px-4 h-10 rounded-lg border border-outline hover:bg-surface transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Home
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-on-surface-variant">Loading…</p>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">
              history
            </span>
            <p className="text-on-surface-variant">
              You don't have any past meetings yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border-subtle"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    Code: {meeting.meetingCode}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {formatDate(meeting.date)}
                  </div>
                </div>

                <button
                  onClick={() => router(`/${meeting.meetingCode}`)}
                  className="shrink-0 h-10 px-5 rounded-lg bg-primary text-on-primary font-semibold"
                >
                  Join
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
