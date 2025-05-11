import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosError } from "axios";

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

const useSubmittedForms = () => {
  const [data, setData] = useState<FormResponse[]>();
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<FormResponse[]>(
          "api/forms/submitted/"
        );
        setData(response.data);
        console.log("after api response data", response.data);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setIsLoading(false);
        console.log("after api data set", data);
      }
    };
    fetchData();
  }, []);

  return { data, error, isLoading };
};

export default useSubmittedForms;
