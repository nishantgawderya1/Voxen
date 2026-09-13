// In-process room state. The default store: zero config, and correct as long
// as the backend runs as a single instance. `redisStore.js` implements the
// same contract for multi-instance deployments.
//
// Every method is async so the two implementations are interchangeable.

const MAX_ROOM_MESSAGES = 200;

export const createMemoryStore = () => {
  const members = new Map(); // path -> [socketId] (join order; [0] is longest-standing)
  const hosts = new Map(); // path -> socketId
  const names = new Map(); // path -> Map(socketId -> username)
  const media = new Map(); // path -> Map(socketId -> {audio, video})
  const hands = new Map(); // path -> Set(socketId)
  const pending = new Map(); // path -> Map(socketId -> username)
  const messages = new Map(); // path -> [message]
  const socketRoom = new Map(); // socketId -> path

  const list = (map, path, make) => {
    if (!map.has(path)) map.set(path, make());
    return map.get(path);
  };

  return {
    kind: "memory",

    async getMembers(path) {
      return [...(members.get(path) ?? [])];
    },

    async addMember(path, socketId, username) {
      const roster = list(members, path, () => []);
      if (!roster.includes(socketId)) roster.push(socketId);

      list(names, path, () => new Map()).set(socketId, username || "Guest");
      list(media, path, () => new Map()).set(socketId, { audio: true, video: true });
      socketRoom.set(socketId, path);

      // First one in becomes host. Set-if-absent so two simultaneous joins
      // can't both claim it.
      if (!hosts.has(path)) hosts.set(path, socketId);
    },

    async removeMember(path, socketId) {
      const roster = members.get(path);
      if (roster) {
        const i = roster.indexOf(socketId);
        if (i !== -1) roster.splice(i, 1);
      }
      names.get(path)?.delete(socketId);
      media.get(path)?.delete(socketId);
      hands.get(path)?.delete(socketId);
      socketRoom.delete(socketId);
    },

    async getMeta(path) {
      return {
        host: hosts.get(path) ?? null,
        names: Object.fromEntries(names.get(path) ?? []),
        media: Object.fromEntries(media.get(path) ?? []),
        hands: Object.fromEntries([...(hands.get(path) ?? [])].map((id) => [id, true])),
      };
    },

    async getHost(path) {
      return hosts.get(path) ?? null;
    },

    async setHost(path, socketId) {
      if (socketId === null) hosts.delete(path);
      else hosts.set(path, socketId);
    },

    async setMedia(path, socketId, state) {
      const next = { audio: !!state.audio, video: !!state.video };
      list(media, path, () => new Map()).set(socketId, next);
      return next;
    },

    async setHand(path, socketId, raised) {
      const set = list(hands, path, () => new Set());
      if (raised) set.add(socketId);
      else set.delete(socketId);
    },

    async getName(path, socketId) {
      return names.get(path)?.get(socketId) ?? null;
    },

    async addPending(path, socketId, username) {
      list(pending, path, () => new Map()).set(socketId, username || "Guest");
    },

    async removePending(path, socketId) {
      const map = pending.get(path);
      if (!map || !map.has(socketId)) return null;
      const username = map.get(socketId);
      map.delete(socketId);
      return username;
    },

    async getPending(path) {
      return Object.fromEntries(pending.get(path) ?? []);
    },

    async pushMessage(path, message) {
      const log = list(messages, path, () => []);
      log.push(message);
      if (log.length > MAX_ROOM_MESSAGES) {
        log.splice(0, log.length - MAX_ROOM_MESSAGES);
      }
    },

    async getMessages(path) {
      return [...(messages.get(path) ?? [])];
    },

    async roomOf(socketId) {
      return socketRoom.get(socketId) ?? null;
    },

    // Every per-room map has to go together. Leaving messages behind when the
    // room emptied is what leaked one meeting's chat into the next.
    async dispose(path) {
      for (const id of members.get(path) ?? []) socketRoom.delete(id);
      members.delete(path);
      hosts.delete(path);
      names.delete(path);
      media.delete(path);
      hands.delete(path);
      pending.delete(path);
      messages.delete(path);
    },

    async touch() {
      /* no TTLs to refresh in-process */
    },

    async close() {
      /* nothing to disconnect */
    },
  };
};

export { MAX_ROOM_MESSAGES };
export default createMemoryStore;
