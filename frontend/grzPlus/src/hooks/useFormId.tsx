import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

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

const useFormId = async (formId: string) => {
  const [data, setData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<FormData>(
          `api/forms/by-id/${formId}`
        );

        setData(response.data);
      } catch (error) {
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFormId;
