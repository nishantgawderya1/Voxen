// Lightweight inline stroke icons (no runtime icon library dependency).
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const Icon = ({ path, size = 20, ...props }) => (
  <svg {...base} width={size} height={size} {...props}>
    {path}
  </svg>
);

export const Languages = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 5h7M9 3v2c0 4-2 7-5 8" />
        <path d="M5 9c0 3 3 5 6 6" />
        <path d="M13 21l4-9 4 9M14.5 17h5" />
      </>
    }
  />
);
export const FileText = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M9 9h1M9 13h6M9 17h6" />
      </>
    }
  />
);
export const Sparkles = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
        <path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8L16.5 16.5l1.8-.7z" />
      </>
    }
  />
);
export const BarChart = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    }
  />
);
export const Smile = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </>
    }
  />
);
export const Lock = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    }
  />
);
export const Video = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="6" width="12" height="12" rx="2" />
        <path d="M15 10l6-3v10l-6-3" />
      </>
    }
  />
);
export const Globe = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </>
    }
  />
);
export const MessageSquare = (p) => (
  <Icon
    {...p}
    path={<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />}
  />
);
export const Zap = (p) => (
  <Icon {...p} path={<path d="M13 2L4 14h7l-1 8 9-12h-7z" />} />
);
export const Check = (p) => (
  <Icon {...p} path={<path d="M20 6L9 17l-5-5" />} />
);
export const Play = (p) => (
  <Icon {...p} path={<path d="M7 4v16l13-8z" fill="currentColor" stroke="none" />} />
);
export const ArrowRight = (p) => (
  <Icon {...p} path={<path d="M5 12h14M13 6l6 6-6 6" />} />
);
export const Sun = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    }
  />
);
export const Moon = (p) => (
  <Icon {...p} path={<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />} />
);
export const Menu = (p) => (
  <Icon {...p} path={<path d="M4 7h16M4 12h16M4 17h16" />} />
);
export const X = (p) => (
  <Icon {...p} path={<path d="M6 6l12 12M18 6L6 18" />} />
);
