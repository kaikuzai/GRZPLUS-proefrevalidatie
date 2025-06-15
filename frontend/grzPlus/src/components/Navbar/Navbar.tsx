"use client";

import type React from "react";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../state/store";
import useLogoutUser from "../../hooks/useLogout";

interface NavbarProps {
  logo?: React.ReactNode;
}

export default function Navbar({
  logo = "/pubilic/logo-grzplus.svg",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogoutUser();
  const isAuthenticated = useSelector(
    (state: Rootstate) => state.authorization.isAuthenticated
  );
  const userRole = useSelector((state: Rootstate) => state.authorization.role);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const location = useLocation();
  const { pathname } = location;

  const handleLogout = () => {
    setShowClearConfirm(true);
  };

  const confirmLogout = async () => {
    console.log("authentication before", isAuthenticated);
    await logout();
    console.log("authentication after", isAuthenticated);
    setShowClearConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowClearConfirm(false);
  };

  const navLinks = isAuthenticated
    ? userRole === "patient"
      ? [
          { to: "/", label: "Home" },
          { to: "/formulieren", label: "Formulieren" },
          { to: pathname, label: "Logout", func: handleLogout },
        ]
      : userRole === "caregiver"
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/patient-toevoegen", label: "Patient toevoegen" },
          { to: "/patienten", label: "Patient Overzicht" },
          { to: pathname, label: "Logout", func: handleLogout },
        ]
      : userRole === "admin"
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/patient-toevoegen", label: "Revalidant toevoegen" },
          { to: "/zorgverlener-toevoegen", label: "Zorgverlener toevoegen" },
          { to: "/patienten", label: "Patient Overzicht" },
          { to: pathname, label: "Logout", func: handleLogout },
        ]
      : []
    : [
        { to: "/", label: "Home" },
        { to: "/rondleiding", label: "Hoe werkt het?" },
        { to: "/login", label: "Login" },
      ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo container */}
            <div className="logo-container">
              {logo ? (
                <div className="logo-image-container">
                  {" "}
                  <img className="navbar-logo" src="/logo-grzplus.svg" />
                </div>
              ) : (
                <div className="default-logo">Default Logo</div>
              )}
            </div>

            {/* Desktop navigation */}
            <div className="desktop-nav">
              <div className="nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={link.func ? link.func : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-button">
              <button
                type="button"
                className="menu-button"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
          id="mobile-menu"
        >
          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Uitloggen?</h3>
            <p className="confirmation-text">
              Weet je zeker dat je wilt uitloggen?
            </p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelLogout}>
                Annuleren
              </button>
              <button className="confirm-button" onClick={confirmLogout}>
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
