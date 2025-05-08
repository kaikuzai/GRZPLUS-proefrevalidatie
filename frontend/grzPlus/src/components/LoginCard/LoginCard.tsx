import React from "react";
import "./LoginCard.css";

const LoginCard: React.FC = () => {
  return (
    <div className="login-card">
      <h1 className="login-title">Login</h1>
      <p className="login-subtitle">
        Nog geen account? Neem contact op met GRZ{" "}
      </p>
      <form className="login-form">
        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder="Vul je email adres in"
          required
        />

        <label htmlFor="password" className="login-label">
          Wachtwoord
        </label>
        <input
          type="password"
          id="password"
          className="login-input"
          placeholder="Voer je wachtwoord in"
          required
        />

        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginCard;
