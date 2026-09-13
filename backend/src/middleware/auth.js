import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Pull the bearer token out of a request.
 *
 * `Authorization: Bearer <token>` is the real transport. The body/query
 * fallbacks exist because the current clients send the token that way; they
 * are accepted so existing sessions keep working, but tokens in query strings
 * end up in access logs and Referer headers, so prefer the header.
 */
export const tokenFrom = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return req.body?.token || req.query?.token || null;
};

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id), username: user.username }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

/** Rejects the request unless it carries a valid, unexpired token. */
export const requireAuth = (req, res, next) => {
  const token = tokenFrom(req);
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.sub, username: payload.username };
    return next();
  } catch (e) {
    // Let the client tell "log in again" apart from "something broke".
    const expired = e.name === "TokenExpiredError";
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: expired ? "Session expired" : "Invalid token",
      code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
    });
  }
};

export default requireAuth;
