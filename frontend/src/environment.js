const PROD_URL = "https://voxen-backend-wpcz.onrender.com";
const DEV_URL = "http://localhost:8000";

const server_url = import.meta.env.PROD ? PROD_URL : DEV_URL;

export default server_url;
