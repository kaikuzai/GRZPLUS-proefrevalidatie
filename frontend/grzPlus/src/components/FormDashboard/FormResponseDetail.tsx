import React from "react";
import "./FormResponseDetail.css";

// Types for form responses
interface FormResponse {
  id: string;
  formId: string;
  formName: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  answers: {
    [key: string]: string;
  };
}

interface FormResponseDetailProps {
  response: FormResponse;
  onBack: () => void;
}

const FormResponseDetail: React.FC<FormResponseDetailProps> = ({
  response,
  onBack,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format key for display (convert camelCase or snake_case to Title Case)
  const formatKey = (key: string) => {
    // Remove common prefixes if present
    const cleanKey = key.replace(/^(is|has|should|can)/, "");

    // Handle snake_case and camelCase
    return (
      cleanKey
        // Add space before capital letters for camelCase
        .replace(/([A-Z])/g, " $1")
        // Replace underscores with spaces for snake_case
        .replace(/_/g, " ")
        // Make first character uppercase and trim
        .replace(/^\w/, (c) => c.toUpperCase())
        .trim()
    );
  };

  // Format answer for display based on assumed question type
  const formatAnswer = (key: string, value: string) => {
    // Format yes/no answers for readability
    if (value.toLowerCase() === "yes" || value.toLowerCase() === "no") {
      console.log(key);
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Handle boolean-like values
    if (value.toLowerCase() === "true") return "Yes";
    if (value.toLowerCase() === "false") return "No";

    return value;
  };

  return (
    <div className="form-response-detail">
      <button className="back-button" onClick={onBack}>
        &larr; Terug naar Formulieren
      </button>

      <div className="response-header">
        <h1>{response.formName}</h1>
        <div className="response-meta">
          <p>
            <strong>Patiënt:</strong> {response.patientName}
          </p>
          <p>
            <strong>Email:</strong> {response.patientEmail}
          </p>
          <p>
            <strong>Inzenddatum:</strong> {formatDate(response.submittedAt)}
          </p>
        </div>
      </div>

      <div className="response-content">
        <h2>Antwoorden</h2>
        <div className="answer-container">
          {Object.entries(response.answers).map(([key, value]) => (
            <div className="answer-item" key={key}>
              <div className="answer-label">{formatKey(key)}:</div>
              <div className="answer-value">{formatAnswer(key, value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormResponseDetail;
