// Backend origin. VITE_SERVER_URL wins when set, so a deploy can point at a
// different backend without a code change; the constants below stay as the
// defaults for the standard hosted setup and local development.
const PROD_URL = "https://voxen-backend-wpcz.onrender.com";
const DEV_URL = "http://localhost:8000";

const server_url =
  import.meta.env.VITE_SERVER_URL?.replace(/\/+$/, "") ||
  (import.meta.env.PROD ? PROD_URL : DEV_URL);

export default server_url;
