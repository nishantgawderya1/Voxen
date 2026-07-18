// In-call participants list: names, host badge, mic/cam state, raised hands,
// plus Admit/Deny rows for pending join requests when you are the host.
export default function ParticipantsPanel({
  open,
  onClose,
  selfId,
  meta, // { host, names, media, hands }
  pending, // [{ id, username }] — only populated for the host
  isHost,
  onAdmit,
  onDeny,
}) {
  if (!open) return null;

  const ids = Object.keys(meta.names || {});

  return (
    <div className="chatRoom participantsPanel">
      <div className="chatHeader">
        <span>
          Participants{" "}
          <span className="countPill">{ids.length}</span>
        </span>
        <button onClick={onClose} title="Close participants">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="chattingDisplay">
        {isHost && pending.length > 0 && (
          <div className="pendingBlock">
            <div className="pendingTitle">Waiting to join</div>
            {pending.map((p) => (
              <div className="pendingRow" key={p.id}>
                <span className="pendingName">{p.username}</span>
                <div className="pendingActions">
                  <button className="admitBtn" onClick={() => onAdmit(p.id)}>
                    Admit
                  </button>
                  <button className="denyBtn" onClick={() => onDeny(p.id)}>
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {ids.map((id) => {
          const media = meta.media?.[id] || { audio: true, video: true };
          return (
            <div className="participantRow" key={id}>
              <span className="participantAvatar">
                {(meta.names[id] || "?").slice(0, 1).toUpperCase()}
              </span>
              <div className="participantInfo">
                <span className="participantName">
                  {meta.names[id]}
                  {id === selfId && " (you)"}
                </span>
                {id === meta.host && <span className="hostBadge">Host</span>}
              </div>
              <div className="participantState">
                {meta.hands?.[id] && <span className="handFlag">✋</span>}
                <span
                  className={`material-symbols-outlined stateIcon ${
                    media.audio ? "" : "off"
                  }`}
                >
                  {media.audio ? "mic" : "mic_off"}
                </span>
                <span
                  className={`material-symbols-outlined stateIcon ${
                    media.video ? "" : "off"
                  }`}
                >
                  {media.video ? "videocam" : "videocam_off"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
