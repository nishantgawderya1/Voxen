import { useEffect, useState } from "react";

export default function TranscriptSidebar({ socket, open, onClose }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const onTranscript = ({ text, speaker, timestamp }) => {
      setLines((prev) => [
        ...prev,
        {
          text,
          speaker,
          time: new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    };

    socket.on("transcript-update", onTranscript);
    return () => {
      socket.off("transcript-update", onTranscript);
    };
  }, [socket]);

  if (!open) return null;

  return (
    <div className="chatRoom transcriptPanel">
      <div className="chatHeader">
        <span>Transcript</span>
        <button onClick={onClose} title="Close transcript">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="chattingDisplay">
        {lines.length === 0 ? (
          <div className="chatEmpty" style={{ color: "#545868" }}>
            Transcript will appear here
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ color: "#7c5cff", fontSize: 12, fontWeight: 500 }}>
                  {(line.speaker || "").slice(0, 6)}
                </span>
                <span style={{ color: "#545868", fontSize: 11 }}>{line.time}</span>
              </div>
              <p
                style={{ color: "#8b8fa8", fontSize: 13, margin: 0 }}
                className="leading-relaxed"
              >
                {line.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
