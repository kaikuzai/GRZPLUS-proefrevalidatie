import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFormsIcons from "../../hooks/useFormIcons";
import "./FormGrid.css";
import useCompletedForms from "../../hooks/useCompletedForms";

interface ConfirmationModalProps {
  isOpen: boolean;
  formName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  formName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Formulier opnieuw invullen?</h3>
        <p>
          Je hebt het formulier "{formName}" al ingevuld. Wil je het opnieuw
          invullen?
        </p>
        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onCancel}>
            Nee, ga terug
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Ja, opnieuw invullen
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProgressIndicatorProps {
  completed: number;
  total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completed,
  total,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3>Je voortgang</h3>
        <span className="progress-text">
          {completed} van {total} formulieren ingevuld
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-percentage">{percentage}%</div>
    </div>
  );
};

const FormGrid = () => {
  const { data: forms } = useFormsIcons();
  const { completedFormSlugs, isLoading: completedFormsLoading } =
    useCompletedForms();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<{
    slug: string;
    name: string;
  } | null>(null);

  const handleFormClick = (slug: string, name: string) => {
    const isCompleted = completedFormSlugs.includes(slug);

    if (isCompleted) {
      setSelectedForm({ slug, name });
      setShowModal(true);
    } else {
      navigate(`/formulier/${slug}`);
    }
  };

  const handleConfirmRetake = () => {
    if (selectedForm) {
      navigate(`/formulier/${selectedForm.slug}`);
    }
    setShowModal(false);
    setSelectedForm(null);
  };

  const handleCancelRetake = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  if (!forms || completedFormsLoading) {
    return <div className="loading">Laden...</div>;
  }

  const completedCount = forms.filter((form) =>
    completedFormSlugs.includes(form.slug)
  ).length;

  return (
    <>
      <ProgressIndicator completed={completedCount} total={forms.length} />

      <div className="grid-container">
        {forms.map((form, index) => {
          const isCompleted = completedFormSlugs.includes(form.slug);

          return (
            <div
              key={index}
              className={`grid-item ${isCompleted ? "completed" : ""}`}
              onClick={() => handleFormClick(form.slug, form.name)}
            >
              <div className="grid-item-content">
                <img
                  src={form.image ? form.image : "/logo-grzplus.svg"}
                  alt={form.description}
                  className="grid-icon"
                />
                {isCompleted && (
                  <div className="completion-indicator">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" fill="#10B981" />
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="grid-label">{form.name}</div>
              {isCompleted && <div className="completion-text">Ingevuld</div>}
            </div>
          );
        })}
      </div>

      <ConfirmationModal
        isOpen={showModal}
        formName={selectedForm?.name || ""}
        onConfirm={handleConfirmRetake}
        onCancel={handleCancelRetake}
      />
    </>
  );
};

export default FormGrid;
