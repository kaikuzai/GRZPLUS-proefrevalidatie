// src/pages/OnboardingPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OnboardingPage.css";

interface OnboardingStep {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface OnboardingPageProps {
  steps?: OnboardingStep[];
  onComplete?: () => void;
}

const defaultSteps: OnboardingStep[] = [
  {
    title: "Welkom bij GRZ Plus!",
    subtitle: "Je digitale werkplek",
    description:
      "We zijn blij je aan boord te hebben. GRZ Plus helpt je om efficiënter te werken en beter samen te werken met je team.",
    icon: "👋",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "white",
  },
  {
    title: "Jouw Dashboard",
    subtitle: "Alles in één oogopslag",
    description:
      "Hier vind je een overzicht van al je belangrijke informatie, recente activiteiten en lopende projecten. Je startpunt voor elke werkdag.",
    image: "onboarding/patienten-overzicht.png", // You'll need to add actual images
    backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    textColor: "white",
  },
  {
    title: "Jouw formulieren",
    subtitle: "Hier geef je aan wat jouw ervaring is in elke ruimte",
    description:
      "Dit zijn de formulieren die je moet invullen zodat wij weten waar jij thuis nog meer ondersteuning bij nodig hebt.",
    image: "onboarding/form-grid.png",
    backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    textColor: "white",
  },
  {
    title: "Formulier",
    subtitle: "Laat ons weten hoe jouw ervaring thuis is",
    description:
      "Via deze formulieren kan je ons laten weten hoe jouw ervaring thuis zijn. Laat het ons weten wanneer er iets mis gaat en hoe dit verholpen kan worden in de toekomst!",
    image: "/onboarding/formulier.png",
    backgroundColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    textColor: "white",
  },
  {
    title: "Klaar om te Beginnen!",
    subtitle: "Laten we aan de slag gaan",
    description:
      "Je bent nu klaar om GRZ Plus ten volle te benutten. Veel succes en welkom bij het team!",
    icon: "🚀",
    backgroundColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    textColor: "white",
  },
];

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  steps = defaultSteps,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

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
      // Default behavior: navigate to dashboard
      navigate("/dashboard");
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
              <h2 className="onboarding-subtitle">
                {currentStepData.subtitle}
              </h2>
            )}

            <p className="onboarding-description">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Bottom controls */}
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
      </div>
    </div>
  );
};

export default OnboardingPage;
