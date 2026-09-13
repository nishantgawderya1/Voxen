import { createClient } from "redis";
import { MAX_ROOM_MESSAGES } from "./memoryStore.js";

// Redis-backed room state, so more than one backend instance can serve the
// same meeting. Implements the same contract as memoryStore.
//
// Keys are grouped per room and carry a TTL refreshed on activity: if an
// instance dies mid-call its rooms expire instead of leaking forever.
const PREFIX = "vx";
const DEFAULT_TTL_SECONDS = 12 * 60 * 60;

/**
 * Connection options that fail fast instead of retrying forever — for the
 * initial boot check and for tests probing whether a server is there at all.
 */
export const failFastSocket = (connectTimeout = 1500) => ({
  connectTimeout,
  reconnectStrategy: false,
});

const keys = (path) => ({
  members: `${PREFIX}:room:${path}:members`,
  meta: `${PREFIX}:room:${path}:meta`,
  names: `${PREFIX}:room:${path}:names`,
  media: `${PREFIX}:room:${path}:media`,
  hands: `${PREFIX}:room:${path}:hands`,
  pending: `${PREFIX}:room:${path}:pending`,
  messages: `${PREFIX}:room:${path}:msgs`,
});
const socketKey = (socketId) => `${PREFIX}:sock:${socketId}`;

export const createRedisStore = async ({
  url,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  client: injected,
  socket,
} = {}) => {
  const client = injected ?? createClient({ url, socket });
  // Without a listener node-redis throws on connection errors; with one, a
  // transient blip is logged and the client reconnects on its own.
  client.on("error", (e) => console.error("[redis]", e.message));
  if (!client.isOpen) await client.connect();

  const expireAll = async (path) => {
    const k = keys(path);
    await Promise.all(
      Object.values(k).map((key) => client.expire(key, ttlSeconds))
    );
  };

  return {
    kind: "redis",
    client,

    async getMembers(path) {
      return client.lRange(keys(path).members, 0, -1);
    },

    async addMember(path, socketId, username) {
      const k = keys(path);
      const roster = await client.lRange(k.members, 0, -1);
      if (!roster.includes(socketId)) await client.rPush(k.members, socketId);

      await client.hSet(k.names, socketId, username || "Guest");
      await client.hSet(
        k.media,
        socketId,
        JSON.stringify({ audio: true, video: true })
      );
      await client.set(socketKey(socketId), path, { EX: ttlSeconds });

      // First one in becomes host. hSetNX is atomic, so two simultaneous
      // joins can't both claim it.
      await client.hSetNX(k.meta, "host", socketId);
      await expireAll(path);
    },

    async removeMember(path, socketId) {
      const k = keys(path);
      await client.lRem(k.members, 0, socketId);
      await client.hDel(k.names, socketId);
      await client.hDel(k.media, socketId);
      await client.sRem(k.hands, socketId);
      await client.del(socketKey(socketId));
    },

    async getMeta(path) {
      const k = keys(path);
      const [host, names, media, hands] = await Promise.all([
        client.hGet(k.meta, "host"),
        client.hGetAll(k.names),
        client.hGetAll(k.media),
        client.sMembers(k.hands),
      ]);

      const parsedMedia = {};
      for (const [id, raw] of Object.entries(media ?? {})) {
        try {
          parsedMedia[id] = JSON.parse(raw);
        } catch {
          parsedMedia[id] = { audio: true, video: true };
        }
      }

      return {
        host: host ?? null,
        names: names ?? {},
        media: parsedMedia,
        hands: Object.fromEntries((hands ?? []).map((id) => [id, true])),
      };
    },

    async getHost(path) {
      return (await client.hGet(keys(path).meta, "host")) ?? null;
    },

    async setHost(path, socketId) {
      const k = keys(path);
      if (socketId === null) await client.hDel(k.meta, "host");
      else await client.hSet(k.meta, "host", socketId);
    },

    async setMedia(path, socketId, state) {
      const next = { audio: !!state.audio, video: !!state.video };
      await client.hSet(keys(path).media, socketId, JSON.stringify(next));
      return next;
    },

    async setHand(path, socketId, raised) {
      const k = keys(path);
      if (raised) await client.sAdd(k.hands, socketId);
      else await client.sRem(k.hands, socketId);
    },

    async getName(path, socketId) {
      return (await client.hGet(keys(path).names, socketId)) ?? null;
    },

    async addPending(path, socketId, username) {
      await client.hSet(keys(path).pending, socketId, username || "Guest");
      await expireAll(path);
    },

    async removePending(path, socketId) {
      const k = keys(path);
      const username = await client.hGet(k.pending, socketId);
      if (username === null || username === undefined) return null;
      await client.hDel(k.pending, socketId);
      return username;
    },

    async getPending(path) {
      return (await client.hGetAll(keys(path).pending)) ?? {};
    },

    async pushMessage(path, message) {
      const k = keys(path);
      await client.rPush(k.messages, JSON.stringify(message));
      await client.lTrim(k.messages, -MAX_ROOM_MESSAGES, -1);
      await expireAll(path);
    },

    async getMessages(path) {
      const raw = await client.lRange(keys(path).messages, 0, -1);
      return raw
        .map((entry) => {
          try {
            return JSON.parse(entry);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    },

    async roomOf(socketId) {
      return (await client.get(socketKey(socketId))) ?? null;
    },

    // Every per-room key has to go together. Leaving the message list behind
    // when the room emptied is what leaked one meeting's chat into the next.
    async dispose(path) {
      const k = keys(path);
      const roster = await client.lRange(k.members, 0, -1);
      await Promise.all(roster.map((id) => client.del(socketKey(id))));
      await client.del(Object.values(k));
    },

    async touch(path) {
      await expireAll(path);
    },

    async close() {
      if (client.isOpen) await client.quit();
    },
  };
};

export default createRedisStore;
