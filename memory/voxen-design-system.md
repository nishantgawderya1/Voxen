---
name: voxen-design-system
description: Voxen frontend theming/design-token conventions (light+dark mode, animations)
metadata:
  type: project
---

The Voxen frontend (React 19 + Vite + Tailwind v3) uses a redesigned design system with full light/dark theming.

**How it works:**
- Colors are defined as **RGB channel triples** in CSS variables (`--c-bg`, `--c-primary`, `--c-line`, etc.) in `src/index.css` under `:root/.dark` and `.light` selectors, so Tailwind opacity modifiers work: tokens are declared in `tailwind.config.js` as `rgb(var(--c-x) / <alpha-value>)`.
- Semantic Tailwind color names: `bg`, `surface`, `surface2`, `elevated`, `line` (neutral for borders, used with opacity like `border-line/10`), `text`, `muted`, `primary`, `accent`, `mint`, `danger`. Old aliases (`on-surface`, `primary-text`, etc.) still map to these.
- Non-standard opacity steps (`/6 /8 /12 /15 /18`) are registered in `tailwind.config.js` `theme.extend.opacity` — needed because they're used in `@apply` and JSX. Adding a new one there is required before use.
- Theme state: `src/theme/ThemeContext.jsx` (`useTheme()` → `{theme, toggleTheme}`), persisted to `localStorage["voxen-theme"]`, toggles `.dark`/`.light` on `<html>`. A no-flash inline script in `index.html` applies it before paint.
- Reusable classes in `index.css` `@layer components`: `.card`/`.card-hover`, `.btn-primary`, `.btn-ghost`, `.input-field`, `.chip`, `.eyebrow`, `.glass`, `.container-base`. Utilities: `.text-gradient`, `.grid-bg`, `.mask-fade-x/b`, `.reveal` (scroll-in via `src/hooks/useReveal.js` IntersectionObserver adding `.is-visible`; supports `data-reveal-delay` ms).
- Shared components in `src/components/`: `Aurora` (animated bg blobs), `Navbar`, `Footer`, `Brand`, `ThemeToggle`, `Icons.jsx` (inline SVGs — replaced the old lucide CDN dependency), `HeroVisual` (3D-tilt animated call mockup).
- Fonts: Inter (body), Space Grotesk (`font-display` headings), JetBrains Mono.

VideoMeet WebRTC/socket logic in `src/pages/VideoMeet.jsx` was migrated to modern addTrack/ontrack (legacy addStream caused black remote video); lobby + call CSS (`src/styles/videoComponent.css`) use the same tokens.

**Polish-pass conventions (2026-07, user-specified — keep):** headings font-weight 500 with -0.025em tracking; body line-height 1.65; cards 12px radius, border `--c-line`/0.07, hover surface-2 + border 0.12, `transition: all 0.15s ease`; NO gradient text (`.text-gradient` is now solid primary), no glow/colored shadows, no marquee/float/pulse/spin decorative animations (only opacity/translateY reveals, 0.4s); banned marketing words: seamless/powerful/robust/leverage/unlock/transform etc. Live transcription (Groq whisper-large-v3): backend `routes/transcribe.js` + `transcript-update` socket event (server does `socket.join(path)` in join-call); frontend `hooks/useTranscription.js` + `components/TranscriptSidebar.jsx`; needs `GROQ_API_KEY` in backend/.env.
