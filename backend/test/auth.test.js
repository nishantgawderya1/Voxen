import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import config from "../src/config/env.js";
import { signToken, tokenFrom, requireAuth } from "../src/middleware/auth.js";

const user = { _id: "abc123", username: "ada" };

// Minimal Express res double.
const mockRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (c) => ((res.statusCode = c), res);
  res.json = (b) => ((res.body = b), res);
  return res;
};

const run = (req) => {
  const res = mockRes();
  let nexted = false;
  requireAuth(req, res, () => {
    nexted = true;
  });
  return { res, nexted };
};

test("signed token carries the subject and username", () => {
  const payload = jwt.verify(signToken(user), config.jwtSecret);
  assert.equal(payload.sub, "abc123");
  assert.equal(payload.username, "ada");
  assert.ok(payload.exp > payload.iat, "token must carry an expiry");
});

test("tokenFrom prefers the Authorization header", () => {
  const req = {
    headers: { authorization: "Bearer header-token" },
    body: { token: "body-token" },
    query: { token: "query-token" },
  };
  assert.equal(tokenFrom(req), "header-token");
});

test("tokenFrom falls back to body then query for older clients", () => {
  assert.equal(
    tokenFrom({ headers: {}, body: { token: "body-token" }, query: {} }),
    "body-token"
  );
  assert.equal(
    tokenFrom({ headers: {}, body: {}, query: { token: "query-token" } }),
    "query-token"
  );
  assert.equal(tokenFrom({ headers: {}, body: {}, query: {} }), null);
});

test("requireAuth admits a valid token and attaches the user", () => {
  const req = {
    headers: { authorization: `Bearer ${signToken(user)}` },
    body: {},
    query: {},
  };
  const { nexted } = run(req);
  assert.ok(nexted);
  assert.equal(req.user.username, "ada");
  assert.equal(req.user.id, "abc123");
});

test("requireAuth rejects a missing token", () => {
  const { res, nexted } = run({ headers: {}, body: {}, query: {} });
  assert.equal(nexted, false);
  assert.equal(res.statusCode, 401);
});

test("requireAuth rejects a token signed with a different secret", () => {
  const forged = jwt.sign({ sub: "x", username: "mallory" }, "not-the-secret");
  const { res, nexted } = run({
    headers: { authorization: `Bearer ${forged}` },
    body: {},
    query: {},
  });
  assert.equal(nexted, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, "TOKEN_INVALID");
});

test("requireAuth distinguishes an expired token so the client can re-auth", () => {
  const expired = jwt.sign({ sub: "x", username: "ada" }, config.jwtSecret, {
    expiresIn: -10,
  });
  const { res } = run({
    headers: { authorization: `Bearer ${expired}` },
    body: {},
    query: {},
  });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, "TOKEN_EXPIRED");
});
