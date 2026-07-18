import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext.jsx";
import server_url from "../environment.js";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import { isAuthenticated } from "../utils/auth.js";
import useTranscription from "../hooks/useTranscription.js";
import TranscriptSidebar from "../components/TranscriptSidebar.jsx";
import ParticipantsPanel from "../components/ParticipantsPanel.jsx";
import InviteModal from "../components/InviteModal.jsx";
import "../styles/videoComponent.css";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "👏"];

var connections = {};

const peerConfigConnections = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// Audio capture constraints — echo cancellation + noise suppression kill the
// feedback squeal and background hiss that raw `audio: true` lets through.
const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

// Attach a stream to a peer connection using the modern addTrack/replaceTrack
// API. The legacy addStream()/onaddstream events are unreliable in current
// browsers (they no longer fire), which leaves remote tiles black.
function attachStream(pc, stream) {
  if (!pc || !stream) return;
  const senders = pc.getSenders();
  stream.getTracks().forEach((track) => {
    const sender = senders.find((s) => s.track && s.track.kind === track.kind);
    if (sender) {
      try {
        sender.replaceTrack(track);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        pc.addTrack(track, stream);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

export default function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();
  let videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [screenAvailable, setScreenAvailable] = useState();
  let [showModal, setModal] = useState();

  // Join lifecycle: lobby → (waiting | call), waiting → (call | denied)
  let [phase, setPhase] = useState("lobby");
  let [username, setUsername] = useState("");
  let [showTranscript, setShowTranscript] = useState(false);
  let [callStream, setCallStream] = useState(null);
  let [facingMode, setFacingMode] = useState("user");
  let [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  let facingModeRef = useRef("user");

  // Pre-join device choices (Meet-style lobby toggles)
  let [preJoinAudio, setPreJoinAudio] = useState(true);
  let [preJoinVideo, setPreJoinVideo] = useState(true);

  // Meeting metadata mirrored from the server
  let [roomMeta, setRoomMeta] = useState({
    host: null,
    names: {},
    media: {},
    hands: {},
  });
  let [selfId, setSelfId] = useState(null);
  let [pendingRequests, setPendingRequests] = useState([]);
  let [showParticipants, setShowParticipants] = useState(false);
  let [showInvite, setShowInvite] = useState(false);
  let [showReactions, setShowReactions] = useState(false);
  let [handRaised, setHandRaised] = useState(false);
  let [reactions, setReactions] = useState([]);
  let [elapsed, setElapsed] = useState("00:00");
  let callStartRef = useRef(null);
  let reactionKeyRef = useRef(0);

  const isHost = selfId && roomMeta.host === selfId;

  let router = useNavigate();
  let { url } = useParams();
  let [searchParams] = useSearchParams();
  let meetingName = searchParams.get("name") || "";
  let { addToUserHistory } = useContext(AuthContext);

  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable ? AUDIO_CONSTRAINTS : false,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermissions();

    navigator.mediaDevices
      ?.enumerateDevices?.()
      .then((devices) => {
        const cams = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(cams.length > 1);
      })
      .catch(() => {});
  }, []);

  const videoConstraints = () => ({
    facingMode: { ideal: facingModeRef.current },
  });

  // Elapsed-time ticker, runs while in the call.
  useEffect(() => {
    if (phase !== "call") return;
    if (!callStartRef.current) callStartRef.current = Date.now();
    const tick = setInterval(() => {
      const s = Math.floor((Date.now() - callStartRef.current) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setElapsed(
        s >= 3600
          ? `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${ss}`
          : `${mm}:${ss}`
      );
    }, 1000);
    return () => clearInterval(tick);
  }, [phase]);

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let blackSilence = (...args) =>
    new MediaStream([black(...args), silence()]);

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      attachStream(connections[id], window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            attachStream(connections[id], window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({
          video: video ? videoConstraints() : false,
          audio: audio ? AUDIO_CONSTRAINTS : false,
        })
        .then(getUserMediaSuccess)
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit(
        "join-call",
        window.location.href,
        (username || "Guest").trim()
      );

      socketIdRef.current = socketRef.current.id;
      setSelfId(socketRef.current.id);

      socketRef.current.on("chat-message", addMessage);

      // ---- Admission lifecycle -------------------------------------------
      socketRef.current.on("waiting-room", () => {
        setPhase("waiting");
      });

      socketRef.current.on("admitted", (meta) => {
        setRoomMeta(meta);
        setPhase("call");
        // Tell the room our actual device state (pre-join toggles applied).
        socketRef.current.emit("media-state", {
          audio: preJoinAudio && audioAvailable,
          video: preJoinVideo && videoAvailable,
        });
      });

      socketRef.current.on("join-denied", () => {
        setPhase("denied");
        try {
          socketRef.current.disconnect();
        } catch (e) {
          console.log(e);
        }
      });

      socketRef.current.on("join-request", (id, name) => {
        setPendingRequests((prev) =>
          prev.some((p) => p.id === id)
            ? prev
            : [...prev, { id, username: name }]
        );
      });

      socketRef.current.on("join-request-cancelled", (id) => {
        setPendingRequests((prev) => prev.filter((p) => p.id !== id));
      });

      socketRef.current.on("host-changed", (newHost, meta) => {
        setRoomMeta(meta);
      });

      // ---- Live participant state ----------------------------------------
      socketRef.current.on("media-state", (id, state) => {
        setRoomMeta((m) => ({
          ...m,
          media: { ...m.media, [id]: state },
        }));
      });

      socketRef.current.on("raise-hand", (id, raised) => {
        setRoomMeta((m) => {
          const hands = { ...m.hands };
          if (raised) hands[id] = true;
          else delete hands[id];
          return { ...m, hands };
        });
      });

      socketRef.current.on("reaction", (id, emoji, name) => {
        const key = ++reactionKeyRef.current;
        const left = 38 + Math.round(((key * 37) % 25)); // deterministic spread
        setReactions((prev) => [...prev, { key, emoji, name, left }]);
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.key !== key));
        }, 2200);
      });

      socketRef.current.on("user-left", (id) => {
        // Close and drop the peer connection so it can be re-established
        // cleanly if that participant returns.
        if (connections[id]) {
          try {
            connections[id].close();
          } catch (e) {
            console.log(e);
          }
          delete connections[id];
        }
        setVideos((videos) => {
          const updatedVideos = videos.filter(
            (video) => video.socketId !== id
          );
          videoRef.current = updatedVideos;
          return updatedVideos;
        });
        setRoomMeta((m) => {
          const names = { ...m.names };
          const media = { ...m.media };
          const hands = { ...m.hands };
          delete names[id];
          delete media[id];
          delete hands[id];
          return { ...m, names, media, hands };
        });
        setPendingRequests((prev) => prev.filter((p) => p.id !== id));
      });

      socketRef.current.on("user-joined", (id, clients, meta) => {
        if (meta) setRoomMeta(meta);
        clients.forEach((socketListId) => {
          // Don't tear down peer connections we already have — the server
          // broadcasts the full participant list on every join, and recreating
          // an established connection would black out that participant.
          if (connections[socketListId]) return;

          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          connections[socketListId].ontrack = (event) => {
            const stream =
              (event.streams && event.streams[0]) ||
              new MediaStream([event.track]);

            // ontrack fires once per track (audio + video). Dedupe atomically
            // inside the updater — checking videoRef.current here would be stale
            // between the two synchronous calls and create a duplicate tile.
            setVideos((videos) => {
              const exists = videos.some(
                (video) => video.socketId === socketListId
              );
              const updatedVideos = exists
                ? videos.map((video) =>
                    video.socketId === socketListId
                      ? { ...video, stream }
                      : video
                  )
                : [
                    ...videos,
                    {
                      socketId: socketListId,
                      stream,
                      autoplay: true,
                      playsinline: true,
                    },
                  ];
              videoRef.current = updatedVideos;
              return updatedVideos;
            });
          };

          if (window.localStream === undefined || window.localStream === null) {
            window.localStream = blackSilence();
          }
          attachStream(connections[socketListId], window.localStream);
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              attachStream(connections[id2], window.localStream);
            } catch (err) {
              console.log(err);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((err) => console.log(err));
            });
          }
        }
      });
    });
  };

  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      attachStream(connections[id], window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleVideo = () => {
    const next = !video;
    setVideo(next);
    socketRef.current?.emit("media-state", { audio: !!audio, video: next });
  };

  let handleAudio = () => {
    const next = !audio;
    setAudio(next);
    socketRef.current?.emit("media-state", { audio: next, video: !!video });
  };

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleSwitchCamera = () => {
    const next = facingModeRef.current === "user" ? "environment" : "user";
    facingModeRef.current = next;
    setFacingMode(next);
    // Re-acquire with the new facing; attachStream() replaceTracks the new
    // video into every peer connection, so remotes keep receiving.
    if (video && videoAvailable && !screen) {
      getUserMedia();
    }
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    // Tear down peer connections and the socket so we leave cleanly.
    for (let id in connections) {
      try {
        connections[id].close();
      } catch (e) {
        console.log(e);
      }
      delete connections[id];
    }
    try {
      socketRef.current?.disconnect();
    } catch (e) {
      console.log(e);
    }

    // Signed-in users return to their dashboard; guests go to the landing page.
    router(isAuthenticated() ? "/home" : "/");
  };

  let sendMessage = () => {
    if (message.trim() === "") return;
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  let closeChat = () => {
    setModal(false);
  };

  let getMedia = () => {
    setVideo(videoAvailable && preJoinVideo);
    setAudio(audioAvailable && preJoinAudio);
    connectToSocketServer();
  };

  const connect = () => {
    if (!username.trim()) return;
    getMedia();
    setCallStream(window.localStream || null);
    // Guests have no token — recording history for them just 401s.
    if (url && isAuthenticated()) {
      addToUserHistory(url, meetingName).catch((e) => console.log(e));
    }
  };

  // Live-toggle the lobby preview tracks so what you see is what you join with.
  const togglePreJoin = (kind) => {
    const stream = window.localStream;
    if (kind === "audio") {
      setPreJoinAudio((v) => {
        const next = !v;
        stream?.getAudioTracks().forEach((t) => (t.enabled = next));
        return next;
      });
    } else {
      setPreJoinVideo((v) => {
        const next = !v;
        stream?.getVideoTracks().forEach((t) => (t.enabled = next));
        return next;
      });
    }
  };

  const cancelWaiting = () => {
    try {
      socketRef.current?.disconnect();
    } catch (e) {
      console.log(e);
    }
    try {
      window.localStream?.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.log(e);
    }
    router(isAuthenticated() ? "/home" : "/");
  };

  const admitUser = (id) => {
    socketRef.current?.emit("admit-user", id);
    setPendingRequests((prev) => prev.filter((p) => p.id !== id));
  };

  const denyUser = (id) => {
    socketRef.current?.emit("deny-user", id);
    setPendingRequests((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleHand = () => {
    setHandRaised((v) => {
      const next = !v;
      socketRef.current?.emit("raise-hand", next);
      return next;
    });
  };

  const sendReaction = (emoji) => {
    socketRef.current?.emit("reaction", emoji);
    setShowReactions(false);
  };

  useTranscription(
    callStream,
    socketRef.current,
    window.location.href,
    phase === "call" && !!callStream
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      {phase === "lobby" && (
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <Aurora />

          {/* Lobby header */}
          <header className="relative z-10 flex items-center justify-between p-6">
            <Brand to="/home" />
            <ThemeToggle />
          </header>

          {/* Pre-join */}
          <main className="relative z-10 flex flex-grow items-center justify-center px-6 pb-12">
            <div className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
              {/* Video preview */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  {/* Decorative conic arcs + soft under-glow */}
                  <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    aria-hidden="true"
                  >
                    <div className="ring-conic absolute -left-10 -top-12 h-44 w-44 animate-spinSlower rounded-full opacity-70" />
                    <div className="ring-conic absolute -bottom-7 -right-5 h-24 w-24 animate-spinSlow rounded-full opacity-40" />
                    <div className="absolute inset-x-10 -bottom-5 h-16 rounded-full bg-primary/30 blur-3xl" />
                  </div>
                  <div className="glass relative overflow-hidden rounded-[24px]">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className="aspect-video w-full object-cover"
                    ></video>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_60%,rgb(var(--c-bg)/0.5))]" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="chip bg-bg/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                        Camera preview
                      </span>
                    </div>
                    {/* Pre-join device toggles */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => togglePreJoin("audio")}
                        title={preJoinAudio ? "Join with mic off" : "Join with mic on"}
                        className={`preJoinToggle ${preJoinAudio ? "" : "off"}`}
                      >
                        <span className="material-symbols-outlined">
                          {preJoinAudio ? "mic" : "mic_off"}
                        </span>
                      </button>
                      <button
                        onClick={() => togglePreJoin("video")}
                        title={preJoinVideo ? "Join with camera off" : "Join with camera on"}
                        className={`preJoinToggle ${preJoinVideo ? "" : "off"}`}
                      >
                        <span className="material-symbols-outlined">
                          {preJoinVideo ? "videocam" : "videocam_off"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join card */}
              <div className="order-1 lg:order-2">
                <span className="chip mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  You're about to join
                </span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-text sm:text-4xl">
                  Ready to join?
                </h2>
                <p className="mt-3 text-muted">
                  Set your name so others recognise you in the room.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && connect()}
                    className="input-field h-12"
                  />
                  <button
                    onClick={connect}
                    disabled={!username.trim()}
                    className="btn-primary h-12 text-base disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                    Ask to join
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Room code</span>
                  <span className="chip font-mono text-text">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {url}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {phase === "waiting" && (
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <Aurora />
          <header className="relative z-10 flex items-center justify-between p-6">
            <Brand to="/home" />
            <ThemeToggle />
          </header>
          <main className="relative z-10 flex flex-grow flex-col items-center justify-center gap-6 px-6 pb-16 text-center">
            <div className="relative grid h-28 w-28 place-items-center">
              <span
                className="pointer-events-none absolute inset-0 rounded-full bg-primary/15 blur-2xl"
                aria-hidden="true"
              />
              <span
                className="ring-conic pointer-events-none absolute inset-0 animate-spinSlow rounded-full"
                aria-hidden="true"
              />
              <div className="waitingPulse">
                <span className="material-symbols-outlined text-[34px] text-primary">
                  meeting_room
                </span>
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-text sm:text-3xl">
                Asking to join…
              </h2>
              <p className="mt-2 max-w-sm text-muted">
                {meetingName ? (
                  <>
                    You'll enter <span className="text-text">{meetingName}</span>{" "}
                    as soon as the host lets you in.
                  </>
                ) : (
                  "You'll enter as soon as the host lets you in."
                )}
              </p>
            </div>
            <button onClick={cancelWaiting} className="btn-ghost px-6 py-2.5 text-sm">
              Cancel
            </button>
          </main>
        </div>
      )}

      {phase === "denied" && (
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <Aurora />
          <header className="relative z-10 flex items-center justify-between p-6">
            <Brand to="/home" />
            <ThemeToggle />
          </header>
          <main className="relative z-10 flex flex-grow flex-col items-center justify-center gap-6 px-6 pb-16 text-center">
            <span className="glass relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-danger/30 text-danger">
              <span
                className="pointer-events-none absolute inset-0 bg-danger/15"
                aria-hidden="true"
              />
              <span className="material-symbols-outlined relative text-[30px]">
                block
              </span>
            </span>
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-text sm:text-3xl">
                You weren't let in
              </h2>
              <p className="mt-2 max-w-sm text-muted">
                The host declined your request to join this meeting.
              </p>
            </div>
            <button
              onClick={() => router(isAuthenticated() ? "/home" : "/")}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              Back to home
            </button>
          </main>
        </div>
      )}

      {phase === "call" && (
        <div className="meetVideoContainer">
          {/* Meeting info bar */}
          <div className="meetInfoBar">
            <span className="meetInfoName">
              {meetingName || "Voxen meeting"}
            </span>
            <span className="meetInfoItem">{elapsed}</span>
            <span className="meetInfoItem">
              <span className="material-symbols-outlined text-[15px]">group</span>
              {Object.keys(roomMeta.names).length || 1}
            </span>
            {isHost && <span className="meetInfoHost">Host</span>}
          </div>

          {/* Host admission toasts */}
          {isHost && pendingRequests.length > 0 && (
            <div className="admitToasts">
              {pendingRequests.map((p) => (
                <div className="admitToast" key={p.id}>
                  <div className="admitToastText">
                    <span className="admitToastName">{p.username}</span>
                    <span className="admitToastSub">wants to join</span>
                  </div>
                  <div className="pendingActions">
                    <button className="admitBtn" onClick={() => admitUser(p.id)}>
                      Admit
                    </button>
                    <button className="denyBtn" onClick={() => denyUser(p.id)}>
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating reactions */}
          <div className="reactionsOverlay" aria-hidden>
            {reactions.map((r) => (
              <div className="reactionFloat" key={r.key} style={{ left: `${r.left}%` }}>
                <span className="reactionEmoji">{r.emoji}</span>
                <span className="reactionName">{r.name}</span>
              </div>
            ))}
          </div>

          <div className="conferenceView">
            {videos.length === 0 && (
              <div className="emptyConference">
                <p>Waiting for others to join…</p>
                <button
                  className="btn-primary mt-4 px-5 py-2.5 text-sm"
                  onClick={() => setShowInvite(true)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                  Invite people
                </button>
              </div>
            )}

            {videos.map((video) => {
              const media = roomMeta.media[video.socketId];
              const name =
                roomMeta.names[video.socketId] ||
                `Participant · ${video.socketId.slice(0, 5)}`;
              return (
                <div key={video.socketId}>
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      // Only assign when the stream actually changed — this
                      // callback runs on every render (e.g. each chat keystroke),
                      // and re-setting srcObject restarts playback → flicker.
                      if (ref && video.stream && ref.srcObject !== video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>
                  <h2>
                    <span className="dot" />
                    {name}
                    {video.socketId === roomMeta.host && (
                      <span className="tileHost">Host</span>
                    )}
                  </h2>
                  <div className="tileBadges">
                    {roomMeta.hands[video.socketId] && (
                      <span className="tileBadge hand">✋</span>
                    )}
                    {media && !media.audio && (
                      <span className="tileBadge muted">
                        <span className="material-symbols-outlined">mic_off</span>
                      </span>
                    )}
                    {media && !media.video && (
                      <span className="tileBadge muted">
                        <span className="material-symbols-outlined">
                          videocam_off
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="meetUserVideo"
          ></video>

          <div className="buttonContainers">
            <button
              className={`controlButton ${audio ? "" : "off"}`}
              onClick={handleAudio}
              title={audio ? "Mute microphone" : "Unmute microphone"}
            >
              <span className="material-symbols-outlined">
                {audio ? "mic" : "mic_off"}
              </span>
            </button>

            <button
              className={`controlButton ${video ? "" : "off"}`}
              onClick={handleVideo}
              title={video ? "Turn off camera" : "Turn on camera"}
            >
              <span className="material-symbols-outlined">
                {video ? "videocam" : "videocam_off"}
              </span>
            </button>

            {hasMultipleCameras && (
              <button
                className="controlButton"
                onClick={handleSwitchCamera}
                title={
                  facingMode === "user"
                    ? "Switch to rear camera"
                    : "Switch to front camera"
                }
              >
                <span className="material-symbols-outlined">cameraswitch</span>
              </button>
            )}

            {screenAvailable && (
              <button
                className={`controlButton ${screen ? "active" : ""}`}
                onClick={handleScreen}
                title="Share screen"
              >
                <span className="material-symbols-outlined">screen_share</span>
              </button>
            )}

            <button
              className={`controlButton ${showTranscript ? "active" : ""}`}
              onClick={() => setShowTranscript((v) => !v)}
              title="Live transcript"
            >
              <span className="material-symbols-outlined">closed_caption</span>
            </button>

            <button
              className={`controlButton ${handRaised ? "active" : ""}`}
              onClick={toggleHand}
              title={handRaised ? "Lower hand" : "Raise hand"}
            >
              <span className="material-symbols-outlined">front_hand</span>
            </button>

            <div className="reactionsAnchor">
              {showReactions && (
                <div className="reactionsPopover">
                  {REACTION_EMOJIS.map((e) => (
                    <button
                      key={e}
                      className="reactionChoice"
                      onClick={() => sendReaction(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
              <button
                className={`controlButton ${showReactions ? "active" : ""}`}
                onClick={() => setShowReactions((v) => !v)}
                title="Reactions"
              >
                <span className="material-symbols-outlined">add_reaction</span>
              </button>
            </div>

            <button
              className={`controlButton ${showParticipants ? "active" : ""}`}
              onClick={() => setShowParticipants((v) => !v)}
              title="Participants"
            >
              <span className="material-symbols-outlined">group</span>
              {(Object.keys(roomMeta.names).length > 1 ||
                pendingRequests.length > 0) && (
                <span className={`chatBadge ${pendingRequests.length ? "" : "neutral"}`}>
                  {pendingRequests.length || Object.keys(roomMeta.names).length}
                </span>
              )}
            </button>

            <button
              className="controlButton"
              onClick={() => setShowInvite(true)}
              title="Invite people"
            >
              <span className="material-symbols-outlined">person_add</span>
            </button>

            <button
              className={`controlButton ${showModal ? "active" : ""}`}
              onClick={() => (showModal ? closeChat() : openChat())}
              title="Chat"
            >
              <span className="material-symbols-outlined">chat</span>
              {newMessages > 0 && (
                <span className="chatBadge">{newMessages}</span>
              )}
            </button>

            <button
              className="controlButton endCallButton"
              onClick={handleEndCall}
              title="Leave call"
            >
              <span className="material-symbols-outlined">call_end</span>
            </button>
          </div>

          <TranscriptSidebar
            socket={socketRef.current}
            open={showTranscript}
            onClose={() => setShowTranscript(false)}
          />

          <ParticipantsPanel
            open={showParticipants}
            onClose={() => setShowParticipants(false)}
            selfId={selfId}
            meta={roomMeta}
            pending={pendingRequests}
            isHost={isHost}
            onAdmit={admitUser}
            onDeny={denyUser}
          />

          <InviteModal
            open={showInvite}
            onClose={() => setShowInvite(false)}
            roomCode={url || ""}
            meetingName={meetingName}
          />

          {showModal && (
            <div className="chatRoom">
              <div className="chatHeader">
                <span>Chat</span>
                <button onClick={closeChat} title="Close chat">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="chattingDisplay">
                {messages.length === 0 ? (
                  <div className="chatEmpty">No messages yet</div>
                ) : (
                  messages.map((item, index) => (
                    <div className="chatMessage" key={index}>
                      <span className="sender">{item.sender}</span>
                      <span className="text">{item.data}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="chattingArea">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button className="sendButton" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
