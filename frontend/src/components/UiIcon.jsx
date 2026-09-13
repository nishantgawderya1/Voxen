// Inline stroke icons for the app chrome, keyed by the Material Symbols names
// the markup already used.
//
// These were `<span class="material-symbols-outlined">call_end</span>`, which
// depends on a Google Fonts stylesheet loading at runtime. When that request
// is blocked — a restrictive network, an offline client, or a region where
// fonts.googleapis.com is unreachable — the ligature never resolves and every
// button renders its raw name as text, collapsing the in-call control bar into
// an overlapping, unclickable pile of words. Losing the "leave call" button
// because a CDN is unreachable is not an acceptable failure mode, so the icons
// ship with the bundle.
//
// Same geometry and stroke weight as Icons.jsx so the two sets read as one.
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const paths = {
  mic: (
    <>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </>
  ),
  mic_off: (
    <>
      <path d="M15 9V5a3 3 0 0 0-5.9-.7M9 9v1a3 3 0 0 0 4.5 2.6" />
      <path d="M5 10a7 7 0 0 0 10.9 5.8M19 10a7 7 0 0 1-.6 2.8M12 17v4M8 21h8" />
      <path d="M3 3l18 18" />
    </>
  ),
  videocam: (
    <>
      <rect x="2" y="6" width="13" height="12" rx="2" />
      <path d="M15 11l7-4v10l-7-4z" />
    </>
  ),
  videocam_off: (
    <>
      <path d="M2 8v8a2 2 0 0 0 2 2h9M15 11l7-4v10l-3-1.7" />
      <path d="M3 3l18 18M6 6H4a2 2 0 0 0-2 2" />
    </>
  ),
  screen_share: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M12 13V8M9.5 10.5L12 8l2.5 2.5" />
    </>
  ),
  call_end: (
    <>
      <path d="M2.5 13.5a13 13 0 0 1 19 0l-.9 2.6a1.6 1.6 0 0 1-1.9 1l-2.7-.7a1.6 1.6 0 0 1-1.2-1.5v-1.4a11 11 0 0 0-6.6 0v1.4a1.6 1.6 0 0 1-1.2 1.5l-2.7.7a1.6 1.6 0 0 1-1.9-1z" />
    </>
  ),
  chat: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
  group: (
    <>
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M22 20v-1.5a4 4 0 0 0-3-3.8M16.5 4a3.2 3.2 0 0 1 0 6.2" />
    </>
  ),
  person_add: (
    <>
      <path d="M15 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
      <circle cx="8.5" cy="7" r="3.2" />
      <path d="M19 8v6M22 11h-6" />
    </>
  ),
  front_hand: (
    <>
      <path d="M7 12V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M10 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M13 11V6a1.5 1.5 0 0 1 3 0v6" />
      <path d="M16 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4.6 14a1.5 1.5 0 0 1 2.5-1.6L8.5 14" />
    </>
  ),
  add_reaction: (
    <>
      <path d="M21 12a9 9 0 1 1-6.2-8.5" />
      <path d="M8.5 14s1.3 1.6 3.5 1.6 3.5-1.6 3.5-1.6" />
      <path d="M9 9.5h.01M15 9.5h.01M19 3v4M21 5h-4" />
    </>
  ),
  closed_caption: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M10 10.2a2.5 2.5 0 1 0 0 3.6M17.5 10.2a2.5 2.5 0 1 0 0 3.6" />
    </>
  ),
  cameraswitch: (
    <>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M9 6l1.5-2h3L15 6" />
      <path d="M9.5 12.5a2.8 2.8 0 0 1 5-1.7M14.5 14.5a2.8 2.8 0 0 1-5 1.7" />
      <path d="M14.8 9.3v1.5h-1.5M9.2 17.7v-1.5h1.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1 0l2.9-2.9a5 5 0 0 0-7.1-7.1L11.5 4.4" />
      <path d="M14 11a5 5 0 0 0-7.1 0L4 13.9a5 5 0 0 0 7.1 7.1l1.4-1.4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  arrow_back: <path d="M19 12H5M11 18l-6-6 6-6" />,
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v4h4" />
      <path d="M12 8v4.5l3 1.8" />
    </>
  ),
  bolt: <path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z" />,
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  login: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5M15 12H3" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  meeting_room: (
    <>
      <path d="M3 21h18M5 21V4a1 1 0 0 1 1.3-1l8 -1.6A1 1 0 0 1 15.5 2.4V21" />
      <path d="M15.5 6H19a1 1 0 0 1 1 1v14" />
      <path d="M12 12v1.5" />
    </>
  ),
};

/**
 * @param {{ name: string, size?: number }} props - `name` is a Material
 * Symbols name; unknown names render nothing rather than leaking the raw text.
 */
const UiIcon = ({ name, size = 20, className = "", ...rest }) => {
  const path = paths[name];
  if (!path) return null;
  return (
    <svg
      {...base}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
};

export default UiIcon;
