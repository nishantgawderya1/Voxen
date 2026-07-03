import { useEffect } from "react";
import server_url from "../environment.js";

export default function useTranscription(stream, socket, roomId, enabled, language = "en") {
  useEffect(() => {
    if (!enabled || !stream || !socket || !roomId) return;
    if (stream.getAudioTracks().length === 0) return;

    const audioStream = new MediaStream(stream.getAudioTracks());
    let recorder;
    try {
      recorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
    } catch {
      return;
    }

    recorder.ondataavailable = async (event) => {
      if (!event.data || event.data.size < 500) return;

      const form = new FormData();
      form.append("audio", event.data, "chunk.webm");
      form.append("language", language);

      try {
        const res = await fetch(`${server_url}/api/transcribe`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) return;
        const { text } = await res.json();
        if (!text || !text.trim()) return;

        socket.emit("transcript-update", {
          roomId,
          text: text.trim(),
          speaker: socket.id,
          timestamp: Date.now(),
        });
      } catch {
        /* network hiccup — drop this chunk */
      }
    };

    recorder.start(3000);

    return () => {
      try {
        if (recorder.state !== "inactive") recorder.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [stream, socket, roomId, enabled, language]);
}
