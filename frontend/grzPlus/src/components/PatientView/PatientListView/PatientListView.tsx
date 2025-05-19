import { useState, useEffect } from "react";
import "./PatientListView.css";
import PatientFormView from "../SinglePatientView/PatientView";
import apiClient from "../../../services/api-client";

interface Patient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  [key: string]: string | undefined;
}

const PatientListView = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Fetch patients with role 'patient'
        const response = await apiClient.get<Patient[]>(
          "/api/users/users/?role=patient"
        );

        const data = response.data;
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patient list");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${patient.first_name} ${patient.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [patients, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  if (loading) {
    return <div className="patients-loading">Patiëntenlijst laden...</div>;
  }

  if (error) {
    return <div className="patients-error">Error: {error}</div>;
  }

  // If a patient is selected, show their forms
  if (selectedPatient) {
    return (
      <PatientFormView patientId={selectedPatient} onBack={handleBackToList} />
    );
  }

  return (
    <div className="patient-list-view">
      <h1 className="patient-list-title">Patiënten Overzicht</h1>

      <div className="patient-list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Zoek op naam of email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="patient-count">
          {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "patiënt" : "patiënten"} gevonden
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-patients">
          Geen patiënten voldoen aan je zoekcriteria.
        </div>
      ) : (
        <div className="patient-grid">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => handlePatientSelect(patient.id)}
            >
              <div className="patient-card-avatar">
                {patient.first_name.charAt(0)}
                {patient.last_name.charAt(0)}
              </div>
              <div className="patient-card-info">
                <h3 className="patient-card-name">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="patient-card-email">{patient.email}</p>
              </div>
              <div className="patient-card-action">
                <button className="view-forms-btn">Bekijk formulieren</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientListView;
