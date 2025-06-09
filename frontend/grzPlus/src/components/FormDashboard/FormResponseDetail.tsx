import React from "react";
import "./FormResponseDetail.css";

// Types for form responses
interface FormResponse {
  id: string | number;
  formId: string;
  formName: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  answers: string | { [key: string]: string }; // Accept either string or object
  contentUrl?: string | null;
}

interface FormResponseDetailProps {
  response: FormResponse;
  onBack: () => void;
}

const FormResponseDetail: React.FC<FormResponseDetailProps> = ({
  response,
  onBack,
}) => {
  // Parse answers if they're in string format
  const parseAnswers = (): { [key: string]: string } => {
    // If answers is already an object, return it
    if (typeof response.answers === "object" && response.answers !== null) {
      return response.answers;
    }

    // If answers is a string, parse it
    if (typeof response.answers === "string") {
      try {
        // Handle Python-style dictionary format
        const cleanedString = response.answers
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/(\w+):/g, '"$1":'); // Add quotes around keys

        return JSON.parse(cleanedString);
      } catch (error) {
        console.error("Failed to parse answers:", error);
        return {}; // Return empty object if parsing fails
      }
    }

    return {}; // Default empty object
  };

  const answersObject = parseAnswers();

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
    const cleanKey = key.replace(/^(is|has|should|can)/, "");

    return cleanKey
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  // Format answer for display based on assumed question type
  const formatAnswer = (key: string, value: string) => {
    if (value.toLowerCase() === "yes" || value.toLowerCase() === "no") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (value.toLowerCase() === "true") return "Yes";
    if (value.toLowerCase() === "false") return "No";

    return value;
  };

  // Get answers starting with "Toelichting -"
  const getToelichtingAnswers = (): { [key: string]: string } => {
    const toelichtingAnswers: { [key: string]: string } = {};

    Object.entries(answersObject).forEach(([key, value]) => {
      if (key.startsWith("Toelichting -")) {
        toelichtingAnswers[key] = value;
      }
    });

    return toelichtingAnswers;
  };

  const toelichtingAnswers = getToelichtingAnswers();

  const handleDownload = () => {
    if (response.contentUrl) {
      const link = document.createElement("a");
      link.href = response.contentUrl;
      link.download = `form-media-${response.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Check if the file is an image or video based on URL
  const getFileType = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm"];

    const lowerUrl = url.toLowerCase();

    if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
      return "image";
    } else if (videoExtensions.some((ext) => lowerUrl.includes(ext))) {
      return "video";
    }
    return "unknown";
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    const toelichtingText = Object.entries(toelichtingAnswers)
      .map(([key, value]) => {
        // Remove "Toelichting -" from the key before formatting
        const cleanKey = key.replace("Toelichting -", "").trim();
        return `${formatKey(cleanKey)}: ${value}`;
      })
      .join("\n");

    navigator.clipboard.writeText(toelichtingText).then(() => {
      alert("Samenvatting is gekopieerd");
    });
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
            <strong>Patiënt:</strong> {response.patientName || "N/A"}
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
          {Object.entries(answersObject).map(([key, value]) => (
            <div className="answer-item" key={key}>
              <div className="answer-label">{formatKey(key)}:</div>
              <div className="answer-value">{formatAnswer(key, value)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="response-content-extra">
        <div className="header-area">
          <h2>Samenvatting</h2>
          <button onClick={copyToClipboard} className="copy-button">
            Kopieer
          </button>
        </div>
        <div className="answer-container">
          {Object.entries(toelichtingAnswers).map(([key, value]) => (
            <div className="answer-item" key={key}>
              <div className="answer-label">
                {formatKey(key).replace("Toelichting -", "")}:
              </div>
              <div className="answer-value">{formatAnswer(key, value)}</div>
            </div>
          ))}
        </div>
      </div>
      {response.contentUrl && (
        <div className="response-content-extra">
          <div className="header-area">
            <h2>Bijgevoegd Bestand</h2>
            <button
              onClick={handleDownload}
              className="copy-button download-button"
            >
              Download
            </button>
          </div>
          <div className="media-container">
            {getFileType(response.contentUrl) === "image" ? (
              <img
                src={response.contentUrl}
                alt="Formulier bijlage"
                className="media-preview"
              />
            ) : getFileType(response.contentUrl) === "video" ? (
              <video
                src={response.contentUrl}
                controls
                className="media-preview"
              >
                Uw browser ondersteunt geen video weergave.
              </video>
            ) : (
              <div className="media-placeholder">
                <p>Bestand beschikbaar voor download</p>
                <p className="file-url">
                  {response.contentUrl.split("/").pop()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponseDetail;
