import axios from "axios";
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server_url from "../environment.js";
import { getToken, setToken, clearToken } from "../utils/auth.js";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server_url}/api/v1/users`,
});

// Tokens travel in the Authorization header rather than the body/query, so
// they stay out of access logs and Referer headers.
client.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// A rejected token is only ever stale — drop it so the route guards send the
// user to sign in instead of leaving them on a screen that can't load.
client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === httpStatus.UNAUTHORIZED) clearToken();
    return Promise.reject(err);
  }
);

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    const request = await client.post("/register", { name, username, password });

    // Registration signs the user in directly; no second round of credentials.
    if (request.data?.token) {
      setToken(request.data.token);
      setUserData(request.data.user ?? {});
      router("/home");
    }
    return request.data;
  };

  const handleLogin = async (username, password) => {
    const request = await client.post("/login", { username, password });

    if (request.status === httpStatus.OK && request.data?.token) {
      setToken(request.data.token);
      setUserData(request.data.user ?? {});
      router("/home");
    }

    return request.data;
  };

  const addToUserHistory = async (meetingCode, meetingName = "") =>
    client.post("/add_to_activity", {
      meeting_code: meetingCode,
      meeting_name: meetingName,
    });

  const getHistoryOfUser = async () => {
    const request = await client.get("/get_all_activity");
    return request.data;
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    addToUserHistory,
    getHistoryOfUser,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
