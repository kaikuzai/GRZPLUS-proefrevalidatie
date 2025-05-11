import Cookies from "js-cookie";
import useAuthorizationCheck from "../hooks/useAuthorization";
import { useEffect, useState } from "react";
import useLoginUser from "../hooks/useLogin";
import useLogoutUser from "../hooks/useLogout";

interface Response {
  name: string;
  request_session: object;
  is_authenticated: boolean;
  is_anonymous: boolean;
}

const AuthenticationCheck: React.FC = () => {
  const [authorizationStatus, setAuthorizationStatus] = useState<Response>();
  const { fetchAuthorization } = useAuthorizationCheck();
  const { login } = useLoginUser();
  const { logout } = useLogoutUser();

  const handleLogin = async () => {
    await login("bob", "wachtwoord");
    const response = await fetchAuthorization();
    setAuthorizationStatus(response);
  };

  const handleLogout = async () => {
    await logout();
    const response = await fetchAuthorization();
    setAuthorizationStatus(response);
  };

  useEffect(() => {
    const getStatus = async () => {
      const response = await fetchAuthorization();
      setAuthorizationStatus(response);
    };
    getStatus();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Authentication Status
        </h2>
        <p
          style={{
            color: "#000",
            fontSize: "16px",
            lineHeight: "1.5",
            wordBreak: "break-word",
          }}
        >
          Here we have the CSRF cookie:{" "}
          <strong>{Cookies.get("csrftoken") || "Not found"}</strong>
        </p>
        <p
          style={{
            color: "#000",
            fontSize: "16px",
            lineHeight: "1.5",
            wordBreak: "break-word",
          }}
        >
          Here we have the session id:{" "}
          <strong>{Cookies.get("sessionid") || "Not found"}</strong>
        </p>
        <p style={{ color: "#000", fontSize: "16px", lineHeight: "1.5" }}>
          The user who is making this request:{" "}
          <strong>
            {authorizationStatus ? authorizationStatus.name : "error"}
          </strong>
        </p>
        <p style={{ color: "#000", fontSize: "16px", lineHeight: "1.5" }}>
          user is authenticated:{" "}
          <strong>
            {authorizationStatus
              ? String(authorizationStatus.is_authenticated)
              : "error"}
          </strong>
        </p>
        <p style={{ color: "#000", fontSize: "16px", lineHeight: "1.5" }}>
          user is anonymous:{" "}
          <strong>
            {authorizationStatus
              ? String(authorizationStatus.is_anonymous)
              : "error"}
          </strong>
        </p>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => handleLogin()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationCheck;
