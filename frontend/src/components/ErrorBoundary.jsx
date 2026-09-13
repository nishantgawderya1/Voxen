import { Component } from "react";

// A render error anywhere below this unmounts the whole tree and leaves a
// blank white page — no message, no way back, and mid-call it looks like the
// app simply vanished. Catch it and offer a route out.
//
// Still a class component: React has no hook equivalent of
// componentDidCatch/getDerivedStateFromError.
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ui]", error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    // A full navigation, not a router push — the router itself may be the
    // thing that threw.
    window.location.assign("/");
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 text-text">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-2xl font-medium tracking-tight">
            Something broke on this screen
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The page stopped responding. Reloading usually fixes it — if you
            were in a call, rejoin with the same meeting code.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button onClick={this.handleReload} className="btn-primary px-5 py-2.5 text-sm">
              Reload the page
            </button>
            <button onClick={this.handleHome} className="btn-ghost px-5 py-2.5 text-sm">
              Back to home
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-6 max-h-48 overflow-auto rounded-xl bg-surface p-3 text-left text-xs text-muted">
              {String(error?.stack || error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
