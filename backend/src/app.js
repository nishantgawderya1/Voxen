import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import config from "./config/env.js";
import connectToSocket from "./controllers/socketManager.js";
import createRoomState from "./state/index.js";
import userRoutes from "./routes/userRoutes.js";
import transcribeRoute from "./routes/transcribe.js";

const app = express();

// Behind Render/Heroku-style proxies the client IP arrives in X-Forwarded-For;
// without this the rate limiters would bucket every request under the proxy.
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "49kb" }));
app.use(express.urlencoded({ limit: "49kb", extended: true }));

// An explicit allowlist in production. `origin: "*"` let any site on the
// internet call this API with a user's token attached.
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl, health checks, same-origin
      if (!config.isProd && config.corsOrigins.length === 0) return cb(null, true);
      return config.corsOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/v1/users", userRoutes);
transcribeRoute(app);

app.get("/", (req, res) => res.send("Hello Voxen this side ! "));

// Liveness/readiness for the platform's health checks — reports whether the
// process can actually serve requests, not just that it is listening.
app.get("/healthz", (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? "ok" : "degraded",
    db: mongoose.connection.readyState,
    uptime: Math.round(process.uptime()),
  });
});

app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Terminal error handler. Without one, Express's default prints the stack
// trace into the response body.
app.use((err, req, res, _next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Audio chunk too large" });
  }
  if (err?.message === "Origin not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  console.error("[unhandled]", err);
  return res.status(500).json({ message: "Something went wrong" });
});

const server = app.listen(config.port, () =>
  console.log(`Listening on ${config.port}`)
);

const { store, adapter, close: closeRoomState } = await createRoomState();
const io = connectToSocket(server, { store, adapter });

mongoose
  .connect(config.mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Drain in-flight work on deploy instead of cutting calls mid-signal.
let shuttingDown = false;
const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received — shutting down`);

  const done = setTimeout(() => {
    console.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10000);
  done.unref();

  try {
    io.close();
    await new Promise((resolve) => server.close(resolve));
    // Closing sockets fires disconnect handlers, which still read and write
    // room state. Give them a moment to drain before the store goes away.
    await new Promise((resolve) => setTimeout(resolve, 500));
    await closeRoomState();
    await mongoose.connection.close(false);
    console.log("Shutdown complete");
    process.exit(0);
  } catch (e) {
    console.error("Error during shutdown:", e);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
