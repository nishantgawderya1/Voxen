import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "http";
import { io as ioClient } from "socket.io-client";
import connectToSocket from "../src/controllers/socketManager.js";

// The socket layer needs no database, so it can be exercised end-to-end
// against a real server on an ephemeral port.
let httpServer;
let io;
let url;
const open = [];

test.before(async () => {
  httpServer = createServer();
  io = connectToSocket(httpServer);
  await new Promise((r) => httpServer.listen(0, r));
  url = `http://127.0.0.1:${httpServer.address().port}`;
});

test.after(async () => {
  open.forEach((s) => s.close());
  io.close();
  await new Promise((r) => httpServer.close(r));
});

const connect = () =>
  new Promise((resolve) => {
    const s = ioClient(url, { transports: ["websocket"], forceNew: true });
    open.push(s);
    s.log = [];
    s.onAny((event, ...args) => s.log.push({ event, args }));
    s.on("connect", () => resolve(s));
  });

// Resolve as soon as a matching event lands rather than sleeping a fixed
// interval. `match` narrows to the occurrence of interest — sockets receive
// several `user-joined` events, so "the one with two people in it" needs saying.
const waitFor = (socket, event, match = () => true, timeout = 3000) =>
  new Promise((resolve, reject) => {
    const seen = socket.log.find((e) => e.event === event && match(...e.args));
    if (seen) return resolve(seen.args);

    const timer = setTimeout(
      () => reject(new Error(`timed out waiting for "${event}"`)),
      timeout
    );
    const onEvent = (...args) => {
      if (!match(...args)) return;
      clearTimeout(timer);
      socket.off(event, onEvent);
      resolve(args);
    };
    socket.on(event, onEvent);
  });

const got = (s, event) => s.log.filter((e) => e.event === event);
const room = () => `room-${Math.random().toString(36).slice(2)}`;

test("first participant is admitted immediately and becomes host", async () => {
  const path = room();
  const host = await connect();

  host.emit("join-call", path, "Ada");
  const [meta] = await waitFor(host, "admitted");

  assert.equal(meta.host, host.id);
  assert.equal(meta.names[host.id], "Ada");
});

test("a second participant is held in the waiting room until admitted", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");

  await waitFor(guest, "waiting-room");
  const [knockId, knockName] = await waitFor(host, "join-request");
  assert.equal(knockId, guest.id);
  assert.equal(knockName, "Grace");
  assert.equal(got(guest, "admitted").length, 0, "guest must not be in the call yet");

  host.emit("admit-user", guest.id);
  await waitFor(guest, "admitted");

  const [joinedId, roster] = await waitFor(
    host,
    "user-joined",
    (id) => id === guest.id
  );
  assert.equal(joinedId, guest.id);
  assert.equal(roster.length, 2);
});

test("only the host can admit", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");

  // A third party in an unrelated room tries to let the guest in.
  const outsider = await connect();
  outsider.emit("join-call", room(), "Mallory");
  await waitFor(outsider, "admitted");
  outsider.emit("admit-user", guest.id);

  await new Promise((r) => setTimeout(r, 400));
  assert.equal(got(guest, "admitted").length, 0, "outsider must not be able to admit");
});

test("a denied knocker is told, and is not added to the room", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");

  host.emit("deny-user", guest.id);
  await waitFor(guest, "join-denied");
  assert.equal(got(guest, "admitted").length, 0);
});

test("signals relay to the addressed peer only", async () => {
  const a = await connect();
  const b = await connect();
  a.emit("signal", b.id, JSON.stringify({ sdp: "offer" }));

  const [from, message] = await waitFor(b, "signal");
  assert.equal(from, a.id);
  assert.equal(JSON.parse(message).sdp, "offer");
});

test("host leaving promotes the next participant", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");
  host.emit("admit-user", guest.id);
  await waitFor(guest, "admitted");

  host.disconnect();
  const [newHost] = await waitFor(guest, "host-changed");
  assert.equal(newHost, guest.id);
});

test("chat does not leak into a later meeting reusing the same code", async () => {
  const path = room();

  const first = await connect();
  first.emit("join-call", path, "Ada");
  await waitFor(first, "admitted");
  first.emit("chat-message", "quarterly numbers are in", "Ada");
  await waitFor(first, "chat-message");
  first.disconnect();

  // Room is now empty. Someone else books the same code later.
  await new Promise((r) => setTimeout(r, 300));
  const second = await connect();
  second.emit("join-call", path, "Grace");
  await waitFor(second, "admitted");
  await new Promise((r) => setTimeout(r, 400));

  assert.deepEqual(
    got(second, "chat-message"),
    [],
    "a new occupant must not receive the previous meeting's chat"
  );
});

test("chat is replayed to someone joining the meeting still in progress", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");
  host.emit("chat-message", "starting now", "Ada");
  await waitFor(host, "chat-message");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");
  host.emit("admit-user", guest.id);
  await waitFor(guest, "admitted");

  const [body] = await waitFor(guest, "chat-message");
  assert.equal(body, "starting now");
});

test("an emptied room hands off to someone still knocking", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");

  // The only admitted participant leaves while the guest is still waiting.
  host.disconnect();

  const [meta] = await waitFor(guest, "admitted");
  assert.equal(meta.host, guest.id, "the waiting guest should inherit the room");
});

test("media state, raised hands and reactions reach the room", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  const guest = await connect();
  guest.emit("join-call", path, "Grace");
  await waitFor(guest, "waiting-room");
  host.emit("admit-user", guest.id);
  await waitFor(guest, "admitted");

  guest.emit("media-state", { audio: false, video: true });
  const [who, state] = await waitFor(host, "media-state");
  assert.equal(who, guest.id);
  assert.equal(state.audio, false);

  guest.emit("raise-hand", true);
  const [, raised] = await waitFor(host, "raise-hand");
  assert.equal(raised, true);

  guest.emit("reaction", "🎉");
  const [, emoji, name] = await waitFor(host, "reaction");
  assert.equal(emoji, "🎉");
  assert.equal(name, "Grace");
});

test("reaction payloads are length-capped", async () => {
  const path = room();
  const host = await connect();
  host.emit("join-call", path, "Ada");
  await waitFor(host, "admitted");

  host.emit("reaction", "x".repeat(500));
  const [, emoji] = await waitFor(host, "reaction");
  assert.ok(emoji.length <= 8, `expected a capped payload, got ${emoji.length} chars`);
});
