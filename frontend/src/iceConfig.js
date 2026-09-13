// ICE servers for the peer connections.
//
// STUN alone only works when at least one side can be reached directly. Behind
// symmetric NAT or a restrictive corporate firewall — a large share of real
// users — the candidates never pair up and the call connects to nothing. A
// TURN relay is what covers those networks, so configure one for production:
//
//   VITE_TURN_URLS=turn:turn.example.com:3478,turns:turn.example.com:5349
//   VITE_TURN_USERNAME=<username>
//   VITE_TURN_CREDENTIAL=<credential>
//
// Long-lived static credentials in a client bundle are readable by anyone who
// opens devtools. For anything beyond a small deployment, have the backend
// mint short-lived TURN credentials per call instead.
const list = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const STUN_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const turnUrls = list(import.meta.env.VITE_TURN_URLS);

export const iceServers = [
  ...STUN_SERVERS,
  ...(turnUrls.length
    ? [
        {
          urls: turnUrls,
          username: import.meta.env.VITE_TURN_USERNAME || undefined,
          credential: import.meta.env.VITE_TURN_CREDENTIAL || undefined,
        },
      ]
    : []),
];

export const hasTurn = turnUrls.length > 0;

export default { iceServers };
