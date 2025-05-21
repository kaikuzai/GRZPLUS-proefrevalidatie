
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../state/store";
import "./WelcomeText.css";

const WelcomeText = () => {
  const isAuthenticated = useSelector(
    (state: Rootstate) => state.authorization.isAuthenticated
  );
  const userRole = useSelector((state: Rootstate) => state.authorization.role);
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
      {!isAuthenticated ? (
        <>
          <p className="welcome-text">Laat weten wie je bent om door te gaan.</p>
          <div className="button-container">
            <button className="button" onClick={handlePatient}>
              Ik ben revalidant
            </button>
            <button className="button" onClick={handleCaregiver}>
              Ik ben zorgverlener
            </button>
          </div>
        </>
      ) : userRole === "patient" ? (
        <>
        <p className="welcome-text-patient">
          Deze app helpt jou als revalidant om jouw ervaringen tijdens het proefverlof eenvoudig vast te leggen. In elke ruimte van je woning kun je aangeven hoe het is gegaan, of je ergens tegenaan liep, en je kunt beeldmateriaal toevoegen om je situatie beter uit te leggen.

          Door het invullen van de formulieren krijgt je behandelteam waardevolle informatie om jouw revalidatie nog beter af te stemmen op wat jij thuis écht nodig hebt.
        </p>
         <button className="button" onClick={handlePatient}>
           Ga naar formulieren
         </button>
       </>
      ): (
        <>
        <p className="welcome-text-supporter">
          Als mantelzorger kun je via deze app de ervaringen van de revalidant vastleggen volgens jou perspectief. 
        </p>
        <button className="button" onClick={handlePatient}>
        Ga naar formulieren
      </button>
      </>
      )}
    </div>
  );
};

export default WelcomeText;
