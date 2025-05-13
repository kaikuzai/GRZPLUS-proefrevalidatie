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
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        {/* Username Input */}
        <label className="login-label">Email</label>
        <input
          className="email-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Vul je e-mail in"
          autoComplete="email"
          required
        />

        {/* Password Input */}
        <label className="login-label">Wachtwoord</label>
        <input
          className="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vul hier je wachtwoord in"
          autoComplete="new-password"
          required
        />

        {/* Submit Button */}
        <button
          className="login-button"
          type="submit"
          disabled={!username || !password}
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
