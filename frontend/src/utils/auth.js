// Central place for auth-token handling so every screen agrees on the rules.
// The token is a long opaque random string issued by the backend and kept in
// localStorage, so a signed-in user stays signed in across reloads and new
// tabs until they explicitly log out.
const TOKEN_KEY = "token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const t = getToken();
  return typeof t === "string" && t.length > 0;
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};
