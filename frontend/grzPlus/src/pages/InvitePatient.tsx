import React, { useState } from "react";
import axios from "axios";
import "../styles/AdminInviteUserPage.css";
import apiClient from "../services/api-client";
import Navbar from "../components/Navbar/Navbar";

interface InviteUserForm {
  email: string;
  firstName: string;
  lastName: string;
}

const InvitePatient: React.FC = () => {
  const [form, setForm] = useState<InviteUserForm>({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/api/users/invite-patient/",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message);
      setForm({
        email: "",
        firstName: "",
        lastName: "",
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Failed to invite user");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="invite-user-container">
        <h1 className="invite-user-title">Client uitnodigen</h1>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="invite-user-form">
          <div className="admin-form-container">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                * Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                * Voornaam
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                * Achternaam
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="button-container">
            <button
              type="submit"
              disabled={loading}
              className={`invite-submit-button ${loading ? "disabled" : ""}`}
            >
              {loading
                ? "Uitnodiging aan het verzenden."
                : "Uitnodiging verzenden"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InvitePatient;
