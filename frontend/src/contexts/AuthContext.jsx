import axios from "axios";
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server_url from "../environment.js";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server_url}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home");
      }

      return request.data;
    } catch (err) {
      throw err;
    }
  };

  let addToUserHistory = async (meetingCode, meetingName = "") => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
        meeting_name: meetingName,
      });
      return request;
    } catch (e) {
      throw e;
    }
  };

  let getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: { token: localStorage.getItem("token") },
      });
      return request.data;
    } catch (e) {
      // A 401 means the stored token is stale (tokens rotate on each login).
      // Clear it so route guards send the user back to sign-in.
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
      }
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    addToUserHistory,
    getHistoryOfUser,
  };

  return (
    <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
  );
};
