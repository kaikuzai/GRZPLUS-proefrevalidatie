import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import type { Rootstate } from "../state/store";

interface SubmittedForm {
  id: number;
  formId: string;
  formName: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  answers: string;
}

interface FormIcon {
  name: string;
  description: string;
  image: string | null;
  slug: string;
}

const useCompletedForms = () => {
  const user_id = useSelector((state: Rootstate) => state.authorization.id);

  const [completedFormSlugs, setCompletedFormSlugs] = useState<string[]>([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedForms = async () => {
      try {
        setIsLoading(true);

        const submittedResponse = await apiClient.get<SubmittedForm[]>(
          `api/forms/submitted/?user_id=${user_id}`
        );

        const formsResponse = await apiClient.get<FormIcon[]>(
          "api/forms/form-icons/"
        );

        const formNameToSlugMap = new Map<string, string>();
        formsResponse.data.forEach((form) => {
          formNameToSlugMap.set(form.name, form.slug);
        });

        const uniqueFormSlugs = new Set<string>();
        submittedResponse.data.forEach((submission) => {
          const slug = formNameToSlugMap.get(submission.formName);
          if (slug) {
            uniqueFormSlugs.add(slug);
          }
        });

        setCompletedFormSlugs(Array.from(uniqueFormSlugs));
      } catch (error) {
        setError(error as AxiosError);
        console.error("Error fetching completed forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedForms();
  }, []);

  return { completedFormSlugs, error, isLoading };
};

export default useCompletedForms;
