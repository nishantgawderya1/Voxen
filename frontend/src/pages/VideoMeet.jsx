import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext.jsx";
import server_url from "../environment.js";
import Brand from "../components/Brand.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Aurora from "../components/Aurora.jsx";
import "../styles/videoComponent.css";

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

  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");

  let router = useNavigate();
  let { url } = useParams();
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
  }, []);

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
          video: video,
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
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

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
      });

      socketRef.current.on("user-joined", (id, clients) => {
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
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    router("/");
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
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const connect = () => {
    setAskForUsername(false);
    getMedia();
    if (url) {
      addToUserHistory(url).catch((e) => console.log(e));
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {askForUsername ? (
        <div className="relative flex min-h-screen flex-col">
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
                <div className="relative overflow-hidden rounded-[24px] border border-line/10 bg-surface/70 shadow-soft backdrop-blur-xl">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="aspect-video w-full object-cover"
                  ></video>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_60%,rgb(var(--c-bg)/0.5))]" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="chip bg-bg/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                      Camera preview
                    </span>
                  </div>
                </div>
              </div>

              {/* Join card */}
              <div className="order-1 lg:order-2">
                <span className="chip mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  You're about to join
                </span>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
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
                  <button onClick={connect} className="btn-primary h-12 text-base">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                    Join meeting
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted">
                  Room code: <span className="font-mono text-text">{url}</span>
                </p>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="meetVideoContainer">
          <div className="conferenceView">
            {videos.length === 0 && (
              <div className="emptyConference">
                Waiting for others to join… open this same link in another tab
                or share it to invite people.
              </div>
            )}

            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                ></video>
                <h2>
                  <span className="dot" />
                  Participant · {video.socketId.slice(0, 5)}
                </h2>
              </div>
            ))}
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
