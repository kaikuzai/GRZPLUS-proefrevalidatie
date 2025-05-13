import React from "react";
import "../styles/InformationPage2.css";

const InformationPage: React.FC = () => {
  return (
    <div className="discharge-practice-container">
      <h1>U gaat met oefenen ontslag</h1>

      <section className="introduction">
        <p>
          Na een periode van herstel of revalidatie staat u op het punt om weer
          zelfstandig thuis te functioneren. Om deze overgang soepel te maken,
          dat u eerst met oefenen ontslag gaat. Dan gaat u 1 of 2 dagen naar
          huis met partner of mantelzorger. U ondervindt dan hoe het is om thuis
          uw dagelijkse activiteiten uit te voeren en te ontdekken wat goed gaat
          en waar mogelijk aanpassingen of extra ondersteuning nodig zijn. Met
          een interactieve digitale vragenlijst evalueren we uw thuissituatie,
          samen met uw verzorger vanuit de zorginstelling, om uw zelfstandige
          terugkeer optimaal voor te bereiden.
        </p>
      </section>

      <section className="goal-section">
        <h2>Doel van het oefenen ontslag</h2>
        <p>
          Het oefenen ontslag heeft als doel dat u thuis de activiteiten, die u
          straks weer zelf moet uitvoeren, zo zelfstandig mogelijk uitprobeert.
          Met behulp van de evaluatie kunt u en uw verzorger behandeldoelen op-
          of bijstellen en nagaan welke aanpassingen nodig zijn om thuis goed te
          functioneren. Deze aanpak zorgt ervoor dat uw thuissituatie zo
          volledig mogelijk is afgestemd op uw wensen en behoeften, zodat u
          uiteindelijk zo zelfstandig mogelijk kunt leven.
        </p>
      </section>

      <section className="digital-questionnaire-section">
        <h2>Hoe gebruik ik de digitale vragenlijst als revalidant?</h2>
        <p>
          De digitale vragenlijst speelt een belangrijke rol in het proces.
          Hiermee brengt u, samen met uw partner of mantelzorger, uw
          thuissituatie in kaart. De vragenlijst leidt u door verschillende
          ruimtes in uw huis, zoals de woonkamer, badkamer en slaapkamer. Voor
          elke ruimte beantwoordt u vragen over specifieke activiteiten die
          daarbij betrekking hebben.
        </p>

        <p>
          Daarnaast kan uw partner of mantelzorger hun ervaring delen,
          bijvoorbeeld of zij extra hulp moeten bieden of aanpassingen nodig
          achten. Dit biedt een breder perspectief op uw situatie voor als u
          terug bent in de zorginstelling.
        </p>

        <p>
          Na het invullen van de vragenlijst bespreekt u samen met uw verzorger
          de uitkomsten. Dit helpt om te bepalen wat al goed gaat en welke
          ondersteuning of aanpassingen nodig zijn wanneer u definitief naar
          huis gaat. Zo wordt uw terugkeer naar huis zo zelfstandig en
          ondersteund mogelijk gemaakt.
        </p>
      </section>
    </div>
  );
};

export default InformationPage;
