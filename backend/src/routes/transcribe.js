import fs from "fs";
import path from "path";
import multer from "multer";
import Groq from "groq-sdk";

const upload = multer({ dest: "uploads/" });

const transcribeRoute = (app) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    let webmPath = null;
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      const language = req.body.language || "en";
      webmPath = `${req.file.path}.webm`;
      fs.renameSync(req.file.path, webmPath);

      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(webmPath),
        model: "whisper-large-v3",
        response_format: "json",
        language,
      });

      fs.unlinkSync(webmPath);
      webmPath = null;

      return res.json({ text: transcription.text || "" });
    } catch (e) {
      if (webmPath) {
        try {
          fs.unlinkSync(webmPath);
        } catch {}
      } else if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }
      return res.status(500).json({ message: `Transcription failed: ${e.message}` });
    }
  });
};

export default transcribeRoute;
