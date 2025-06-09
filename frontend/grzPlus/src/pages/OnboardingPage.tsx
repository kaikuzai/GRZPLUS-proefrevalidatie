// src/pages/OnboardingPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextSizeController from "../components/TextSizeController/TextSizeController";
import "../styles/OnboardingPage.css";
import { useSelector } from "react-redux";
import type { Rootstate } from "../state/store";

interface OnboardingStep {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  showTextSizeController?: boolean;
}

interface OnboardingPageProps {
  steps?: OnboardingStep[];
  onComplete?: () => void;
}

const defaultSteps: OnboardingStep[] = [
  {
    title: "Welkom bij GRZ Plus!",
    subtitle: "Stel eerst je voorkeuren in",
    description:
      "We zijn blij je aan boord te hebben. Voordat we beginnen, kun je hieronder de tekstgrootte aanpassen naar wat voor jou het prettigst leest.",
    icon: "⚙️",
    textColor: "white",
    showTextSizeController: true,
  },
  {
    title: "Jouw formulieren",
    subtitle: "Hier geef je aan wat jouw ervaring is in elke ruimte",
    description:
      "Dit zijn de formulieren die je moet invullen zodat wij weten waar jij thuis nog meer ondersteuning bij nodig hebt.",
    image: "onboarding/form-grid.png",
    textColor: "white",
  },
  {
    title: "Formulier",
    subtitle: "Laat ons weten hoe jouw ervaring thuis is",
    description:
      "Via deze formulieren kan je ons laten weten hoe jouw ervaring thuis zijn. Laat het ons weten wanneer er iets mis gaat en hoe dit verholpen kan worden in de toekomst!",
    image: "/onboarding/formulier.png",
    textColor: "white",
  },
  {
    title: "Ja Nee vragen",
    subtitle: "Klik op ja of op nee",
    description:
      "Als je op Ja drukt vragen we nog even om een toelichting. Laat ons weten hoe jouw ervaring precies",
    image: "/onboarding/ja-nee-vragen.png",
    textColor: "white",
  },
  {
    title: "Geef jouw beoordeling",
    subtitle: "Laat ons zien hoe het met u gaat",
    description:
      "Met deze smileys kan je aangeven hoe jouw ervaring is geweest. Dit kan gaan van heel goed, naar heel slecht",
    image: "/onboarding/rating-questions.png",
    textColor: "white",
  },
  {
    title: "Voeg een foto toe",
    subtitle: "Geef ons inzicht in uw ervaring",
    description:
      "Door op deze knop te drukken kunt u foto's toevoegen. Dit kan heel erg behulpzaam zijn voor een zorgverlener om beter grip te krijgen op uw unieke ervaring",
    image: "/onboarding/screenshot.png",
    textColor: "white",
  },
  {
    title: "Klaar om te Beginnen!",
    subtitle: "Laten we aan de slag gaan",
    description:
      "Je bent nu klaar om GRZ Plus ten volle te benutten. Veel succes en welkom bij het team!",
    icon: "🚀",
    textColor: "white",
  },
];

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  steps = defaultSteps,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const userRole = useSelector((state: Rootstate) => state.authorization.role);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      console.log(userRole);
      if (userRole === "patient") {
        navigate("/formulieren");
      }
      if (userRole === "caregiver") {
        navigate("/dashboard");
      }
      if (userRole === "admin") {
        navigate("/dashboard");
      }
      if (userRole == null) {
        navigate("/login");
      }
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="onboarding-page">
      {/* Skip button */}
      <button className="skip-button" onClick={handleSkip}>
        Overslaan
      </button>

      {/* Main content */}
      <div
        className="onboarding-slide"
        style={{
          background: currentStepData.backgroundColor || "#f8fafc",
          color: currentStepData.textColor || "#1a202c",
        }}
      >
        <div className="onboarding-controls">
          {/* Progress indicators */}
          <div className="step-indicators">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`step-dot ${index === currentStep ? "active" : ""} ${
                  index < currentStep ? "completed" : ""
                }`}
                onClick={() => goToStep(index)}
                aria-label={`Ga naar stap ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="onboarding-navigation">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`nav-button prev-button ${
                isFirstStep ? "invisible" : ""
              }`}
            >
              <span className="nav-icon">←</span>
              Vorige
            </button>

            <div className="progress-info">
              <span className="step-counter">
                {currentStep + 1} / {steps.length}
              </span>
            </div>

            <button
              onClick={nextStep}
              className={`nav-button next-button ${
                isLastStep ? "complete-button" : ""
              }`}
            >
              {isLastStep ? (
                <>
                  Beginnen
                  <span className="nav-icon">✓</span>
                </>
              ) : (
                <>
                  Volgende
                  <span className="nav-icon">→</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="onboarding-content">
          {/* Visual content */}
          <div className="onboarding-visual">
            {currentStepData.image ? (
              <div className="onboarding-image-container">
                <img
                  src={currentStepData.image}
                  alt={currentStepData.title}
                  className="onboarding-image"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.currentTarget.style.display = "none";
                    const fallback =
                      e.currentTarget.parentElement?.querySelector(
                        ".image-fallback"
                      );
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="image-fallback">
                  <div className="fallback-icon">📱</div>
                </div>
              </div>
            ) : currentStepData.icon ? (
              <div className="onboarding-icon">{currentStepData.icon}</div>
            ) : null}
          </div>

          {/* Text content */}
          <div className="onboarding-text">
            <h1 className="onboarding-title">{currentStepData.title}</h1>

            {currentStepData.subtitle && (
              <p className="onboarding-subtitle">{currentStepData.subtitle}</p>
            )}

            <h1 className="onboarding-description">
              {currentStepData.description}
            </h1>

            {/* Text Size Controller - only show on first step */}
            {currentStepData.showTextSizeController && (
              <div className="onboarding-text-controller">
                <TextSizeController className="onboarding-controller" />
                <p className="controller-help-text">
                  💡 Tip: Je kunt de tekstgrootte later altijd aanpassen via de
                  instellingen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
