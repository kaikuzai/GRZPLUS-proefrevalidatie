import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DynamicForm.css";
import styles from "./DynamicForm.module.css";
import useFormSlug from "../../hooks/useFormSlug";
import useSubmitForm from "../../hooks/useSubmitForm";
import TextSizeController from "../TextSizeController/TextSizeController";
import {
  SmileyVeryBad,
  SmileyBad,
  SmileyNeutral,
  SmileyGood,
  SmileyVeryGood,
} from "../../assets/smileySVG";

// Form field types
interface FormField {
  id: string;
  type: "text" | "yesno" | "rating";
  label: string;
  placeholder?: string;
  required: boolean;
}

// Modified interface to include labels
interface FormValues {
  [key: string]: {
    value: string;
    label: string;
  };
}

// Alert modal interface
interface AlertModal {
  show: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

// Rating values mapping
const RATING_VALUES = {
  veryBad: "very bad",
  bad: "bad",
  neutral: "neutral",
  good: "good",
  veryGood: "very good",
};

const DynamicForm = () => {
  const navigate = useNavigate();

  const { slug } = useParams();
  const { formData, loading, error } = useFormSlug(slug!);
  const { submitForm } = useSubmitForm();

  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<AlertModal>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const showAlert = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, show: false }));

    // If it was a success alert, navigate back to forms page
    if (alertModal.type === "success") {
      navigate("/formulieren");
    }
  };

  const handleInputChange = (fieldId: string, value: string, label: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: {
        value,
        label,
      },
    }));

    // Clear field from errors when user starts typing
    if (errors.includes(fieldId)) {
      setErrors(errors.filter((id) => id !== fieldId));
    }
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setValues({});
    setErrors([]);
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: string[] = [];

    formData?.fields.forEach((field) => {
      if (
        field.required &&
        (!values[field.id] || values[field.id].value.trim() === "")
      ) {
        newErrors.push(field.id);
      }

      // Validate explanation fields for yes answers
      if (field.type === "yesno" && values[field.id]?.value === "yes") {
        const explanationId = `${field.id}_explanation`;
        if (
          !values[explanationId] ||
          values[explanationId].value.trim() === ""
        ) {
          newErrors.push(explanationId);
        }
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data with labels included
    try {
      console.log("Preparing to submit form data");

      // Submit form if we have the required data
      if (formData?.name && formData?.id) {
        console.log("Form values before submission:", values);
        const succeeded = await submitForm(formData.id, formData.name, values);

        if (succeeded) {
          showAlert(
            "success",
            "Fantastisch Gedaan!",
            "Je formulier is perfect ingevuld en succesvol verzonden! We kunnen nu jouw formulier inzien. Blijf zo doorgaan!"
          );
        } else {
          showAlert(
            "error",
            "Verzending Mislukt",
            "Er ging wat mis bij het verzenden van je formulier. Probeer het opnieuw."
          );
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      showAlert(
        "error",
        "Onverwachte Fout",
        "Er is een onverwachte fout opgetreden. Probeer het later opnieuw."
      );
    }
  };

  const renderField = (field: FormField) => {
    const hasError = errors.includes(field.id);

    switch (field.type) {
      case "text":
        return (
          <div
            className={`form-field ${hasError ? "error" : ""}`}
            key={field.id}
          >
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id={field.id}
              placeholder={field.placeholder || ""}
              value={values[field.id]?.value || ""}
              onChange={(e) =>
                handleInputChange(field.id, e.target.value, field.label)
              }
              className={hasError ? "error-input" : ""}
            />
            {hasError && <p className="error-message">Dit veld is verplicht</p>}
          </div>
        );

      case "yesno":
        const showExplanation = values[field.id]?.value === "yes";
        const explanationId = `${field.id}_explanation`;
        const explanationHasError = errors.includes(explanationId);
        const currentYesNoValue = values[field.id]?.value;

        return (
          <div key={field.id}>
            <div className={`form-field ${hasError ? "error" : ""}`}>
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              <div className="yesno-group">
                <button
                  type="button"
                  className={`yesno-button ${
                    currentYesNoValue === "yes" ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleInputChange(field.id, "yes", field.label)
                  }
                >
                  Ja
                </button>
                <button
                  type="button"
                  className={`yesno-button ${
                    currentYesNoValue === "no" ? "selected" : ""
                  }`}
                  onClick={() => handleInputChange(field.id, "no", field.label)}
                >
                  Nee
                </button>
              </div>
              {hasError && (
                <p className="error-message">Selecteer één van de opties</p>
              )}
            </div>

            {/* Explanation field that appears when "yes" is selected */}
            {showExplanation && (
              <div
                className={`form-field ${explanationHasError ? "error" : ""}`}
              >
                <label htmlFor={explanationId}>
                  Toelichting
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id={explanationId}
                  placeholder="Geef een toelichting waarom u 'Ja' heeft geantwoord"
                  value={values[explanationId]?.value || ""}
                  onChange={(e) =>
                    handleInputChange(
                      explanationId,
                      e.target.value,
                      `Toelichting - ${field.label}`
                    )
                  }
                  className={explanationHasError ? "error-input" : ""}
                />
                {explanationHasError && (
                  <p className="error-message">Toelichting is verplicht</p>
                )}
              </div>
            )}
          </div>
        );

      case "rating":
        const currentRating = values[field.id]?.value;
        const showRatingExplanation =
          currentRating &&
          ["very bad", "bad", "neutral"].includes(currentRating);
        const ratingExplanationId = `${field.id}_explanation`;
        const ratingExplanationHasError = errors.includes(ratingExplanationId);
        SmileyVeryGood;

        return (
          <div key={field.id}>
            <div className={`form-field ${hasError ? "error" : ""}`}>
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              <div className="rating-group">
                <div
                  className="rating-option"
                  onClick={() =>
                    handleInputChange(
                      field.id,
                      RATING_VALUES["veryBad"],
                      field.label
                    )
                  }
                  title="Zeer slecht"
                >
                  <SmileyVeryBad selected={currentRating === "very bad"} />
                  <span>Zeer slecht</span>
                </div>
                <div
                  className="rating-option"
                  onClick={() =>
                    handleInputChange(
                      field.id,
                      RATING_VALUES["bad"],
                      field.label
                    )
                  }
                  title="Slecht"
                >
                  <SmileyBad selected={currentRating === "bad"} />
                  <span>Slecht</span>
                </div>
                <div
                  className="rating-option"
                  onClick={() =>
                    handleInputChange(
                      field.id,
                      RATING_VALUES["neutral"],
                      field.label
                    )
                  }
                  title="Neutraal"
                >
                  <SmileyNeutral selected={currentRating === "neutral"} />
                  <span>Neutraal</span>
                </div>
                <div
                  className="rating-option"
                  onClick={() =>
                    handleInputChange(
                      field.id,
                      RATING_VALUES["good"],
                      field.label
                    )
                  }
                  title="Goed"
                >
                  <SmileyGood selected={currentRating === "good"} />
                  <span>Goed</span>
                </div>
                <div
                  className="rating-option"
                  onClick={() =>
                    handleInputChange(
                      field.id,
                      RATING_VALUES["veryGood"],
                      field.label
                    )
                  }
                  title="Zeer goed"
                >
                  <SmileyVeryGood selected={currentRating === "very good"} />
                  <span>Zeer goed</span>
                </div>
              </div>
              {hasError && (
                <p className="error-message">Selecteer een waardering</p>
              )}
            </div>

            {/* Explanation field that appears when negative rating is selected */}
            {showRatingExplanation && (
              <div
                className={`form-field ${
                  ratingExplanationHasError ? "error" : ""
                }`}
              >
                <label htmlFor={ratingExplanationId}>
                  Toelichting
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id={ratingExplanationId}
                  placeholder="Geef een toelichting bij uw waardering"
                  value={values[ratingExplanationId]?.value || ""}
                  onChange={(e) =>
                    handleInputChange(
                      ratingExplanationId,
                      e.target.value,
                      `Toelichting - ${field.label}`
                    )
                  }
                  className={ratingExplanationHasError ? "error-input" : ""}
                />
                {ratingExplanationHasError && (
                  <p className="error-message">Toelichting is verplicht</p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (error || !formData) {
    return (
      <div className="error-container">
        Failed to load form. Please try again later.
      </div>
    );
  }

  return (
    <div className="dynamic-form-container">
      <TextSizeController />
      <h1 className="form-title">{formData.name}</h1>
      <h2 className="form-subtitle">
        Laat de revalidant deze vragen zoveel mogelijk zelf beantwoorden. U mag
        helpen met lezen of invullen, maar het gaat om de ervaring van de
        revalidant.
      </h2>

      <button
        className="return-button"
        onClick={() => navigate("/formulieren")}
      >
        Terug naar Formulieren
      </button>

      <form onSubmit={handleSubmit} className="dynamic-form">
        {formData.fields.map((field) => renderField(field))}

        <div className="form-actions">
          <button type="button" className="clear-button" onClick={handleClear}>
            Formulier Legen
          </button>
          <button type="submit" className={styles.submitButton}>
            Verzenden
          </button>
        </div>
      </form>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Formulier Legen?</h3>
            <p>
              Weet je zeker dat je alle formuliervelden wilt wissen? Deze actie
              kan niet ongedaan worden gemaakt.
            </p>
            <div className="modal-actions">
              <button onClick={cancelClear} className="cancel-button">
                Annuleren
              </button>
              <button onClick={confirmClear} className="confirm-button">
                Legen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertModal.show && (
        <div className="modal-overlay">
          <div className={`modal ${alertModal.type}-alert`}>
            {alertModal.type === "success" && (
              <div className="alert-icon success"></div>
            )}
            {alertModal.type === "error" && (
              <div className="alert-icon error">⚠️</div>
            )}
            <h3>{alertModal.title}</h3>
            <p>{alertModal.message}</p>
            <div className="modal-actions">
              <button
                onClick={closeAlert}
                className={
                  alertModal.type === "success"
                    ? "success-button"
                    : "error-button"
                }
              >
                {alertModal.type === "success" ? "Doorgaan" : "Probeer Opnieuw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
