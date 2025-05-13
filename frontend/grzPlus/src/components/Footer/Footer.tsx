import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="grzplus-footer">
      <div className="footer-content">
        <div className="footer-logo-section">
          <div className="logo-container">
            <div className="plus-logo">+</div>
            <div className="logo-text">
              <h2>Oefenen ontslag</h2>
              <p>Alles is revalidatie</p>
            </div>
          </div>
        </div>

        <div className="footer-contact-section">
          <div className="contact-column">
            <h3>GRZPLUS:</h3>
            <p>E-mail: info@grzplus.nl</p>
          </div>

          <div className="contact-column">
            <h3>Zorgcirkel Westerhout:</h3>
            <p>Telefoon: 088 859 7200</p>
            <p>E-mail: klantenservice@zorgcirkel.nl</p>
          </div>

          <div className="contact-column">
            <h3>Omring Lindendael:</h3>
            <p>Telefoon: 088 - 206 89 10</p>
            <p>E-mail: service@omring.nl</p>
          </div>
        </div>

        <div className="footer-logos">
          <div className="logo-placeholder grey-square"></div>
          <div className="logo-placeholder grey-square"></div>
        </div>

        <div className="footer-credits">
          <p>
            Deze website is gemaakt door studenten van de Minor Zorgtechnologie
            van de Hogeschool van Amsterdam.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
