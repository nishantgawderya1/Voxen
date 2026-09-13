// The key every participant in a meeting must agree on.
//
// This used to be `window.location.href`. That made the query string part of
// the room's identity, so creating a named meeting (`/abc?name=Standup`) put
// the host in a different room from the bare `/abc` an invitee opens — each
// sat alone as host of their own room and the call silently never connected.
// A trailing slash, or one person on `localhost` and another on `127.0.0.1`,
// split them the same way.
//
// The meeting code alone is the identity. Case is normalised so a code typed
// by hand matches the generated lowercase one.

/**
 * @param {string|undefined} code - the `/:url` route param.
 * @param {string} pathname - fallback for routes with no code (e.g. `/meet`).
 * @returns {string} a stable room key.
 */
export const roomKeyFor = (code, pathname = "/") => {
  const normalised = String(code ?? "").trim().toLowerCase();
  if (normalised) return `room:${normalised}`;

  // No code in the route — fall back to the path, minus any trailing slashes
  // so `/meet` and `/meet/` don't become two rooms.
  return `path:${String(pathname).replace(/\/+$/, "") || "/"}`;
};

export default roomKeyFor;
