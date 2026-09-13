import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { io as ioClient } from "socket.io-client";
import connectToSocket from "../src/controllers/socketManager.js";
import { createRedisStore, failFastSocket } from "../src/state/redisStore.js";

// Two backend instances sharing one Redis, with each client connected to a
// different one. This is the scenario in-process state could never serve:
// without the shared store and the Socket.IO adapter, each instance sees only
// half the participants and the two clients never learn the other exists.
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const reachable = await (async () => {
  try {
    const probe = await createRedisStore({
      url: REDIS_URL,
      socket: failFastSocket(),
    });
    await probe.close();
    return true;
  } catch {
    return false;
  }
})();

if (!reachable) {
  test("multi-instance suite skipped — no Redis reachable", (t) => t.skip());
} else {
  const instances = [];
  const clients = [];
  let store;

  const startInstance = async () => {
    const httpServer = createServer();
    const pub = store.client.duplicate();
    const sub = store.client.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);

    const io = connectToSocket(httpServer, {
      store,
      adapter: createAdapter(pub, sub),
    });
    await new Promise((r) => httpServer.listen(0, r));

    const instance = {
      url: `http://127.0.0.1:${httpServer.address().port}`,
      async close() {
        io.close();
        await new Promise((r) => httpServer.close(r));
        await pub.quit().catch(() => {});
        await sub.quit().catch(() => {});
      },
    };
    instances.push(instance);
    return instance;
  };

  const connect = (instance) =>
    new Promise((resolve) => {
      const s = ioClient(instance.url, {
        transports: ["websocket"],
        forceNew: true,
      });
      clients.push(s);
      s.log = [];
      s.onAny((event, ...args) => s.log.push({ event, args }));
      s.on("connect", () => resolve(s));
    });

  const waitFor = (socket, event, match = () => true, timeout = 5000) =>
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
  const room = () => `mi-${Math.random().toString(36).slice(2)}`;

  test.before(async () => {
    store = await createRedisStore({ url: REDIS_URL });
  });

  test.after(async () => {
    clients.forEach((c) => c.close());
    // Disconnect handlers still want the store; closing it under them throws.
    await new Promise((r) => setTimeout(r, 300));
    await Promise.all(instances.map((i) => i.close()));
    await store.close();
  });

  test("a knock on instance B reaches the host on instance A", async () => {
    const a = await startInstance();
    const b = await startInstance();
    const path = room();

    const host = await connect(a);
    host.emit("join-call", path, "Ada");
    await waitFor(host, "admitted");

    const guest = await connect(b);
    guest.emit("join-call", path, "Grace");
    await waitFor(guest, "waiting-room");

    // The host's socket lives on a different process than the knocker's.
    const [knockId, knockName] = await waitFor(host, "join-request");
    assert.equal(knockId, guest.id);
    assert.equal(knockName, "Grace");
  });

  test("admitting across instances joins both to the same room", async () => {
    const a = await startInstance();
    const b = await startInstance();
    const path = room();

    const host = await connect(a);
    host.emit("join-call", path, "Ada");
    await waitFor(host, "admitted");

    const guest = await connect(b);
    guest.emit("join-call", path, "Grace");
    await waitFor(guest, "waiting-room");

    host.emit("admit-user", guest.id);
    const [meta] = await waitFor(guest, "admitted");

    assert.equal(meta.host, host.id, "guest sees the host from the other instance");

    const [, roster] = await waitFor(
      host,
      "user-joined",
      (id) => id === guest.id
    );
    assert.equal(roster.length, 2, "roster spans both instances");
  });

  test("chat and signalling cross the instance boundary", async () => {
    const a = await startInstance();
    const b = await startInstance();
    const path = room();

    const host = await connect(a);
    host.emit("join-call", path, "Ada");
    await waitFor(host, "admitted");

    const guest = await connect(b);
    guest.emit("join-call", path, "Grace");
    await waitFor(guest, "waiting-room");
    host.emit("admit-user", guest.id);
    await waitFor(guest, "admitted");

    host.emit("chat-message", "can you hear me?", "Ada");
    const [body, sender] = await waitFor(guest, "chat-message");
    assert.equal(body, "can you hear me?");
    assert.equal(sender, "Ada");

    // Signalling is addressed to one socket id, which the adapter has to route
    // to whichever instance holds it — this is what carries the SDP offer.
    host.emit("signal", guest.id, JSON.stringify({ sdp: "offer" }));
    const [from, message] = await waitFor(guest, "signal");
    assert.equal(from, host.id);
    assert.equal(JSON.parse(message).sdp, "offer");
  });

  test("host leaving one instance promotes a participant on another", async () => {
    const a = await startInstance();
    const b = await startInstance();
    const path = room();

    const host = await connect(a);
    host.emit("join-call", path, "Ada");
    await waitFor(host, "admitted");

    const guest = await connect(b);
    guest.emit("join-call", path, "Grace");
    await waitFor(guest, "waiting-room");
    host.emit("admit-user", guest.id);
    await waitFor(guest, "admitted");

    host.disconnect();
    const [newHost] = await waitFor(guest, "host-changed");
    assert.equal(newHost, guest.id);
    assert.equal(await store.getHost(path), guest.id, "Redis reflects the new host");
  });

  test("chat does not leak between meetings reusing a code across instances", async () => {
    const a = await startInstance();
    const b = await startInstance();
    const path = room();

    const first = await connect(a);
    first.emit("join-call", path, "Ada");
    await waitFor(first, "admitted");
    first.emit("chat-message", "internal numbers", "Ada");
    await waitFor(first, "chat-message");
    first.disconnect();

    await new Promise((r) => setTimeout(r, 400));

    // Different instance, same code, later meeting.
    const second = await connect(b);
    second.emit("join-call", path, "Grace");
    await waitFor(second, "admitted");
    await new Promise((r) => setTimeout(r, 400));

    assert.deepEqual(
      got(second, "chat-message"),
      [],
      "a new occupant must not receive the previous meeting's chat"
    );
  });
}
