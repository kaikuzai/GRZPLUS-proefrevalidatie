import { useNavigate } from "react-router-dom";
import "./WelcomeText.css";

const WelcomeText = () => {
  const navigate = useNavigate();

  const handlePatient = () => {
    navigate("/formulieren");
  };

  const handleCaregiver = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-header">Welkom in de GRZPLUS Revalidatie APP</h1>
      <p className="welcome-text">Laat weten wie je bent om door te gaan.</p>
      <div className="button-container">
        <button className="button" onClick={handlePatient}>
          Ik ben revalidant
        </button>
        <button className="button" onClick={handleCaregiver}>
          Ik ben zorgverlener
        </button>
      </div>
    </div>
  );
};

export default WelcomeText;
