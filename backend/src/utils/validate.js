// Small hand-rolled validators. Deliberately not a schema library: there are
// four endpoints, and the rules below are the ones the data model enforces.

export const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
export const MIN_PASSWORD = 8;
export const MAX_PASSWORD = 128;

const str = (v) => (typeof v === "string" ? v.trim() : "");

/** Returns an array of human-readable problems; empty means valid. */
export const validateRegistration = ({ name, username, password }) => {
  const errors = [];

  const n = str(name);
  if (!n) errors.push("Name is required");
  else if (n.length > 80) errors.push("Name must be 80 characters or fewer");

  const u = str(username).toLowerCase();
  if (!u) errors.push("Username is required");
  else if (!USERNAME_RE.test(u)) {
    errors.push(
      "Username must be 3-32 characters, using letters, numbers, dot, underscore or hyphen"
    );
  }

  const p = typeof password === "string" ? password : "";
  if (!p) errors.push("Password is required");
  else if (p.length < MIN_PASSWORD) {
    errors.push(`Password must be at least ${MIN_PASSWORD} characters`);
  } else if (p.length > MAX_PASSWORD) {
    // bcrypt only reads the first 72 bytes; refuse rather than silently truncate.
    errors.push(`Password must be ${MAX_PASSWORD} characters or fewer`);
  }

  return { errors, value: { name: n, username: u, password: p } };
};

export const validateCredentials = ({ username, password }) => {
  const errors = [];
  const u = str(username).toLowerCase();
  const p = typeof password === "string" ? password : "";
  if (!u) errors.push("Username is required");
  if (!p) errors.push("Password is required");
  return { errors, value: { username: u, password: p } };
};

export const validateMeeting = ({ meeting_code, meeting_name }) => {
  const errors = [];
  const code = str(meeting_code);
  if (!code) errors.push("Meeting code is required");
  else if (code.length > 64) {
    errors.push("Meeting code must be 64 characters or fewer");
  }

  const name = str(meeting_name).slice(0, 80);
  return { errors, value: { meeting_code: code, meeting_name: name } };
};
