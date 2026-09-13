import { createAdapter } from "@socket.io/redis-adapter";
import config from "../config/env.js";
import { createMemoryStore } from "./memoryStore.js";
import { createRedisStore } from "./redisStore.js";

/**
 * Build the room store and, when Redis is configured, the Socket.IO adapter
 * that lets `io.to(room).emit` reach sockets held by other instances.
 *
 * Without REDIS_URL this returns the in-process store: correct for a single
 * instance, and the reason `npm run dev` needs no extra services.
 */
export const createRoomState = async () => {
  if (!config.redisUrl) {
    if (config.isProd) {
      console.warn(
        "REDIS_URL is not set — room state is in-process, so this deployment " +
          "must run exactly one backend instance. Two instances would each see " +
          "half the participants."
      );
    }
    return { store: createMemoryStore(), adapter: null, close: async () => {} };
  }

  // Bounded initial connect: a wrong REDIS_URL should fail the deploy with a
  // clear message, not leave the process retrying invisibly forever.
  let store;
  try {
    store = await createRedisStore({
      url: config.redisUrl,
      socket: { connectTimeout: 5000 },
    });
  } catch (e) {
    console.error(
      `Could not connect to Redis at ${config.redisUrl}: ${e.message}`
    );
    process.exit(1);
  }

  // The adapter needs its own pub/sub pair — a subscribing connection can't
  // also run normal commands.
  const pubClient = store.client.duplicate();
  const subClient = store.client.duplicate();
  pubClient.on("error", (e) => console.error("[redis pub]", e.message));
  subClient.on("error", (e) => console.error("[redis sub]", e.message));
  await Promise.all([pubClient.connect(), subClient.connect()]);

  console.log("Room state: Redis (multi-instance ready)");

  return {
    store,
    adapter: createAdapter(pubClient, subClient),
    close: async () => {
      await Promise.all([
        pubClient.quit().catch(() => {}),
        subClient.quit().catch(() => {}),
      ]);
      await store.close();
    },
  };
};

export default createRoomState;
