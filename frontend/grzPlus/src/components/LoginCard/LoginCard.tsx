import React, { useState } from "react";
import "./LoginCard.css";
import useLoginUser from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

interface Response {
  response: string;
  role?: string;
  email?: string;
  name?: string;
}

const LoginCard: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<Response>();
  const { login } = useLoginUser();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { username, password });

    await login(username, password);
    const response = await login(username, password);
    console.log("response value", response);
    setResponse(response);
    if (response?.response === "Succeeded") {
      switch (response.role) {
        case "caregiver":
          navigate("/dashboard");
          break;
        case "patient":
          navigate("/formulieren");
          break;
      }
    } else {
      alert("Can't log you in, please try again");
    }
  };

  return (
    <div className="login-card">
      <form
        onSubmit={handleSubmit}
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   width: "350px",
        //   padding: "30px",
        //   backgroundColor: "#ffffff",
        //   borderRadius: "8px",
        //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        // }}
      >
        <h2 className="login-title">Login</h2>

        {/* Username Input */}
        <label
        // style={{
        //   marginBottom: "5px",
        //   fontWeight: "bold",
        //   fontSize: "14px",
        //   color: "#666",
        // }}
        >
          Email
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Vul je e-mail in"
          autoComplete="email"
          // style={{
          //   marginBottom: "15px",
          //   padding: "10px",
          //   border: "1px solid #ccc",
          //   borderRadius: "5px",
          //   backgroundColor: "#ffffff",
          //   color: "#000",
          //   fontSize: "14px",
          // }}
          required
        />

        {/* Password Input */}
        <label
        // style={{
        //   marginBottom: "5px",
        //   fontWeight: "bold",
        //   fontSize: "14px",
        //   color: "#666",
        // }}
        >
          Wachtwoord
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vul hier je wachtwoord in"
          autoComplete="new-password"
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            color: "#000",
            fontSize: "14px",
          }}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!username || !password}
          style={{
            padding: "10px",
            backgroundColor: username && password ? "#28a745" : "#ccc",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: username && password ? "pointer" : "not-allowed",
            transition: "background-color 0.3s",
          }}
        >
          Login
        </button>

        {/* Response Message */}
        {response && (
          <p
            style={{
              color: "green",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {response.response}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginCard;
