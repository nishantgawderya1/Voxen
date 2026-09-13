import { useState } from "react";
import UiIcon from "./UiIcon.jsx";

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
            <UiIcon name="close" />
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
            <UiIcon name="link" />
            {copied === "link" ? "Copied!" : "Copy link"}
          </button>
          <button className="inviteBtn" onClick={() => copy(roomCode, "code")}>
            <UiIcon name="pin" />
            {copied === "code" ? "Copied!" : "Copy code"}
          </button>
          {typeof navigator.share === "function" && (
            <button className="inviteBtn" onClick={nativeShare}>
              <UiIcon name="share" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
