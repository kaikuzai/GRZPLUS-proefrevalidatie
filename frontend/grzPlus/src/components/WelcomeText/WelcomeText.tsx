import { useNavigate } from "react-router-dom";
import "./WelcomeText.css";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../state/store";

const WelcomeText = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state: Rootstate) => state.authorization?.role);

  const handleGetStarted = () => {
    if (userRole === "patient") {
      navigate("/formulieren");
    }
    if (userRole === "admin") {
      navigate("/dashboard");
    }
    if (userRole === "caregiver") {
      navigate("/dashboard");
    }
    if (userRole == null) {
      navigate("/login");
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Het is tijd om <span className="hero-accent">uw herstel</span> eigen
          te maken
        </h1>

        <p className="hero-subtitle">
          {userRole === "patient" ? (
            <>
              Deze app helpt u als client om uw ervaringen tijdens het proefverlof eenvoudig vast te leggen. 
              U kunt per ruimte in uw woning aangeven hoe het is gegaan, wat goed ging en waar u tegenaan liep. 
              Ook kunt u foto's of video's toevoegen om uw situatie beter uit te leggen. Zo kan uw behandelteam 
              na het proefverlof beter inspelen op uw thuissituatie.
            </>
          ) : (
            <>
              Voor clienten en zorgverleners die het revalidatietraject helder, persoonlijk en effectief willen volgen.
            </>
          )}
        </p>

        <button className="cta-button" onClick={handleGetStarted}>
          Aan de slag
        </button>
      </div>
    </div>
  );
};

export default WelcomeText;
