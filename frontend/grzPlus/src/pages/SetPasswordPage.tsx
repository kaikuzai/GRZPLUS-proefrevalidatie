// src/pages/SetPasswordPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SetPasswordPage.css";
import authService from "../services/auth-service";
import Navbar from "../components/Navbar/Navbar";

interface SetPasswordParams {
  token: string;
}

const SetPasswordPage: React.FC = () => {
  const { token } = useParams<keyof SetPasswordParams>() as SetPasswordParams;
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log(token);
      if (!token) {
        setIsTokenValid(false);
        setError("Ongeldige link");
        setLoading(false);
        return;
      }

      try {
        const response = await authService.validateToken(token);
        setIsTokenValid(response.valid);

        if (!response.valid) {
          setError(
            response.reason === "expired"
              ? "This password reset link has expired. Please contact your administrator for a new link."
              : "Invalid password reset link"
          );
        }
      } catch (err) {
        setIsTokenValid(false);
        setError("Error validating token");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    if (password.length < 8) {
      setError("Je wachtwoord moet minimaal 8 tekens bevatten");
      return;
    }

    try {
      setLoading(true);
      const result = await authService.setPassword({
        token,
        password,
        confirm_password: confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        // Navigate to onboarding after showing success message
        setTimeout(() => {
          navigate("/onboarding");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Er was een storing tijdens het instellen van jouw wachtwoord");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="set-password-container">
        <div className="set-password-card">
          <h1 className="set-password-title">Laden...</h1>
        </div>
      </div>
    );
  }

  if (error && !isTokenValid) {
    return (
      <div className="set-password-container">
        <div className="set-password-card">
          <h1 className="set-password-title">Stel je wachtwoord in</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="set-password-container">
        <div className="set-password-card">
          <div className="success-icon">✅</div>
          <h1 className="set-password-title">
            Wachtwoord succesvol ingesteld!
          </h1>
          <div className="success-message">
            Je wachtwoord is succesvol ingesteld. We leiden je nu door naar een
            korte rondleiding...
          </div>
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="set-password-container">
        <div className="set-password-card">
          <h1 className="set-password-title">Stel je wachtwoord in</h1>
          <p className="set-password-subtitle">
            Stel een wachtwoord in om jouw account af te maken
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Vul je wachtwoord in"
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Bevestig wachtwoord
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Bevestig je wachtwoord"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? "disabled" : ""}`}
            >
              {loading
                ? "Wachtwoord aan het instellen..."
                : "Stel wachtwoord in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SetPasswordPage;
