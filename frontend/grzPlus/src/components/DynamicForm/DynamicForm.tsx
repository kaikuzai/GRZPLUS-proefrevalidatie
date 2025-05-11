import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DynamicForm.css";
import useFormSlug from "../../hooks/useFormSlug";
import useSubmitForm from "../../hooks/useSubmitForm";

// Form field types
interface FormField {
  id: string;
  type: "text" | "yesno";
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

const DynamicForm = () => {
  const navigate = useNavigate();

  const { slug } = useParams();
  const { formData, loading, error } = useFormSlug(slug!);
  const { submitForm } = useSubmitForm();

  console.log("formdata: ", formData);

  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

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
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data with labels included
    try {
      // This would be your API call in a real app
      console.log("Submitting form data:", values);

      // Mock API call
      if (formData?.name && formData?.id) {
        await submitForm(formData.id, formData.name, values);
      }

      alert("Form submitted successfully!");
      // Navigate back to forms page
      navigate("/formulieren");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form. Please try again.");
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
        return (
          <div
            className={`form-field ${hasError ? "error" : ""}`}
            key={field.id}
          >
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value="yes"
                  checked={values[field.id]?.value === "yes"}
                  onChange={() =>
                    handleInputChange(field.id, "yes", field.label)
                  }
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value="no"
                  checked={values[field.id]?.value === "no"}
                  onChange={() =>
                    handleInputChange(field.id, "no", field.label)
                  }
                />
                No
              </label>
            </div>
            {hasError && (
              <p className="error-message">Please select an option</p>
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
      <h1 className="form-title">{formData.name}</h1>

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
          <button type="submit" className="submit-button">
            Verzenden
          </button>
        </div>
      </form>

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
    </div>
  );
};

export default DynamicForm;
