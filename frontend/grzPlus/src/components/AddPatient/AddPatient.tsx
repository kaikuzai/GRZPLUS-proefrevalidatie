import { useState, useEffect } from "react";
import useRegisterPatient from "../../hooks/useRegisterPatient";
import "./AddPatient.css";

// Patient type definition
interface Patient {
  firstName: string;
  lastName: string;
  email: string;
}

// Mock function to simulate API call to check if email exists
const checkEmailExists = async (email: string): Promise<boolean> => {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // List of mock emails that are "already in the system"
  const existingEmails = [
    "john.doe@example.com",
    "jane.smith@example.com",
    "michael.brown@example.com",
    "emily.wilson@example.com",
    "robert.johnson@example.com",
    "dylan.okyere@gmail.com",
  ];

  return existingEmails.includes(email);
};

// Mock function to simulate API call to add a new patient
const addPatient = async (
  firstName: string,
  lastName: string,
  email: string
): Promise<Patient> => {
  // call register
  const { register } = useRegisterPatient();

  await register(firstName, lastName, email);

  // Create new patient object
  const newPatient: Patient = {
    firstName,
    lastName,
    email,
  };

  return newPatient;
};

const AddPatient = () => {
  // Form state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { register } = useRegisterPatient();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailCheckPending, setEmailCheckPending] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [addedPatient, setAddedPatient] = useState<Patient | null>(null);

  // Validation state
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  // Check email uniqueness when email changes
  useEffect(() => {
    const validateEmail = async () => {
      // Don't check if email is empty or invalid format
      if (!email || !isValidEmail(email)) {
        setEmailError(null);
        return;
      }

      setEmailCheckPending(true);
      try {
        const exists = await checkEmailExists(email);
        if (exists) {
          setEmailError("Dit e-mailadres is al geregistreerd in het systeem.");
        } else {
          setEmailError(null);
        }
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setEmailCheckPending(false);
      }
    };

    // Debounce to avoid too many requests while typing
    const timeoutId = setTimeout(validateEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } = {};

    if (!firstName.trim()) {
      errors.firstName = "Voornaam is verplicht";
    }

    if (!lastName.trim()) {
      errors.lastName = "Achternaam is verplicht";
    }

    if (!email.trim()) {
      errors.email = "Email is verplicht";
    } else if (!isValidEmail(email)) {
      errors.email = "Voer een geldig e-mailadres in";
    }

    if (emailError) {
      errors.email = emailError;
    }

    // If there are errors, show them and don't proceed
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Proceed with submission
    setIsSubmitting(true);
    try {
      const patient = await addPatient(firstName, lastName, email);
      setAddedPatient(patient);
      setShowConfirmation(true);

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setFormErrors({});
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Het toevoegen van de patiënt is mislukt. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clear button
  const handleClear = () => {
    // If form has data, show confirmation
    if (firstName || lastName || email) {
      setShowClearConfirm(true);
    }
  };

  // Confirm clear action
  const confirmClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setFormErrors({});
    setEmailError(null);
    setShowClearConfirm(false);
  };

  // Cancel clear action
  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  // Close confirmation popup
  const closeConfirmation = () => {
    setShowConfirmation(false);
    setAddedPatient(null);
  };

  return (
    <div className="add-patient-container">
      <h1 className="page-title">Voeg Nieuwe Patiënt Toe</h1>

      <form className="add-patient-form" onSubmit={handleSubmit}>
        <div className={`form-field ${formErrors.firstName ? "error" : ""}`}>
          <label htmlFor="firstName">
            Voornaam <span className="required">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
          />
          {formErrors.firstName && (
            <p className="error-message">{formErrors.firstName}</p>
          )}
        </div>

        <div className={`form-field ${formErrors.lastName ? "error" : ""}`}>
          <label htmlFor="lastName">
            Achternaam <span className="required">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
          />
          {formErrors.lastName && (
            <p className="error-message">{formErrors.lastName}</p>
          )}
        </div>

        <div
          className={`form-field ${
            formErrors.email || emailError ? "error" : ""
          }`}
        >
          <label htmlFor="email">
            Email Adres <span className="required">*</span>
          </label>
          <div className="email-input-container">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            {emailCheckPending && (
              <div className="email-checking">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          {emailError && <p className="error-message">{emailError}</p>}
          {formErrors.email && !emailError && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            disabled={isSubmitting}
          >
            Formulier legen
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !!emailError}
          >
            {isSubmitting ? "Patiënt wordt toegevoegd..." : "Voeg Patiënt Toe"}
          </button>
        </div>
      </form>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Formulier?</h3>
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

      {/* Success confirmation modal */}
      {showConfirmation && addedPatient && (
        <div className="modal-overlay">
          <div className="modal success-modal">
            <div className="success-icon">✓</div>
            <h3>Patiënt Succesvol Toegevoegd</h3>
            <p>
              <strong>
                {addedPatient.firstName} {addedPatient.lastName}
              </strong>{" "}
              is aan het systeem toegevoegd!
            </p>
            <p className="email-sent-message">
              Een e-mailuitnodiging is verstuurd naar{" "}
              <strong>{addedPatient.email}</strong>
              met instructies over hoe ze hun profiel kunnen aanvullen en
              toegang kunnen krijgen tot het patiëntenportaal.
            </p>
            <div className="modal-actions">
              <button onClick={closeConfirmation} className="primary-button">
                Doorgaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPatient;
