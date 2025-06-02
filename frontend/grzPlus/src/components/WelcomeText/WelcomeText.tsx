import { useNavigate } from "react-router-dom";
import "./WelcomeText.css";

const WelcomeText = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Het is tijd om <span className="hero-accent">je herstel</span> eigen
          te maken
        </h1>

        <p className="hero-subtitle">
          Voor patiënten en zorgverleners die het revalidatietraject helder,
          persoonlijk en effectief willen volgen.
        </p>

        <button className="cta-button" onClick={handleGetStarted}>
          Aan de slag
        </button>
      </div>
    </div>
  );
};

export default WelcomeText;
