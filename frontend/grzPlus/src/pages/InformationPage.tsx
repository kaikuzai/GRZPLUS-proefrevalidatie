import React from "react";
import "../styles/InformationPage.css";

const InformationPage: React.FC = () => {
  return (
    <div className="discharge-practice-container">
      <h1>U gaat met oefenen ontslag</h1>

      <div className="main-content">
        <div className="goal-section">
          <p className="goal-description">
            Het doel van het oefenen ontslag is dat u thuis de activiteiten, die
            u straks ook weer zelf moet kunnen, zo zelfstandig mogelijk
            uitprobeert.
          </p>
        </div>

        <div className="home-activities">
          <h2>Activiteiten om zelfstandig te oefenen</h2>
          <ul>
            <li>Huishoudelijke taken</li>
            <li>Hobby's</li>
            <li>Wassen/zelfzorg en Toiletgang</li>
            <li>Aankleden In/uit bed</li>
            <li>Toegankelijkheid en drempels in de woning</li>
            <li>Koffiezetten</li>
            <li>Koken</li>
            <li>Vaat</li>
            <li>Boodschappen</li>
          </ul>
        </div>

        <div className="instructions-section">
          <h2>Instructies voor Oefenen Ontslag</h2>
          <div className="instruction-steps">
            <div className="instruction-item">
              <span className="icon">📝</span>
              <p>
                Maak gebruik van het oefenen ontslag formulier, noteer waar u
                tegenaan loopt en probeer alles zo zelfstandig mogelijk (al waar
                u het met uw partner deed).
              </p>
            </div>
            <div className="instruction-item">
              <span className="icon">💊</span>
              <p>Denk thuis aan uw medicatie</p>
            </div>
            <div className="instruction-item">
              <span className="icon">📸</span>
              <p>
                Als u ergens over twijfelt of gaat iets niet zoals u het
                voorheen deed, maak een foto/video
              </p>
            </div>
            <div className="instruction-item">
              <span className="icon">📞</span>
              <p>Bij vragen neem contact op met de locatie</p>
            </div>
          </div>
        </div>

        <div className="evaluation-section">
          <h2>Evaluatie</h2>
          <p>
            Met het oefenen ontslag formulier gaat u de uitkomst evalueren om
            eventuele behandeldoelen bij te stellen en bekijken welke
            aanpassingen nog nodig zijn om thuis te functioneren.
          </p>
        </div>
      </div>

      <footer className="footer">
        <div className="logo-section">
          <span>GRZplus</span>
          <p>Denk aan het milieu en lever dit blad weer in</p>
        </div>
      </footer>
    </div>
  );
};

export default InformationPage;
