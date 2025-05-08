// src/components/WelcomeScreen.tsx
import React from "react";
import "../styles/HomePage.css";

import Navbar from "../components/Navbar/Navbar";
import WelcomeText from "../components/WelcomeText/WelcomeText";

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="welcome-text-container">
        <WelcomeText />
      </div>
    </>
  );
};

export default HomePage;
