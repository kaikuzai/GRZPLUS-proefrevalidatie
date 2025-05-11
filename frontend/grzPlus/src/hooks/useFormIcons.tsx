import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosError } from "axios";

interface FormIcon {
  name: string;
  description: string;
  image: string | null;
  slug: string;
}

const useFormIcons = () => {
  const [data, setData] = useState<FormIcon[]>();
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<FormIcon[]>(
          "api/forms/form-icons/"
        );
        setData(response.data);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, error, isLoading };
};

export default useFormIcons;
