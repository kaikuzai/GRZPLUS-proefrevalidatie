import { useState, useEffect } from "react";
import "./CaregiverDashboard.css";
import FormResponseDetail from "./FormResponseDetail.tsx";

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

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock response data
        const data: FormResponse[] = [
          {
            id: "resp-1",
            formId: "form-1",
            formName: "Health Assessment Form",
            patientName: "John Doe",
            patientEmail: "john.doe@example.com",
            submittedAt: "2025-05-07T14:30:00Z",
            answers: {
              name: "John Doe",
              age: "45",
              smoker: "yes",
              exercise: "no",
              allergies: "Peanuts, Shellfish",
            },
          },
          {
            id: "resp-2",
            formId: "form-1",
            formName: "Health Assessment Form",
            patientName: "Jane Smith",
            patientEmail: "jane.smith@example.com",
            submittedAt: "2025-05-06T10:15:00Z",
            answers: {
              name: "Jane Smith",
              age: "32",
              smoker: "no",
              exercise: "yes",
              allergies: "None",
            },
          },
          {
            id: "resp-3",
            formId: "form-2",
            formName: "Sleep Quality Assessment",
            patientName: "Michael Brown",
            patientEmail: "michael.brown@example.com",
            submittedAt: "2025-05-05T09:45:00Z",
            answers: {
              name: "Michael Brown",
              hoursOfSleep: "6",
              sleepQuality: "poor",
              medications: "None",
            },
          },
          {
            id: "resp-4",
            formId: "form-1",
            formName: "Health Assessment Form",
            patientName: "Emily Wilson",
            patientEmail: "emily.wilson@example.com",
            submittedAt: "2025-05-04T16:20:00Z",
            answers: {
              name: "Emily Wilson",
              age: "28",
              smoker: "no",
              exercise: "yes",
              allergies: "Lactose intolerance",
            },
          },
          {
            id: "resp-5",
            formId: "form-3",
            formName: "Pain Assessment",
            patientName: "Robert Johnson",
            patientEmail: "robert.johnson@example.com",
            submittedAt: "2025-05-03T11:10:00Z",
            answers: {
              name: "Robert Johnson",
              painLevel: "7",
              painLocation: "Lower back",
              painDuration: "3 weeks",
            },
          },
        ];

        setResponses(data);
      } catch (err) {
        setError("Failed to load form responses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

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
    return <div className="dashboard-loading">Loading responses...</div>;
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
            placeholder="Enter patient email"
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
