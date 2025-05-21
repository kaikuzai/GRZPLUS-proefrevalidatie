import { useState, useEffect } from "react";
import FormResponseDetail from "../../FormDashboard/FormResponseDetail";
import "./PatientView.css";
import apiClient from "../../../services/api-client";

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

interface PatientInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface PatientFormViewProps {
  patientId: string;
  onBack?: () => void;
}

const PatientFormView = ({ patientId, onBack }: PatientFormViewProps) => {
  const [patientForms, setPatientForms] = useState<FormResponse[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);

        // Fetch patient information
        const patientResponse = await apiClient.get(
          `/api/users/users/?user_id=${patientId}`
        );

        const patientData = patientResponse.data;

        setPatientInfo({
          id: patientData.id,
          email: patientData.email,
          firstName: patientData.first_name,
          lastName: patientData.last_name,
          streetAddress: patientData.street_address,
          city: patientData.city,
          state: patientData.state,
          zipCode: patientData.zip_code,
        });

        // Fetch patient form submissions
        const formsResponse = await apiClient.get(
          `/api/forms/submitted/?user_id=${patientId}`
        );

        const formsData = formsResponse.data;
        setPatientForms(formsData);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleFormClick = (form: FormResponse) => {
    setSelectedForm(form);
  };

  const handleBackToList = () => {
    setSelectedForm(null);
  };

  if (loading) {
    return <div className="patient-forms-loading">Gegevens laden...</div>;
  }

  if (error) {
    return <div className="patient-forms-error">Error: {error}</div>;
  }

  // Show form detail view if a form is selected
  if (selectedForm) {
    return (
      <FormResponseDetail response={selectedForm} onBack={handleBackToList} />
    );
  }

  return (
    <div className="patient-forms-view">
      {onBack && (
        <button className="back-button" onClick={onBack}>
          &larr; Terug naar Patiëntenlijst
        </button>
      )}

      <div className="patient-info-section">
        <h1 className="patient-name">
          {patientInfo?.firstName} {patientInfo?.lastName}
        </h1>

        <div className="patient-details">
          <div className="info-group">
            <h3>Contactgegevens</h3>
            <p>
              <strong>Email:</strong> {patientInfo?.email}
            </p>
          </div>

          <div className="info-group">
            <h3>Adres</h3>
            <p>{patientInfo?.streetAddress || "Niet gespecificeerd"}</p>
            {patientInfo?.city && patientInfo?.zipCode && (
              <p>
                {patientInfo.city}, {patientInfo.state} {patientInfo.zipCode}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="forms-section">
        <h2>Ingevulde formulieren ({patientForms.length})</h2>

        {patientForms.length === 0 ? (
          <div className="no-forms-message">
            Deze patiënt heeft nog geen formulieren ingevuld.
          </div>
        ) : (
          <div className="forms-list">
            {patientForms.map((form) => (
              <div
                key={form.id}
                className="form-card"
                onClick={() => handleFormClick(form)}
              >
                <div className="form-card-header">
                  <h3>{form.formName}</h3>
                  <span className="form-date">
                    {formatDate(form.submittedAt)}
                  </span>
                </div>
                <div className="form-card-footer">
                  <button className="view-details-btn">Details bekijken</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientFormView;
