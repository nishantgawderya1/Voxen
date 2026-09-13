import fs from "fs";
import fsp from "fs/promises";
import os from "os";
import path from "path";
import multer from "multer";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";
import config from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

// Uploads land in the OS temp dir rather than a repo-relative `uploads/` folder,
// so a read-only or ephemeral app directory doesn't break transcription.
const UPLOAD_DIR = path.join(os.tmpdir(), "voxen-uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_AUDIO = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp4",
  "video/webm", // MediaRecorder labels audio-only webm this way in some browsers
]);

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: config.maxAudioBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    const type = (file.mimetype || "").split(";")[0].trim();
    cb(null, ALLOWED_AUDIO.has(type));
  },
});

// A client streams a chunk every few seconds, so this caps runaway cost
// without interrupting a normal call.
const transcribeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Transcription rate limit reached." },
});

const transcribeRoute = (app) => {
  const groq = config.groqApiKey ? new Groq({ apiKey: config.groqApiKey }) : null;

  app.post(
    "/api/transcribe",
    transcribeLimiter,
    requireAuth,
    upload.single("audio"),
    async (req, res) => {
      if (!groq) {
        return res
          .status(503)
          .json({ message: "Transcription is not configured on this server" });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No audio file provided (or unsupported format)" });
      }

      // Groq picks the decoder from the file extension, so give it one.
      const webmPath = `${req.file.path}.webm`;
      try {
        await fsp.rename(req.file.path, webmPath);

        const language = String(req.body.language || "en").slice(0, 8);
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(webmPath),
          model: "whisper-large-v3",
          response_format: "json",
          language,
        });

        return res.json({ text: transcription.text || "" });
      } catch (e) {
        // Upstream messages can name the provider and its internals; log them
        // but don't hand them to the browser.
        console.error("[transcribe]", e);
        return res.status(502).json({ message: "Transcription failed" });
      } finally {
        // Runs on every path, so a failure mid-request can't leave temp audio behind.
        await fsp.unlink(webmPath).catch(() => {});
        await fsp.unlink(req.file.path).catch(() => {});
      }
    }
  );
};

export default transcribeRoute;
