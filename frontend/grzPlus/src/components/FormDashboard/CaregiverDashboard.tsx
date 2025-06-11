import { useState, useEffect } from "react";
import "./CaregiverDashboard.css";
import FormResponseDetail from "./FormResponseDetail.tsx";
import useSubmittedForms from "../../hooks/useSubmittedForms.tsx";

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

// Custom hook to fetch form responses (mock implementation)
const useFormResponses = () => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { data } = useSubmittedForms();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);

        if (data) {
          setResponses(data);
        }
      } catch (err) {
        setError("Failed to load form responses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [data]);

  return { responses, loading, error };
};

const CaregiverDashboard = () => {
  const { responses, loading, error } = useFormResponses();
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>(
    []
  );
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null
  );

  // Update filtered responses when responses or filter changes
  useEffect(() => {
    if (emailFilter.trim() === "") {
      setFilteredResponses(responses);
    } else {
      const filtered = responses.filter((response) =>
        response.patientEmail.toLowerCase().includes(emailFilter.toLowerCase())
      );
      setFilteredResponses(filtered);
    }
  }, [responses, emailFilter]);

  const handleEmailFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(e.target.value);
  };

  const handleRowClick = (response: FormResponse) => {
    setSelectedResponse(response);
  };

  const handleBackToList = () => {
    setSelectedResponse(null);
  };

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

  if (loading) {
    return <div className="dashboard-loading">Formulieren inladen...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  // If a response is selected, show the detail view
  if (selectedResponse) {
    return (
      <FormResponseDetail
        response={selectedResponse}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="caregiver-dashboard">
      <h1 className="dashboard-title">Patiënt Formulier Antwoorden</h1>

      <div className="dashboard-controls">
        <div className="filter-container">
          <label htmlFor="email-filter">Filter met Email:</label>
          <input
            type="text"
            id="email-filter"
            value={emailFilter}
            onChange={handleEmailFilterChange}
            placeholder="Vul email van patient in"
          />
        </div>
        <div className="response-count">
          {filteredResponses.length}{" "}
          {filteredResponses.length === 1 ? "antwoord" : "antwoorden"} gevonden
        </div>
      </div>

      {filteredResponses.length === 0 ? (
        <div className="no-results">
          Geen formulierantwoorden voldoen aan je filtercriteria.
        </div>
      ) : (
        <div className="response-table-container">
          <table className="response-table">
            <thead>
              <tr>
                <th>Formulier Naam</th>
                <th>Patiënt Naam</th>
                <th>Email</th>
                <th>Inzenddatum</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((response) => (
                <tr
                  key={response.id}
                  onClick={() => handleRowClick(response)}
                  className="response-row"
                >
                  <td>{response.formName}</td>
                  <td>{response.patientName}</td>
                  <td>{response.patientEmail}</td>
                  <td>{formatDate(response.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CaregiverDashboard;
