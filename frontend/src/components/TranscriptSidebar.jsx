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
          <div className="chatEmpty">Transcript will appear here</div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-primary">
                  {(line.speaker || "").slice(0, 6)}
                </span>
                <span className="text-[11px] text-muted/70">{line.time}</span>
              </div>
              <p className="m-0 text-[13px] leading-relaxed text-muted">
                {line.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
