import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth.jsx";

function HistoryComponent() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="material-symbols-outlined text-on-surface-variant text-5xl">
        history
      </span>
      <h1 className="text-3xl font-semibold">Meeting History</h1>
      <p className="text-on-surface-variant">
        You don't have any past meetings yet.
      </p>
      <button
        onClick={() => router("/home")}
        className="h-11 px-6 rounded-lg bg-primary text-on-primary font-semibold"
      >
        Back to Home
      </button>
    </div>
  );
}

export default withAuth(HistoryComponent);
