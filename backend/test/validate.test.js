import test from "node:test";
import assert from "node:assert/strict";
import {
  validateRegistration,
  validateCredentials,
  validateMeeting,
} from "../src/utils/validate.js";

test("registration rejects an empty body instead of reaching bcrypt", () => {
  const { errors } = validateRegistration({});
  assert.ok(errors.length >= 3);
  assert.ok(errors.some((e) => /name/i.test(e)));
  assert.ok(errors.some((e) => /username/i.test(e)));
  assert.ok(errors.some((e) => /password/i.test(e)));
});

test("registration enforces the password floor", () => {
  assert.ok(
    validateRegistration({
      name: "A",
      username: "someone",
      password: "short",
    }).errors.some((e) => /at least 8/.test(e))
  );
});

test("registration refuses a password bcrypt would silently truncate", () => {
  const { errors } = validateRegistration({
    name: "A",
    username: "someone",
    password: "x".repeat(200),
  });
  assert.ok(errors.some((e) => /128 characters or fewer/.test(e)));
});

test("registration constrains the username charset", () => {
  for (const username of ["ab", "has space", "UPPER!", "x".repeat(33)]) {
    const { errors } = validateRegistration({
      name: "A",
      username,
      password: "longenough123",
    });
    assert.ok(errors.length > 0, `expected "${username}" to be rejected`);
  }
});

test("registration normalises username case and trims whitespace", () => {
  const { errors, value } = validateRegistration({
    name: "  Ada  ",
    username: "  AdaL  ",
    password: "longenough123",
  });
  assert.deepEqual(errors, []);
  assert.equal(value.username, "adal");
  assert.equal(value.name, "Ada");
});

test("credentials require both fields", () => {
  assert.equal(validateCredentials({}).errors.length, 2);
  assert.deepEqual(
    validateCredentials({ username: "a", password: "b" }).errors,
    []
  );
});

test("credentials lowercase the username so sign-in is case-insensitive", () => {
  assert.equal(validateCredentials({ username: "AdaL", password: "x" }).value.username, "adal");
});

test("meeting requires a code and truncates an overlong name", () => {
  assert.ok(validateMeeting({}).errors.some((e) => /code is required/i.test(e)));

  const { errors, value } = validateMeeting({
    meeting_code: "abc-123",
    meeting_name: "n".repeat(200),
  });
  assert.deepEqual(errors, []);
  assert.equal(value.meeting_name.length, 80);
});
