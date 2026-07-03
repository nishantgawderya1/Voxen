import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Brand from "./Brand.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { Menu, X } from "./Icons.jsx";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-base">
        <div
          className={`mt-3 flex h-16 items-center justify-between rounded-2xl px-4 transition-all duration-300 ${
            scrolled
              ? "glass"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Brand />

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-line/[0.06] hover:text-text"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/auth"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-text sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex"
            >
              Start free
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line/12 bg-surface/50 text-text md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-line/[0.06] hover:text-text"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-1 flex gap-2 border-t border-line/10 pt-3">
              <Link
                to="/auth"
                className="btn-ghost flex-1 py-2.5 text-sm"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                className="btn-primary flex-1 py-2.5 text-sm"
                onClick={() => setOpen(false)}
              >
                Start free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
