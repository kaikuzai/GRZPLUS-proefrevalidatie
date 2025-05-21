import { useState, useEffect } from "react";

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

/**
 * Custom hook for fetching submitted forms for a specific patient
 * @param patientId - The ID of the patient to fetch forms for (optional)
 * @returns Object containing forms data, loading state, and error state
 */
const usePatientForms = (patientId?: string) => {
  const [data, setData] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        setError(null);

        const url = patientId
          ? `/api/forms/submitted-forms/?user_id=${patientId}`
          : "/api/forms/submitted-forms/";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error fetching forms: ${response.status}`);
        }

        const formsData = await response.json();
        setData(formsData);
      } catch (err) {
        console.error("Error in usePatientForms:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [patientId]);

  return { data, loading, error };
};

export default usePatientForms;
