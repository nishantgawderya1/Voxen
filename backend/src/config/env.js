import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

// Fail fast on a misconfigured deploy rather than 500-ing on the first request
// that happens to touch the missing piece.
const required = ["MONGO_URI"];
if (isProd) required.push("JWT_SECRET", "CORS_ORIGINS");

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}.\n` +
      "See .env.example for the full list."
  );
  process.exit(1);
}

// Outside production a throwaway secret keeps `npm run dev` zero-config; it
// rotates on restart, so sessions don't survive a reload. Production requires
// a real one (checked above) so tokens stay valid across deploys and replicas.
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(32).toString("hex");
  console.warn(
    "JWT_SECRET is not set — using a random development secret. " +
      "Every restart invalidates existing sessions."
  );
}

const list = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const config = {
  isProd,
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Empty in development means "reflect any origin"; production must be explicit.
  corsOrigins: list(process.env.CORS_ORIGINS),
  groqApiKey: process.env.GROQ_API_KEY || "",
  // Max audio bytes accepted per transcription chunk (default 8 MB).
  maxAudioBytes: Number(process.env.MAX_AUDIO_BYTES) || 8 * 1024 * 1024,
};

export default config;
