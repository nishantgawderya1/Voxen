import { useState } from "react";

// Share a meeting: full link, room code, native share sheet on mobile.
export default function InviteModal({ open, onClose, roomCode, meetingName }) {
  const [copied, setCopied] = useState("");

  if (!open) return null;

  const link = `${window.location.origin}/${roomCode}${
    meetingName ? `?name=${encodeURIComponent(meetingName)}` : ""
  }`;

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: meetingName || "Voxen meeting",
        text: `Join my Voxen meeting${meetingName ? `: ${meetingName}` : ""}`,
        url: link,
      });
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="inviteBackdrop" onClick={onClose}>
      <div className="inviteModal" onClick={(e) => e.stopPropagation()}>
        <div className="inviteHeader">
          <span>Invite people</span>
          <button onClick={onClose} title="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="inviteHint">
          Share this link — anyone who opens it can ask to join.
        </p>

        <div className="inviteLinkBox">
          <span className="inviteLink">{link}</span>
        </div>

        <div className="inviteActions">
          <button className="inviteBtn primary" onClick={() => copy(link, "link")}>
            <span className="material-symbols-outlined">link</span>
            {copied === "link" ? "Copied!" : "Copy link"}
          </button>
          <button className="inviteBtn" onClick={() => copy(roomCode, "code")}>
            <span className="material-symbols-outlined">pin</span>
            {copied === "code" ? "Copied!" : "Copy code"}
          </button>
          {typeof navigator.share === "function" && (
            <button className="inviteBtn" onClick={nativeShare}>
              <span className="material-symbols-outlined">share</span>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
