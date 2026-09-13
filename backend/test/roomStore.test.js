import test from "node:test";
import assert from "node:assert/strict";
import { createMemoryStore } from "../src/state/memoryStore.js";
import { createRedisStore, failFastSocket } from "../src/state/redisStore.js";

// The two stores must be interchangeable, so the same contract runs against
// both. Redis is skipped (not failed) when it isn't reachable, so the suite
// still runs on a machine without it.
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisReachable = async () => {
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
};

const room = () => `contract-${Math.random().toString(36).slice(2)}`;

const contract = (name, makeStore) => {
  test(`[${name}] first member becomes host, second does not`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addMember(path, "s1", "Ada");
    await store.addMember(path, "s2", "Grace");

    assert.equal(await store.getHost(path), "s1");
    assert.deepEqual(await store.getMembers(path), ["s1", "s2"]);

    const meta = await store.getMeta(path);
    assert.equal(meta.names.s1, "Ada");
    assert.deepEqual(meta.media.s2, { audio: true, video: true });
  });

  test(`[${name}] member order survives, so host promotion is deterministic`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    for (const id of ["a", "b", "c"]) await store.addMember(path, id, id);
    await store.removeMember(path, "a");

    assert.deepEqual(await store.getMembers(path), ["b", "c"]);
  });

  test(`[${name}] reverse lookup finds a socket's room and clears on removal`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addMember(path, "s1", "Ada");
    assert.equal(await store.roomOf("s1"), path);

    await store.removeMember(path, "s1");
    assert.equal(await store.roomOf("s1"), null);
  });

  test(`[${name}] pending entries are returned once and only once`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addPending(path, "k1", "Grace");
    assert.deepEqual(await store.getPending(path), { k1: "Grace" });

    assert.equal(await store.removePending(path, "k1"), "Grace");
    assert.equal(await store.removePending(path, "k1"), null, "second removal must not succeed");
    assert.deepEqual(await store.getPending(path), {});
  });

  test(`[${name}] media and hand state round-trip`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addMember(path, "s1", "Ada");
    await store.setMedia(path, "s1", { audio: false, video: true });
    await store.setHand(path, "s1", true);

    let meta = await store.getMeta(path);
    assert.deepEqual(meta.media.s1, { audio: false, video: true });
    assert.equal(meta.hands.s1, true);

    await store.setHand(path, "s1", false);
    meta = await store.getMeta(path);
    assert.equal(meta.hands.s1, undefined);
  });

  test(`[${name}] messages replay in order and are capped`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    for (let i = 0; i < 250; i++) {
      await store.pushMessage(path, { sender: "Ada", data: `m${i}`, "socket-id-sender": "s1" });
    }

    const log = await store.getMessages(path);
    assert.equal(log.length, 200, "history must be capped");
    assert.equal(log.at(-1).data, "m249", "newest message kept");
    assert.equal(log[0].data, "m50", "oldest trimmed");
  });

  test(`[${name}] dispose clears messages, not just membership`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addMember(path, "s1", "Ada");
    await store.pushMessage(path, { sender: "Ada", data: "secret", "socket-id-sender": "s1" });
    await store.dispose(path);

    // This is the cross-meeting chat leak, asserted at the storage layer.
    assert.deepEqual(await store.getMessages(path), []);
    assert.deepEqual(await store.getMembers(path), []);
    assert.equal(await store.getHost(path), null);
    assert.equal(await store.roomOf("s1"), null);
  });

  test(`[${name}] host can be cleared and re-elected`, async (t) => {
    const store = await makeStore();
    t.after(() => store.close());
    const path = room();

    await store.addMember(path, "s1", "Ada");
    await store.setHost(path, null);
    assert.equal(await store.getHost(path), null);

    await store.addMember(path, "s2", "Grace");
    assert.equal(await store.getHost(path), "s2", "next joiner takes the empty host slot");
  });
};

contract("memory", async () => createMemoryStore());

if (await redisReachable()) {
  contract("redis", () => createRedisStore({ url: REDIS_URL }));
} else {
  test("[redis] contract skipped — no server reachable", (t) => t.skip());
}
