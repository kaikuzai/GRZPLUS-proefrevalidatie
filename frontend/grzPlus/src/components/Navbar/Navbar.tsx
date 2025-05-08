"use client";

import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

// You'll need to install these icons or use alternatives
// npm install lucide-react
import { Menu, X } from "lucide-react";

// If you don't have lucide-react, you can use simple HTML for the icons:
// const MenuIcon = () => <div>☰</div>
// const CloseIcon = () => <div>✕</div>

interface NavbarProps {
  logo?: React.ReactNode;
  links?: {
    to: string;
    label: string;
  }[];
}

export default function Navbar({
  logo = "/pubilic/logo-grzplus.svg",
  links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/formulieren", label: "Formulieren" },
    { to: "/login", label: "Login" },
    { to: "/add-patient", label: "Patient toevoegen" },
  ],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
              {links.map((link) => (
                <Link key={link.to} to={link.to}>
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
          {links.map((link) => (
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
  );
}
