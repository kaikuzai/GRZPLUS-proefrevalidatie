import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DynamicForm.css";

// Form field types
interface FormField {
  id: string;
  type: "text" | "yesno";
  label: string;
  placeholder?: string;
  required: boolean;
}

// Form data structure
interface FormData {
  id: string;
  name: string;
  fields: FormField[];
}

// Hook to fetch form data (mock implementation)
const useFormData = (formId: string) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock form data
        const data: FormData = {
          id: formId,
          name: "Health Assessment Form",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
            },
            {
              id: "age",
              type: "text",
              label: "Age",
              placeholder: "Enter your age",
              required: true,
            },
            {
              id: "smoker",
              type: "yesno",
              label: "Do you smoke?",
              required: true,
            },
            {
              id: "exercise",
              type: "yesno",
              label: "Do you exercise regularly?",
              required: false,
            },
            {
              id: "allergies",
              type: "text",
              label: "Do you have any allergies?",
              placeholder: "List allergies or write 'None'",
              required: false,
            },
          ],
        };

        setFormData(data);
      } catch (err) {
        setError("Failed to load form data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  return { formData, loading, error };
};

interface FormValues {
  [key: string]: string;
}

const DynamicForm = () => {
  const navigate = useNavigate();
  // In a real app, you would get this ID from URL params or props
  const formId = "sample-form";
  const { formData, loading, error } = useFormData(formId);

  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleInputChange = (fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
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
        (!values[field.id] || values[field.id].trim() === "")
      ) {
        newErrors.push(field.id);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data
    try {
      // This would be your API call in a real app
      console.log("Submitting form data:", values);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
              value={values[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={hasError ? "error-input" : ""}
            />
            {hasError && (
              <p className="error-message">This field is required</p>
            )}
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
                  checked={values[field.id] === "yes"}
                  onChange={() => handleInputChange(field.id, "yes")}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value="no"
                  checked={values[field.id] === "no"}
                  onChange={() => handleInputChange(field.id, "no")}
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
