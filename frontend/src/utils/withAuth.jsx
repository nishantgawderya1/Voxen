import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";
import Loader from "../components/Loader.jsx";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useNavigate();
    const [status, setStatus] = useState("checking"); // checking | authed

    useEffect(() => {
      if (isAuthenticated()) {
        setStatus("authed");
      } else {
        router("/auth", { replace: true });
      }
    }, [router]);

    // Don't flash protected content before the redirect resolves.
    if (status !== "authed") {
      return <Loader label="Loading your workspace…" />;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
